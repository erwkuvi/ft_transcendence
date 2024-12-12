#only for development
up:
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
	docker system prune -af

.PHONY: up down prod re prune front backend
