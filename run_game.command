#!/bin/bash
# Script de 1 clic para iniciar ICESI RUN en macOS
cd "$(dirname "$0")/web-prototype"
echo "Iniciando servidor local de ICESI RUN en http://localhost:5173..."
python3 -m http.server 5173 &
SERVER_PID=$!

sleep 1
open "http://localhost:5173"

echo "Servidor activo con PID $SERVER_PID. Presiona Ctrl+C para cerrar."
wait $SERVER_PID
