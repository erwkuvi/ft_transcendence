user:
	docker-compose -f app/user_service/docker-compose.user.yml up --build 

front:
	docker-compose -f app/frontend_service/docker-compose.front.yml up --build

game:
	docker-compose -f app/game_service/docker-compose.game.yml up --build

notify:
	docker-compose -f app/notifications_service/docker-compose.notify.yml up --build 

up:
	docker-compose up --build  

down:
	docker-compose down --remove-orphans

re: 
	docker-compose up --remove-orphans --build 

volumes: 
	docker volume prune

prune:
	docker system prune -af
