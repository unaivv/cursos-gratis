#!/bin/bash
cd /home/unai/apps/cursos-unaividal

# Load env vars line by line, skip comments and blanks
while IFS='=' read -r key value; do
  [[ -z "$key" || "$key" == \#* ]] && continue
  value="${value%\"}"
  value="${value#\"}"
  export "$key"="$value"
done < .env.local

export PORT=3007
export HOSTNAME=0.0.0.0
export NODE_ENV=production

echo "[start] cursos-unaividal starting on :$PORT"
exec node /home/unai/apps/cursos-unaividal/.next/standalone/server.js
