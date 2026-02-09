#!/bin/bash

# Build the docker image
# -t pinglet-api: Tag the image as 'pinglet-api'
# .: Build context is current directory
echo "Building the Docker image..."
docker build -t pinglet-api .

# Stop and remove existing containers if they exist
echo "Stopping and removing existing containers..."
docker stop pinglet-api pinglet-worker pinglet-consumer || true
docker rm pinglet-api pinglet-worker pinglet-consumer || true

# Run the API container
# -d: Run in detached mode (background)
# --name pinglet-api: Name the container 'pinglet-api'
# --env-file .env: Load environment variables from .env file
# -p 3000:3000: Map host port 3000 to container port 3000
# pinglet-api: Use image 'pinglet-api'
# Command: Overrides CMD to run main.js with Bun
echo "Starting Pinglet API..."
docker run -d \
  --name pinglet-api \
  --env-file .env \
  -p 8888:8888 \
  -m 450m \
  pinglet-api \
  bun run ./build/main.js

# Run the Worker container
# Command: Runs worker.js with Bun
echo "Starting Pinglet Worker..."
docker run -d \
  --name pinglet-worker \
  --env-file .env \
  -m 256m \
  pinglet-api \
  bun run ./build/worker.js

# Run the Consumer container
# Command: Runs consumer.js with Bun
echo "Starting Pinglet Consumer..."
docker run -d \
  --name pinglet-consumer \
  --env-file .env \
  -m 256m \
  pinglet-api \
  bun run ./build/consumer.js

# Show running containers
echo "Current running containers:"
docker ps
