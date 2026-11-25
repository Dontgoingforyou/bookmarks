# Подъём всего стенда: make up. Остановка: make down.
# Данные базы остаются в volume. Нужен заполненный .env в корне.
# Сайт: http://127.0.0.1:8001/

COMPOSE=docker compose

.PHONY: up down

up:
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down
