#!/bin/sh

# Run start for Pinglet API
pm2 start "npm run start" --name pinglet-api

# Run worker for worker
pm2 start "npm run worker" --name pinglet-worker

# Run consumer for Consumer
pm2 start "npm run consumer" --name pinglet-consumer
