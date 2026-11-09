# TalentMatch — Backend API Documentation

Base URL: `http://localhost:5000`

All endpoints require a Bearer JWT token except login.

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/managers` | Create manager (admin only) |

## Employees

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/employees` | Create employee (admin) |
| GET | `/api/employees` | List employees |
| GET | `/api/employees/:id` | Get employee |
| PUT | `/api/employees/:id` | Update employee (admin) |
| DELETE | `/api/employees/:id` | Delete employee (admin) |

Query filters: `search`, `department`, `skill`, `availability`, `page`, `limit`.

## Projects

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects` | Create project |
| GET | `/api/projects` | List projects |
| GET | `/api/projects/:id` | Get project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project (admin) |

Query filters: `status`, `search`, `page`, `limit`.

## Allocations

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/allocations` | Request allocation |
| GET | `/api/allocations` | List allocations |
| GET | `/api/allocations/:id` | Get allocation |
| PATCH | `/api/allocations/:id/approve` | Approve (admin) |
| PATCH | `/api/allocations/:id/reject` | Reject (admin) |
| PATCH | `/api/allocations/:id/cancel` | Cancel allocation |

Query filters: `status`, `employee`, `project`.

## Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/dashboard/utilization` | Employee utilization |

## Authorization

Send this header with protected requests:

`Authorization: Bearer <JWT_TOKEN>`

Content-Type for JSON requests:

`application/json`

## Standard response format

Success:

`{ "success": true, "message": "..." }`

Failure:

`{ "success": false, "message": "..." }`

**Note:** Endpoint behavior and permissions must be verified against the implemented backend before frontend integration.