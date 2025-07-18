# Docker Configuration for Roman Numeral Service

This document explains how to run the Roman Numeral Service using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (usually included with Docker Desktop)

## Quick Start

### Production Mode

1. **Build and run the service:**
   ```bash
   docker-compose up --build
   ```

2. **Access the service:**
   - API: http://localhost:3000
   - API Documentation: http://localhost:3000/api

3. **Stop the service:**
   ```bash
   docker-compose down
   ```

### Development Mode

1. **Run in development mode with hot reloading:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Access the service:**
   - API: http://localhost:3000
   - API Documentation: http://localhost:3000/api

3. **Stop the service:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## Configuration

### Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp env/env.example env/.env
   ```

2. **Edit the environment file:**
   ```bash
   # Edit env/.env with your configuration
   PORT=3000
   ENV=PROD  # or DEV for development
   NODE_ENV=production  # or development
   ```

### DataDog Integration (Optional)

To enable DataDog monitoring:

1. **Set your DataDog API key:**
   ```bash
   export DD_API_KEY=your_datadog_api_key_here
   ```

2. **Run with monitoring:**
   ```bash
   # Production with monitoring
   docker-compose --profile monitoring up --build
   
   # Development with monitoring
   docker-compose -f docker-compose.dev.yml --profile monitoring up --build
   ```

## Docker Commands

### Building the Image

```bash
# Build production image
docker build -t roman-numeral-service:latest .

# Build development image
docker build --target builder -t roman-numeral-service:dev .
```

### Running Individual Containers

```bash
# Run production container
docker run -p 3000:3000 --env-file env/.env roman-numeral-service:latest

# Run development container
docker run -p 3000:3000 -v $(pwd):/app --env-file env/.env roman-numeral-service:dev npm run start:dev
```

### Container Management

```bash
# View running containers
docker ps

# View logs
docker logs roman-numeral-service

# Execute commands in running container
docker exec -it roman-numeral-service sh

# Stop and remove containers
docker-compose down
```

## Health Checks

The service includes health checks that verify the application is running properly:

- **Interval:** 30 seconds
- **Timeout:** 10 seconds
- **Retries:** 3 attempts
- **Start period:** 40 seconds (allows time for initial startup)

## Volumes

### Production
- `./env:/app/env:ro` - Read-only access to environment configuration
- `roman-numeral-logs:/app/logs` - Persistent log storage

### Development
- `.:/app` - Full source code mounting for hot reloading
- `/app/node_modules` - Anonymous volume for node_modules
- `./env:/app/env:ro` - Read-only access to environment configuration

## Networks

The service uses a custom bridge network (`roman-numeral-network`) for communication between containers.

### Logs

```bash
# View service logs
docker-compose logs roman-numeral-service

# Follow logs in real-time
docker-compose logs -f roman-numeral-service

# View DataDog agent logs
docker-compose logs datadog-agent
```

### Debugging

```bash
# Run with debug mode
docker-compose -f docker-compose.dev.yml up --build

# Attach debugger (port 9229 exposed in dev mode)
# Use your IDE to connect to localhost:9229
```

## Performance Optimization

### Production Build
- Multi-stage build reduces final image size
- Only production dependencies included
- Optimized Node.js runtime

### Development Build
- Source code mounted for hot reloading
- Debug port exposed for debugging
- Development dependencies available

## Monitoring

When DataDog is enabled, you can monitor:

- **APM Traces:** Application performance monitoring
- **Logs:** Application and container logs
- **Metrics:** CPU, memory, and runtime metrics
- **Health Checks:** Container health status

Access DataDog dashboards at: https://app.datadoghq.com/ 
