# Makefile for Roman Numeral Service Docker Operations

.PHONY: help build run run-dev stop clean logs test docker-build docker-run docker-dev docker-stop docker-logs docker-clean

# Default target
help:
	@echo "Available commands:"
	@echo "  build        - Build the Docker image"
	@echo "  run          - Run the service in production mode"
	@echo "  run-dev      - Run the service in development mode"
	@echo "  stop         - Stop all containers"
	@echo "  clean        - Remove containers and images"
	@echo "  logs         - View service logs"
	@echo "  test         - Run tests"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run   - Run Docker container"
	@echo "  docker-dev   - Run Docker container in dev mode"
	@echo "  docker-stop  - Stop Docker containers"
	@echo "  docker-logs  - View Docker logs"
	@echo "  docker-clean - Clean Docker resources"

# Local development commands
build:
	npm run build

run:
	npm run start:prod

run-dev:
	npm run start:dev

stop:
	@echo "Stopping local service..."

clean:
	rm -rf dist node_modules

logs:
	@echo "Viewing local logs..."

test:
	npm run test

# Docker commands
docker-build:
	docker build -t roman-numeral-service:latest .

docker-run:
	docker-compose up --build -d

docker-dev:
	docker-compose -f docker-compose.dev.yml up --build

docker-stop:
	docker-compose down

docker-logs:
	docker-compose logs -f roman-numeral-service

docker-clean:
	docker-compose down -v --rmi all
	docker system prune -f

# Production with monitoring
docker-run-monitoring:
	docker-compose --profile monitoring up --build -d

# Development with monitoring
docker-dev-monitoring:
	docker-compose -f docker-compose.dev.yml --profile monitoring up --build

# Health check
health:
	curl -f http://localhost:3000/health || exit 1

# Setup environment
setup-env:
	@if [ ! -f env/.env ]; then \
		cp env/env.example env/.env; \
		echo "Created env/.env from example. Please edit with your configuration."; \
	else \
		echo "env/.env already exists."; \
	fi 