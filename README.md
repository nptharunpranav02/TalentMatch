# 🎯 TalentMatch: Intelligent Employee & Project Allocation System (PS-02)

An intelligent resource allocation platform that bridges the gap between IT bench talent and active project requirements using automated skills assessment, compatibility scoring, and managerial governance.

---

## 👥 Team Responsibilities

- **Member 1 (Frontend Development):** React dashboard, employee & project directories, AI match interface, manager approvals portal, dynamic state management.
- **Member 2 (Backend Development):** Node.js + Express.js API, MongoDB database schemas (Employee, Project, Allocation), availability tracking state machine.
- **Member 3 (AI Development):** Talent-to-project matching algorithm, vector embeddings, multi-factor compatibility scoring, natural language explanation generation.

---

## 🚀 Quick Start (Frontend)

To run the frontend locally:

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies (already installed)
npm install

# 3. Launch the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🖥️ Frontend Architecture & Delivered Features

1. **📊 Executive Dashboard (`/dashboard`):**
   - KPI metrics: Available on Bench, Allocated Staff, Open Projects, Pending Approvals.
   - Longest bench talent quick list with direct action to match.
   - Urgent project requirements tracker.

2. **👥 Employee Management (`/employees`):**
   - Search by name, technical skills (e.g., React, Python), role, or career interests.
   - Filter by status (`On Bench` vs `Allocated`) and department.
   - Modal form to register new employees with multi-skill tag proficiencies (L1 to L5) and career aspirations.

3. **📁 Project Management (`/projects`):**
   - Project catalog with client name, priority badge, and deadline.
   - Team capacity progress meter (`2 / 4 filled`).
   - Modal form to create new projects with required skills and minimum experience thresholds.

4. **🤖 AI Candidate Matcher (`/matching`):**
   - Select any target project to view ranked bench candidates.
   - Compatibility score indicator (0–100%).
   - Matched technical competencies breakdown vs missing skills.
   - AI Rationale explaining why this candidate is suitable.
   - "Propose for Allocation" action button.

5. **✅ Manager Approval Center (`/approvals`):**
   - Review queue for pending allocation requests.
   - Sign-off controls: **Approve** (marks candidate as Allocated and increments project seat count) or **Reject** with feedback.
   - Historical audit log of past reviewed allocations.

---

## 🔌 API Integration Contract (For Member 2 & Member 3)

The frontend contains `src/services/api.js`. It runs with realistic local mock state by default, and can connect to Member 2's backend by setting `USE_MOCK = false`.

### Endpoints Expected by Frontend:
- `GET  /api/dashboard/stats` → `{ totalEmployees, benchCount, allocatedCount, totalProjects, activeProjects, pendingApprovals }`
- `GET  /api/employees` → List of employees
- `POST /api/employees` → Register employee
- `GET  /api/projects` → List of projects
- `POST /api/projects` → Create project
- `GET  /api/projects/:id/recommendations` → Ranked candidates with AI score & explanation
- `GET  /api/allocations` → List of allocations
- `POST /api/allocations` → Submit proposed allocation (`{ employeeId, projectId, aiMatchScore, aiExplanation }`)
- `PATCH /api/allocations/:id/review` → `{ decision: 'APPROVED' | 'REJECTED', managerNotes }`

# TalentMatch Backend

The backend service for **TalentMatch – Intelligent Employee and Project Allocation System**.

TalentMatch helps organizations allocate employees to suitable projects based on their technical skills, experience, availability, and career interests.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcryptjs

## 📁 Project Structure

```text
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── allocationController.js
│   ├── authController.js
│   ├── dashboardController.js
│   ├── employeeController.js
│   └── projectController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── Allocation.js
│   ├── Employee.js
│   ├── Project.js
│   └── User.js
├── routes/
│   ├── allocationRoutes.js
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── employeeRoutes.js
│   └── projectRoutes.js
├── scripts/
│   └── createAdmin.js
├── utils/
│   └── allocationValidation.js
├── tests/
├── .env.example
├── .gitignore
├── API_DOCUMENTATION.md
├── package.json
└── server.js
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/nptharunpranav02/TalentMatch.git
cd TalentMatch/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
```

Replace the placeholder values with your own credentials.

**Never commit your `.env` file or expose database credentials and JWT secrets.**

### 4. Create the admin account

```bash
npm run create-admin
```

### 5. Start the development server

```bash
npm run dev
```

For production:

```bash
npm start
```

The backend will run at:

```text
http://localhost:5000
```

## 🔐 Authentication

TalentMatch uses JWT-based authentication and role-based authorization.

Supported roles:

- **Admin:** Manages employees, projects, managers and allocation approvals.
- **Manager:** Accesses employee and project information and manages allocation requests.

Include the JWT token in protected API requests:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📡 API Modules

| Module | Endpoint | Description |
|---|---|---|
| Authentication | `/api/auth` | Login and manager creation |
| Employees | `/api/employees` | Employee management |
| Projects | `/api/projects` | Project management |
| Allocations | `/api/allocations` | Allocation requests and approvals |
| Dashboard | `/api/dashboard` | Statistics and utilization |

For detailed endpoint documentation, request formats, response examples and access permissions, refer to **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**.

## 🧪 Testing

Run the backend smoke tests:

```bash
npm test
```

The smoke tests cover:

- Server health
- Invalid route handling
- Authentication and authorization
- Employee APIs
- Project APIs
- Allocation APIs
- Dashboard APIs

Make sure the backend server is running and your database is configured before executing the tests.

## 🧠 Core Functionalities

- Employee management with technical skills and experience.
- Project management with required skills and experience criteria.
- JWT authentication and role-based access control.
- Employee-to-project allocation requests.
- Allocation percentage and date-overlap validation.
- Allocation approval and rejection workflows.
- Employee utilization and bench statistics.

## 🔗 Repository

[GitHub – TalentMatch](https://github.com/nptharunpranav02/TalentMatch)

---

**TalentMatch** – Intelligent Employee and Project Allocation System.
