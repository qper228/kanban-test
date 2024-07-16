.PHONY: up
up:
	docker-compose up --build

.PHONY: stop
stop:
	docker-compose stop

.PHONY: rebuild
rebuild:
	docker-compose down
	docker-compose pull --include-deps
	docker-compose build
