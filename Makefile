SSL=./nginx/certs
HOSTNAME ?= $(shell hostname -i)

createDir = mkdir -p $1


up: cert create_env cp_env
	@echo "🔄 Starting production environment..."
	@chmod +x backend/script.sh
	@echo "✅ Script permissions set."
	@echo "🚀 Bringing up production containers..."
	docker-compose up --build

dev: cert create_env_dev cp_env
	@echo "🔄 Starting development environment..."
	@chmod +x backend/script.sh
	@echo "✅ Script permissions set."
	@echo "🚀 Bringing up development containers..."
	docker-compose -f docker-compose.dev.yml up --build

front:
	@echo "🚀 Starting frontend..."
	docker-compose -f frontend/docker-compose.yml up --build

back:
	@echo "🚀 Starting backend..."
	docker-compose -f backend/docker-compose.backend.yml up --build

down:
	@echo "🛑 Stopping all containers..."
	docker-compose down --remove-orphans

re: down prune
	@echo "♻️  Rebuilding and restarting all containers..."
	docker-compose build --no-cache
	docker-compose up

prune: env_prune avatar_prune
	@echo "🧹 Cleaning up containers, images, and volumes..."
	@./backend/clean_migrations.sh
	docker-compose down --rmi all --volumes --remove-orphans

proxy:


.PHONY: up down prod re prune front backend

cert:
	@echo "🔍 Checking SSL certificates..."
	$(call createDir,$(SSL))
	@if [ -f $(SSL)/privkey.key ] && [ -f $(SSL)/fullchain.crt ]; then \
		echo "🟢 Certificates already exist."; \
	else \
		echo "🔧 Generating new SSL certificates..."; \
		docker run --rm --hostname $(HOSTNAME) -v $(SSL):/certs -it alpine sh -c 'apk add --no-cache nss-tools curl && curl -JLO "https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64" && mv mkcert-v1.4.4-linux-amd64 /usr/local/bin/mkcert && chmod +x /usr/local/bin/mkcert && mkcert -install && mkcert -key-file /certs/privkey.key -cert-file /certs/fullchain.crt $(HOSTNAME)'; \
		echo "✅ SSL certificates generated successfully."; \
	fi

cp_env:
	@echo "🔄 Copying environment files..."
	@if [ ! -L frontend/.env ]; then \
		cp ./.env frontend/.env; \
		echo "✅ Environment file copied to frontend."; \
	else \
		echo "⚠️  Env file frontend/.env already exists."; \
	fi

	@if [ ! -L backend/users/management/commands/.env ]; then \
		cp ./.env backend/users/management/commands/.env; \
		echo "✅ Environment file copied to backend."; \
	else \
		echo "⚠️  Env file backend/users/management/commands/.env already exists."; \
	fi

env_prune:
	@echo "🗑️  Removing old environment files..."
	@if [ -f backend/users/management/command/.env ]; then \
		rm backend/users/management/command/.env; \
		echo "✅ Env file at backend removed."; \
	else \
		echo "⚠️  No .env file found at backend."; \
	fi

	@if [ -f ./frontend/.env ]; then \
		rm ./frontend/.env; \
		echo "✅ Env file at frontend removed."; \
	else \
		echo "⚠️  No frontend/.env file found."; \
	fi

avatar_prune:
	@echo "🗑️  Removing profile pictures..."
	@find backend/media/avatars/ -type f -name "*" ! -name "avatar.png" -delete
	@echo "✅ Profile pictures removed."
	@echo "🗑️  Removing QR code images..."
	@rm -rf backend/media/qrcode/*
	@echo "✅ QR code images removed."


create_env:
	@echo "📄 Creating production .env file..."
	@if [ -f .env ]; then rm .env; echo "✅ Old .env removed."; fi
	touch .env
	@cat ./.secrets >> .env
	@echo "HOST_IP=$(HOSTNAME)" >> .env
	@echo "HOST_IP=$(HOSTNAME)" 
	@echo "FRONTEND_URL=https://$(HOSTNAME)" >> .env
	@echo "REACT_APP_BACKEND_URL=https://$(HOSTNAME)" >> .env
	@echo "REACT_APP_BACKEND_WS=wss://$(HOSTNAME)" >> .env
	@echo "NGINX_SERVER_NAME=$(HOSTNAME)" >> .env
	@echo "✅ Production .env file created."

create_env_dev:
	@echo "📄 Creating development .env file..."
	@if [ -f .env ]; then rm .env; echo "✅ Old .env removed."; fi
	touch .env
	@cat ./.secrets.dev >> .env
	@echo "HOST_IP=$(HOSTNAME)" >> .env
	@echo "HOST_IP=$(HOSTNAME)" 
	@echo "FRONTEND_URL=https://$(HOSTNAME)" >> .env
	@echo "REACT_APP_BACKEND_URL=https://$(HOSTNAME)" >> .env
	@echo "REACT_APP_BACKEND_WS=wss://$(HOSTNAME)" >> .env
	@echo "NGINX_SERVER_NAME=$(HOSTNAME)" >> .env
	@echo "✅ Development .env file created."

