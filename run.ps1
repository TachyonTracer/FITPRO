# Stop and remove old containers
docker compose down

# Build new image and start fresh containers
docker compose up --build --force-recreate
