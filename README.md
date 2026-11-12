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
Copy `backend/.env.example` to `backend/.env`, fill in MongoDB URI and a unique JWT secret (32+ characters). Admin credentials are only needed if you create an additional workspace admin. Copy `frontend/.env.example` to `frontend/.env`.

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

## 3. Seed three isolated demo company workspaces

For the prototype demonstration, run this once after configuring `backend/.env`:

```powershell
cd backend
npm run seed:demo
```

This creates three independent companies, three admin accounts, two sample employees per company, and one sample project per company. The seed is safe to rerun and updates the demo records.

| Company | Admin email | Password |
|---|---|---|
| Northstar Digital | `admin@northstar.test` | `Northstar@123` |
| BluePeak Technologies | `admin@bluepeak.test` | `BluePeak@123` |
| Greenfield Analytics | `admin@greenfield.test` | `Greenfield@123` |

These `.test` email addresses are demonstration identities only; they are not real mailboxes. The passwords are for local prototype demos only and must be changed before any public deployment.

The seed script also assigns any legacy records from the original single-company prototype that have no company assignment to Northstar Digital, preserving the existing prototype data there.

## 4. Create a separate company admin (optional)

Set `COMPANY_NAME`, `COMPANY_SLUG`, `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `backend/.env`, then run:

```powershell
cd backend
npm run create-admin
```

Use the configured email and password to sign in.

## 5. Start services in three terminals


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
- If backend reports MongoDB connection failure, check `MONGODB_URI` and Atlas network access. If Node specifically reports `querySrv ECONNREFUSED` while Windows `nslookup` succeeds, set `DNS_SERVERS=8.8.8.8,8.8.4.4` in `backend/.env` (only if your network permits Google DNS).
- If matching returns 502, start FastAPI and verify `AI_ENGINE_URL`.
- If sign-in fails, run `npm run create-admin` after configuring backend `.env`.


## Multi-company isolation

- Each admin belongs to exactly one `Company` record through `User.companyId`.
- The login response includes the assigned company name and slug. The frontend displays that server-provided company identity; it is not editable in browser storage.
- Every protected request resolves the company from the authenticated user record. API controllers scope employee, project, allocation, dashboard, and AI queries to that company.
- Employee IDs and project IDs are unique within a company, while admin email addresses remain globally unique for login.
- Managers created by an admin inherit that admin's company.
- There is no central super-admin or company-switching control in this prototype.
- The demo seeder creates sample records in all three workspaces so the isolation can be demonstrated immediately.
