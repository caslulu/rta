#!/usr/bin/env bash
set -e

echo "🧪 Starting monorepo dev (frontend + RTA backend)"

REPO_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
BACKEND_DIR="$REPO_ROOT/auto-rta"
VENV_DIR="$BACKEND_DIR/backend/venv"
VENV_PY="$VENV_DIR/bin/python"

# Ensure backend venv
if [ ! -x "$VENV_PY" ]; then
  echo "📦 Creating backend venv..."
  python -m venv "$VENV_DIR"
  "$VENV_PY" -m pip install --upgrade pip
  echo "📥 Installing backend deps..."
  "$VENV_PY" -m pip install -r "$BACKEND_DIR/requirements.txt"
  if [ -f "$BACKEND_DIR/backend/requirements.txt" ]; then
    "$VENV_PY" -m pip install -r "$BACKEND_DIR/backend/requirements.txt"
  fi
fi

cleanup() {
  echo "🛑 Stopping services..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
}
trap cleanup INT TERM

echo "🐍 Starting backend..."
pushd "$BACKEND_DIR" >/dev/null
"$VENV_PY" start.py &
BACKEND_PID=$!
popd >/dev/null

sleep 2

echo "⚛️  Starting frontend (Vite)..."
pushd "$REPO_ROOT/frontend" >/dev/null
npm install
npm run dev &
FRONTEND_PID=$!
popd >/dev/null

echo "✅ Dev up. Backend PID=$BACKEND_PID, Frontend PID=$FRONTEND_PID"
echo "Press Ctrl+C to stop."

wait
