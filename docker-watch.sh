#! /bin/bash

# Stop all containers with the name fastify-postgres
if [ $(docker ps --filter "name=fastify-postgres" -qa | wc -l) -gt 0 ]; then
    docker stop $(docker ps --filter "name=fastify-postgres" -qa)
fi
docker system prune -f
docker compose -f docker-compose.watch.yml build --no-cache
docker compose -f docker-compose.watch.yml up -w