@echo off
REM MedAI - Complete Startup Script for Windows
REM This script starts all required services for the application

echo.
echo ================================
echo   🏥 MedAI - Startup Script
echo ================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://python.org
    pause
    exit /b 1
)

REM Set up paths
set BACKEND_DIR=d:\medai\backend
set FRONTEND_DIR=d:\medai\frontend

REM Colors and icons
setlocal enabledelayedexpansion

echo.
echo ✅ Python is installed
echo.

REM Check Ollama
echo Checking Ollama...
tasklist /FI "ImageName eq ollama.exe" 2>NUL | find /I /N "ollama.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ Ollama is running
) else (
    echo ⚠️  Ollama is NOT running
    echo Please start Ollama manually: ollama serve
    echo.
)

REM Check PostgreSQL
echo Checking PostgreSQL...
tasklist /FI "ImageName eq postgres.exe" 2>NUL | find /I /N "postgres.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ PostgreSQL is running
) else (
    echo ⚠️  PostgreSQL is NOT running
    echo Database features will not work
    echo.
)

REM Check Redis
echo Checking Redis...
tasklist /FI "ImageName eq redis-server.exe" 2>NUL | find /I /N "redis-server.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ Redis is running
) else (
    echo ⚠️  Redis is NOT running
    echo Caching will be disabled
    echo.
)

echo.
echo ================================
echo   Starting Services
echo ================================
echo.

REM Ask user what to start
echo Choose what to start:
echo 1 - Start Backend Only (FastAPI)
echo 2 - Start Streamlit Frontend Only
echo 3 - Start Both (Recommended)
echo 4 - Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    call :start_backend
) else if "%choice%"=="2" (
    call :start_frontend
) else if "%choice%"=="3" (
    call :start_both
) else (
    echo Exiting...
    exit /b 0
)

exit /b 0

REM Functions
:start_backend
echo.
echo Starting FastAPI Backend on http://localhost:8000...
echo.
cd /d %BACKEND_DIR%
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -q -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)
echo ✅ Backend starting. Press Ctrl+C to stop.
echo 📖 API Docs available at: http://localhost:8000/docs
python -m uvicorn main:app --reload --port 8000
exit /b 0

:start_frontend
echo.
echo Starting Streamlit Frontend on http://localhost:8501...
echo.
cd /d %FRONTEND_DIR%
python -m pip install -q -r streamlit_requirements.txt 2>nul
echo ✅ Frontend starting. Press Ctrl+C to stop.
streamlit run streamlit_app.py
exit /b 0

:start_both
echo.
echo Starting BOTH services (you'll need two terminal windows)...
echo.
echo 1️⃣  Opening Backend Terminal...
cd /d %BACKEND_DIR%
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
start cmd /k "call venv\Scripts\activate.bat && python -m uvicorn main:app --reload --port 8000"

timeout /t 3 /nobreak

echo 2️⃣  Opening Frontend Terminal...
cd /d %FRONTEND_DIR%
start cmd /k "python -m pip install -q -r streamlit_requirements.txt && streamlit run streamlit_app.py"

echo.
echo ✅ Both services are starting!
echo.
echo 📊 Backend API Docs:  http://localhost:8000/docs
echo 📱 Streamlit App:     http://localhost:8501
echo.
echo ⚠️  Keep both terminal windows open while using the app
echo.
timeout /t 5 /nobreak
