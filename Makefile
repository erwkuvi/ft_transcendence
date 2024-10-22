up:
	docker-compose up --build

front:
	docker-compose -f frontend/docker-compose.yml up --build

down:
	docker-compose down --remove-orphans

prod:
	DOCKERFILE=Dockerfile.prod docker-compose up --build

re: down up

prune:
	docker system prune -af

.PHONY: up down prod re prune
