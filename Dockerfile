FROM alpine:latest

# Expose the port that Traefik will route to:
EXPOSE 8000

# This just keeps the container alive indefinitely:
CMD ["sh", "-c", "echo 'Dummy backend container running on port 8000'; while true; do sleep 3600; done"]

