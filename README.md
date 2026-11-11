# TalentMatch — integrated setup

## Architecture
- `frontend`: React + Vite
- `backend`: Express + MongoDB + JWT
- `ai-engine`: FastAPI matching engine

## Prerequisites
- Node.js 20.19+ (Vite 8 requires a recent Node version)
- Python 3.10+
- MongoDB Atlas URI or local MongoDB

## 1. Configure environment
Copy `backend/.env.example` to `backend/.env`, fill in MongoDB URI, a unique JWT secret (32+ characters), and admin credentials. Copy `frontend/.env.example` to `frontend/.env`.

Do not commit `.env` files.

## 2. Install dependencies

```powershell
cd backend
npm install
cd ..\frontend
npm install
cd ..\ai-engine
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## 3. Create the first admin (once)

```powershell
cd backend
npm run create-admin
```

Use `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `backend/.env` to sign in.

## 4. Start services in three terminals

Terminal A:
```powershell
cd backend
npm run dev
```

Terminal B:
```powershell
cd ai-engine
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --port 8000
```

Terminal C:
```powershell
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal (normally http://localhost:5173).

## Health checks
- Backend: http://localhost:5000/api/health
- AI engine: http://localhost:8000/api/v1/health
- AI docs: http://localhost:8000/docs

## Important integration notes
- The frontend now uses the Express API; localStorage mock mode has been removed.
- JWT is stored in browser localStorage and sent as a Bearer token. Sign out clears it.
- Express sends matching requests to FastAPI at `AI_ENGINE_URL`.
- Allocation approvals are persisted in MongoDB.
- The AI engine requires at least one project skill and at least one candidate employee.

## Troubleshooting
- `npm run dev` must be run from `frontend` or `backend`, not `ai-engine`.
- If Vite fails with an engine/version error, install Node.js 20.19+ or 22.12+.
- If backend reports MongoDB connection failure, check `MONGODB_URI` and Atlas network access.
- If matching returns 502, start FastAPI and verify `AI_ENGINE_URL`.
- If sign-in fails, run `npm run create-admin` after configuring backend `.env`.
