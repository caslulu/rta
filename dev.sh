#!/bin/bash

echo "🚀 Starting Auto RTA in development mode..."

# Função para limpar processos ao sair
cleanup() {
    echo "🛑 Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap para capturar Ctrl+C
trap cleanup INT

# Inicia o backend
echo "🐍 Starting backend..."
cd backend
python main.py &
BACKEND_PID=$!

# Aguarda um pouco para o backend iniciar
sleep 3

# Inicia o frontend
echo "⚛️  Starting frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Services started!"
echo "📱 Frontend: http://localhost:5174"
echo "🔧 Backend:  http://localhost:5000"
echo "Press Ctrl+C to stop both services"

# Aguarda os processos
wait