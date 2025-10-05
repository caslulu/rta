#!/bin/bash

echo "🏗️  Building Auto RTA for production..."

# Build do frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

# Move os arquivos built para o backend servir
echo "📁 Moving frontend build to backend..."
cd ..
rm -rf backend/static
mkdir -p backend/static
cp -r frontend/dist/* backend/static/

# Instala dependências do backend
echo "🐍 Installing backend dependencies..."
pip install -r requirements.txt

echo "✅ Build completed! You can now run 'python start.py'"
echo "🌐 The app will serve both frontend and backend on the same port"