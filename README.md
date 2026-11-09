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
