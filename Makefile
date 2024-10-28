up:
	@chmod +x backend/script.sh
	docker-compose up --build

front:
	docker-compose -f frontend/docker-compose.yml up --build

backend:
	docker-compose -f backend/docker-compose.backend.yml up --build

down:
	docker-compose down --remove-orphans

prod:
	DOCKERFILE=Dockerfile.prod docker-compose up --build

re: down prune
	docker-compose build --no-cache
	docker-compose up

prune:
	docker system prune -af

.PHONY: up down prod re prune front backend
