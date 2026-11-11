$ErrorActionPreference = "Stop"
Write-Host "Installing TalentMatch dependencies..." -ForegroundColor Cyan
Push-Location "$PSScriptRoot\backend"
npm install
Pop-Location
Push-Location "$PSScriptRoot\frontend"
npm install
Pop-Location
Push-Location "$PSScriptRoot\ai-engine"
if (-not (Test-Path ".venv")) { python -m venv .venv }
& .\.venv\Scripts\python.exe -m pip install --upgrade pip
& .\.venv\Scripts\python.exe -m pip install -r requirements.txt
Pop-Location
Write-Host "Dependencies installed. Configure backend\.env before starting." -ForegroundColor Green
