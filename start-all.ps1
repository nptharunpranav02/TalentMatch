$ErrorActionPreference = "Stop"
if (-not (Test-Path "$PSScriptRoot\backend\.env")) { throw "Create backend\.env from backend\.env.example and configure MongoDB/JWT/admin values first." }
Start-Process powershell -ArgumentList @("-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; npm run dev")
Start-Process powershell -ArgumentList @("-NoExit", "-Command", "Set-Location '$PSScriptRoot\ai-engine'; if (Test-Path '.venv\Scripts\Activate.ps1') { . .venv\Scripts\Activate.ps1 }; python -m uvicorn app.main:app --reload --port 8000")
Start-Process powershell -ArgumentList @("-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm run dev")
Write-Host "Started frontend, backend and AI engine in separate terminals." -ForegroundColor Green
