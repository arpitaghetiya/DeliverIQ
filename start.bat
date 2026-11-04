@echo off
REM DeliverIQ – Start both servers
REM Run this from the DeliverIQ\DeliverIQ folder

echo ===========================================
echo  DeliverIQ – Starting servers
echo ===========================================
echo.
echo [1/2] Starting FastAPI ML API on http://localhost:8000
start "DeliverIQ API" cmd /k "venv\Scripts\uvicorn.exe api:app --reload --port 8000"

timeout /t 2 /nobreak >nul

echo [2/2] Starting React frontend on http://localhost:5173
start "DeliverIQ Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo   API:      http://localhost:8000
echo   Frontend: http://localhost:5173
echo   API Docs: http://localhost:8000/docs
echo.
pause

