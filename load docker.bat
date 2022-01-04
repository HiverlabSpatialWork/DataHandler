@echo off
docker load --input data-handler.tar && docker compose -f docker-compose.yml up
PAUSE