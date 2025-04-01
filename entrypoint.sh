#!/bin/sh

echo "Starting application in $NODE_ENV mode..."

if [ "$NODE_ENV" = "development" ]; then
  echo "Running in development mode"
  npm run dev
else
  echo "Running in production mode"
  node dist/index.js || tail -f /dev/null
fi