# DeliverIQ – Startup Script for PowerShell
# Run: .\start.ps1 from the d:\DeliverIQ\DeliverIQ directory

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host " DeliverIQ - Intelligent Food Delivery App" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start FastAPI ML Backend
Write-Host "[1/2] Starting FastAPI ML API on http://localhost:8000 ..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "Set-Location '$baseDir'; .\venv\Scripts\uvicorn.exe api:app --reload --port 8000"

Start-Sleep -Seconds 2

# 2. Start Vite Frontend
Write-Host "[2/2] Starting React + Vite Frontend on http://localhost:5173 ..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; Set-Location '$baseDir\frontend'; npm run dev"

Write-Host ""
Write-Host "DeliverIQ is launching:" -ForegroundColor Cyan
Write-Host "   Frontend Application: http://localhost:5173" -ForegroundColor White
Write-Host "   FastAPI ML Backend:   http://localhost:8000" -ForegroundColor White
Write-Host "   Swagger API Docs:     http://localhost:8000/docs" -ForegroundColor White
Write-Host "   Streamlit ML Studio:  (optional) streamlit run app.py" -ForegroundColor DarkGray
Write-Host ""

