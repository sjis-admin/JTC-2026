#!/usr/bin/env bash
# Script to launch both Django Backend and Next.js Frontend concurrently

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "============================================================"
echo "⚡ Starting Josephite Tech Club (JTC) Platform"
echo "   Domain: jtc.sjis.edu.bd"
echo "   Backend: http://127.0.0.1:8000"
echo "   Frontend: http://127.0.0.1:3000"
echo "   Admin Portal: http://127.0.0.1:3000/admin"
echo "   Default Admin: admin / admin123"
echo "============================================================"

cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 1. Start Django Backend
echo "Starting Django API Server on :8000..."
source "$DIR/venv/bin/activate"
python "$DIR/backend/manage.py" runserver 0.0.0.0:8000 &
DJANGO_PID=$!

# Wait for Django to be up
sleep 2

# 2. Start Next.js Frontend
echo "Starting Next.js Frontend on :3000..."
cd "$DIR/frontend"
npm run dev &
NEXT_PID=$!

wait
