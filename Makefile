.PHONY: build-and-run stop docker-build docker-run docker-logs

build-and-run:
	@echo "Building and running roman-numeral-service with datadog using command line env var DD_API_KEY: $$DD_API_KEY"
	docker-compose --profile monitoring up -d --build

stop:
	docker-compose down

docker-build:
	docker build -t roman-numeral-service:latest .

docker-run:
	docker-compose up --build -d

docker-logs:
	docker-compose logs -f roman-numeral-service
