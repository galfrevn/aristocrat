#!/bin/bash

# Store the container ID for cleanup
CONTAINER_ID=""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping container..."
    if [ ! -z "$CONTAINER_ID" ]; then
        docker kill "$CONTAINER_ID" 2>/dev/null || true
    else
        # Fallback: kill any container on port 3002
        docker kill $(docker ps -q --filter 'publish=3002') 2>/dev/null || true
    fi
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

# Start container in background and capture container ID
CONTAINER_ID=$(docker run --rm -d -p 3002:3002 -e NODE_ENV=development -v $(pwd)/src:/app/src -v /app/node_modules transcript-service-dev bun --watch src/index.ts)

# Follow the logs to simulate interactive mode
docker logs -f "$CONTAINER_ID" &
LOGS_PID=$!

# Wait for either the container to stop or for a signal
wait $LOGS_PID 2>/dev/null