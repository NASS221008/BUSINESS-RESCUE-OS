@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

title Business Rescue OS Launcher

cd /d %~dp0

echo ===================================================
echo     Business Rescue OS - Full System Launcher
echo ===================================================
echo.

:: 1. Check Python
where python >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python is not found in your PATH. Please install Python 3.10+ and add it to PATH.
    pause
    exit /b 1
)

:: 2. Check .env
if not exist .env (
    echo [WARNING] No .env file found. Creating a template .env file...
    echo GROQ_API_KEY=your_key_here> .env
    echo [INFO] Created .env. Please set your GROQ_API_KEY inside it.
)

:: 3. Seed database if not initialized
echo [1/3] Checking database...
python -m database.seed_data

:: 4. Start FastAPI Backend in a separate window
echo [2/3] Starting FastAPI Backend on port 8000...
start "Business Rescue OS - Backend" cmd /k "cd /d "%~dp0" && python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

:: Brief wait for backend to bind port
timeout /t 3 /nobreak > nul

:: 5. Start Streamlit Frontend in a separate window
echo [3/3] Starting Streamlit Dashboard on port 8501...
start "Business Rescue OS - Dashboard" cmd /k "cd /d "%~dp0" && python -m streamlit run frontend/app.py --server.port 8501 --server.headless false"



echo.
echo ===================================================
echo   Business Rescue OS is up and running!
echo   - Backend:   http://localhost:8000/docs
echo   - Dashboard: http://localhost:8501
echo ===================================================
echo.
echo Both services are running in their respective windows.
timeout /t 4 > nul
exit /b 0
