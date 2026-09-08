#!/usr/bin/env bash
set -euo pipefail

REMOTE="unai@192.168.1.100"
REMOTE_DIR="/home/unai/apps/cursos-unaividal"

echo "▶ Building..."
npm run build

echo "▶ Syncing standalone..."
rsync -av --delete \
  .next/standalone/ "$REMOTE:$REMOTE_DIR/.next/standalone/"

echo "▶ Syncing static assets..."
rsync -av --delete \
  .next/static/ "$REMOTE:$REMOTE_DIR/.next/standalone/.next/static/"

echo "▶ Syncing public..."
rsync -av --delete \
  public/ "$REMOTE:$REMOTE_DIR/public/"

echo "▶ Restarting PM2..."
ssh "$REMOTE" "pm2 restart cursos-unaividal"
