#!/bin/bash
set -e
if [ "$SERVICE" = "AI" ]; then
    cd /app/AI && exec python main.py
elif [ "$SERVICE" = "marketplace" ]; then
    cd /app/marketplace && exec npm start
elif [ "$SERVICE" = "sanity" ]; then
    cd /app/sanity && exec npm run start
else
    exec dotnet /app/$SERVICE/$SERVICE.dll
fi