# Makefile for Roman Numeral Service Docker Operations=
.PHONY: build-and-run stop docker-build docker-run docker-logs

build-and-run:
    DD_API_KEY=442a78ca506fed3b4ffd4453de073fd2 docker-compose --profile monitoring up -d --build

stop:
	docker-compose down

# Docker commands
docker-build:
	docker build -t roman-numeral-service:latest .

docker-run:
	docker-compose up --build -d

docker-logs:
	docker-compose logs -f roman-numeral-service
