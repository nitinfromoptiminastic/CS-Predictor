@echo off
REM Content Success Predictor - Windows Start Script

echo 🚀 Starting Content Success Predictor...

REM Check if .env.local exists
if not exist ".env.local" (
    echo ⚠️  Warning: .env.local not found. Copy .env.local.example and configure it.
)

REM Start Python service
echo Starting Python ML service...
cd python-service

if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
call venv\Scripts\activate
pip install -r requirements.txt >nul 2>&1

REM Start the Python service in background
start "Python ML Service" /B python main.py
echo ✅ Python service started on http://localhost:8000

REM Go back to root directory
cd ..

REM Start Next.js development server
echo Starting Next.js frontend...
echo ✅ Next.js frontend starting on http://localhost:3000
echo.
echo 🎉 Content Success Predictor is running!
echo    Frontend: http://localhost:3000
echo    API:      http://localhost:8000
echo.
echo Press Ctrl+C to stop services

npm run dev
