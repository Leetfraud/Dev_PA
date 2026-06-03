@echo off
echo ========================================
echo   DevProfile Analyzer - Quick Start
echo ========================================
echo.

REM Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo [1/3] Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo.
) else (
    echo [1/3] Backend dependencies already installed ✓
    echo.
)

REM Check if backend .env exists
if not exist "backend\.env" (
    echo [2/3] Backend .env not found!
    echo Please create backend\.env from backend\.env.example
    echo and add your MongoDB URI and GitHub token.
    echo.
    pause
    exit /b 1
) else (
    echo [2/3] Backend .env found ✓
    echo.
)

echo [3/3] Starting servers...
echo.
echo Opening backend in new window...
start "DevProfile Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Opening frontend in new window...
start "DevProfile Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Servers Starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Check the new windows for server status.
echo Press any key to exit this window...
pause >nul
