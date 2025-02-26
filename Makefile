SSL=./nginx/certs
HOSTNAME ?= $(shell hostname -i) 

createDir = mkdir -p $1


up: cert create_env_dev cp_env
	@chmod +x backend/script.sh
	docker-compose -f docker-compose.dev.yml up --build

prod: cert create_env cp_env
	@chmod +x backend/script.sh
	docker-compose up --build

front:
	docker-compose -f frontend/docker-compose.yml up --build

back:
	docker-compose -f backend/docker-compose.backend.yml up --build

down:
	docker-compose down --remove-orphans

re: down prune
	docker-compose build --no-cache
	docker-compose up

prune: env_prune
	@./backend/clean_migrations.sh
	docker-compose down --rmi all --volumes --remove-orphans

proxy:


.PHONY: up down prod re prune front backend

cert:
	$(call createDir,$(SSL))
	@if [ -f $(SSL)/privkey.key ] && [ -f $(SSL)/fullchain.crt ]; then \
		printf "$(LF)  🟢 $(P_BLUE)Certificates already exist $(P_NC)\n"; \
	else \
		docker run --rm --hostname $(HOSTNAME) -v $(SSL):/certs -it alpine sh -c 'apk add --no-cache nss-tools curl && curl -JLO "https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64" && mv mkcert-v1.4.4-linux-amd64 /usr/local/bin/mkcert && chmod +x /usr/local/bin/mkcert && mkcert -install && mkcert -key-file /certs/privkey.key -cert-file /certs/fullchain.crt $(HOSTNAME)' ; \
	fi

cp_env:
	@if [ ! -L frontend/.env ]; then cp ./.env frontend/.env; else echo "Env file frontend/.env already exists"; fi
	@if [ ! -L backend/users/management/commands/.env ]; then cp ./.env backend/users/management/commands/.env; else echo "Env File backend/users/management/commands/.env already exists"; fi

# testCert:
# 	@openssl x509 -in $(SSL)/fullchain.crt -text -noout

# Check if the .env file exists before removing it
env_prune:
	@if [ -f backend/users/management/command/.env ]; then \
		rm backend/users/management/command/.env; \
		echo "Env file at command removed."; \
	else \
		echo "No .env file found at command."; \
	fi

	@if [ -f ./frontend/.env ]; then \
		rm ./frontend/.env; \
		echo "Env file at frontend removed."; \
	else \
		echo "No frontend/.env file found."; \
	fi

create_env:
	@if [ -f .env ]; then rm .env; touch .env; else touch .env; fi
	  @cat ./.secrets >> .env
		@echo >> .env
		@echo "HOST_IP=$(HOSTNAME)" >> .env
		@echo >> .env
		@echo "FRONTEND_URL=https://$(HOSTNAME)" >> .env
		@echo  >> .env
		@echo "REACT_APP_BACKEND_URL=https://$(HOSTNAME)" >> .env
		@echo  >> .env
		@echo "REACT_APP_BACKEND_WS=https://$(HOSTNAME)" >> .env
		@echo  >> .env
		@echo "NGINX_SERVER_NAME=$(HOSTNAME)" >> .env


create_env_dev:
	@if [ -f .env ]; then rm .env; touch .env; else touch .env; fi
	  @cat ./.secrets.dev >> .env
		@echo >> .env
		@echo "HOST_IP=$(HOSTNAME)" >> .env
		@echo >> .env
		@echo "FRONTEND_URL=https://$(HOSTNAME)" >> .env
		@echo  >> .env
		@echo "REACT_APP_BACKEND_URL=https://$(HOSTNAME)" >> .env
		@echo  >> .env
		@echo "REACT_APP_BACKEND_WS=https://$(HOSTNAME)" >> .env
		@echo  >> .env
		@echo "NGINX_SERVER_NAME=$(HOSTNAME)" >> .env

