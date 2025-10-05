#!/bin/bash

echo "🚀 Starting Auto RTA in production mode..."

# Ativar o ambiente virtual se existir
if [ -d "backend/venv" ]; then
    echo "🐍 Activating virtual environment..."
    source backend/venv/bin/activate
fi

# Iniciar a aplicação
echo "🌐 Starting application on port ${PORT:-5000}..."
python start.py