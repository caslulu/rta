#!/usr/bin/env bash
set -e

echo "🏗️  Building frontend and preparing backend deps..."

REPO_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
BACKEND_DIR="$REPO_ROOT/auto-rta"

echo "📦 Building frontend (Vite)"
pushd "$REPO_ROOT/frontend" >/dev/null
npm install
npm run build
popd >/dev/null

echo "🐍 Installing backend requirements"
pushd "$BACKEND_DIR" >/dev/null
pip install -r requirements.txt
if [ -f "$BACKEND_DIR/backend/requirements.txt" ]; then
  pip install -r backend/requirements.txt
fi
popd >/dev/null

echo "✅ Build complete. Static assets in auto-rta/backend/static"
