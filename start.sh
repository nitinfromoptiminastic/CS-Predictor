#!/bin/bash

# Content Success Predictor - Start Script
# This script starts both the Next.js frontend and Python ML service

echo "🚀 Starting Content Success Predictor..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Copy .env.local.example and configure it."
fi

# Start Python service in background
echo "Starting Python ML service..."
cd python-service
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate
pip install -r requirements.txt > /dev/null 2>&1

# Start the Python service in background
python main.py &
PYTHON_PID=$!
echo "✅ Python service started on http://localhost:8000 (PID: $PYTHON_PID)"

# Go back to root directory
cd ..

# Start Next.js development server
echo "Starting Next.js frontend..."
npm run dev &
NEXT_PID=$!
echo "✅ Next.js frontend started on http://localhost:3000 (PID: $NEXT_PID)"

# Function to cleanup processes on exit
cleanup() {
    echo "🛑 Stopping services..."
    kill $PYTHON_PID $NEXT_PID 2>/dev/null
    echo "✅ Services stopped"
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Wait for user to stop
echo ""
echo "🎉 Content Success Predictor is running!"
echo "   Frontend: http://localhost:3000"
echo "   API:      http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all services"

# Keep script running
wait
