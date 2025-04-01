#!/bin/sh

echo "NODE_ENV is set to: $NODE_ENV"

# Check if NODE_ENV is set to development
if [ "$NODE_ENV" = "development" ]; then
  echo "Starting in development mode..."
  npm run dev
else
  echo "Starting in production mode..."
  node dist/index.js
fi