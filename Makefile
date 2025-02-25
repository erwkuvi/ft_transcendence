SSL=./nginx/certs

createDir = mkdir -p $1

#only for development
up: cert env
	@chmod +x backend/script.sh
	docker-compose -f docker-compose.dev.yml up --build

prod:
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

prune:
	@./backend/clean_migrations.sh
	docker-compose down --rmi all --volumes --remove-orphans

proxy:
	

.PHONY: up down prod re prune front backend

cert:
	$(call createDir,$(SSL))
	@if [ -f $(SSL)/privkey.key ] && [ -f $(SSL)/fullchain.crt ]; then \
		printf "$(LF)  🟢 $(P_BLUE)Certificates already exists $(P_NC)\n"; \
	else \
		docker run --rm --hostname localhost -v $(SSL):/certs -it alpine sh -c 'apk add --no-cache nss-tools curl && curl -JLO "https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64" && mv mkcert-v1.4.4-linux-amd64 /usr/local/bin/mkcert && chmod +x /usr/local/bin/mkcert && mkcert -install && mkcert -key-file /certs/privkey.key -cert-file /certs/fullchain.crt localhost' ; \
	fi

env:
	@if [ ! -L frontend/.env ]; then cp ./.env frontend/.env; else echo "Env file frontend/.env already exists"; fi
	@if [ ! -L backend/users/management/commands/.env ]; then cp ./.env backend/users/management/commands/.env; else echo "Env File backend/users/management/commands/.env already exists"; fi

testCert:
	@openssl x509 -in $(SSL)/fullchain.crt -text -noout
