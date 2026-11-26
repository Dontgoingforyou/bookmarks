# Подъём всего стенда: make up. Остановка: make down.
# make up после старта показывает логи. Ctrl+C прерывает только вывод.
# Данные базы остаются в volume. Нужен заполненный .env в корне.
# Сайт: http://127.0.0.1:8000/

COMPOSE=docker compose

.PHONY: up down

up:
	$(COMPOSE) up --build -d && $(COMPOSE) logs -f

down:
	$(COMPOSE) down
