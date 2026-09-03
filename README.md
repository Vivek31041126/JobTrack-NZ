# JobTrack NZ

[![JobTrack NZ CI](https://github.com/Vivek31041126/JobTrack-NZ/actions/workflows/ci.yml/badge.svg)](https://github.com/Vivek31041126/JobTrack-NZ/actions/workflows/ci.yml)

A secure full-stack job application management platform built with React, FastAPI, PostgreSQL, JWT authentication and Docker.

## Why this project

JobTrack NZ solves a real problem for job seekers: keeping track of applications, interview stages, recruiter contacts, job links and outcomes across multiple platforms.

It demonstrates practical software-engineering skills beyond academic coursework.

## Application Preview

![JobTrack NZ Dashboard](./docs/screenshots/jobtrack-dashboard.png)

JobTrack NZ provides a responsive dashboard for managing job applications, tracking progress through recruitment stages, and monitoring application outcomes.

## Key Features

- Secure user registration and login
- Password hashing and JWT authentication
- Protected REST API endpoints
- User-specific application data
- Create, update and delete job applications
- Search applications by company or role
- Filter applications by recruitment stage
- Application pipeline analytics
- Interview and offer-rate tracking
- Recruiter and professional contact management
- Follow-up date tracking
- LinkedIn and contact information management
- PostgreSQL relational database
- Responsive React frontend
- FastAPI backend
- Docker Compose development environment
- Automated Pytest test suite
- GitHub Actions continuous integration

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- Responsive CSS
- Fetch API

### Backend
- Python
- FastAPI
- SQLAlchemy
- REST API design
- Pydantic validation

### Database
- PostgreSQL

### Development
- Git / GitHub
- Docker
- Docker Compose

## Features

- Add job applications
- Track company, role, location and source
- Store job links and notes
- Update application status
- Delete applications
- Search by company or role
- Filter by status
- View application analytics
- Responsive dashboard UI
- FastAPI interactive documentation

## Application Status Pipeline

```text
Applied → Screening → Interview → Offer
                        ↓
                     Rejected
```

## Architecture

## System Architecture

```text
┌─────────────────────────────┐
│        React Frontend       │
│        Port 5173            │
└──────────────┬──────────────┘
               │
               │ HTTP / JSON
               │ REST API
               ▼
┌─────────────────────────────┐
│       FastAPI Backend       │
│         Port 8000           │
│                             │
│ CRUD • Validation • API     │
└──────────────┬──────────────┘
               │
               │ SQLAlchemy ORM
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
│         Port 5432           │
│                             │
│ Job Application Records     │
└─────────────────────────────┘


## Run with Docker

### Requirements
- Docker Desktop
- Git

### Start the project

```bash
docker compose up --build
```

Open the frontend:

```text
http://localhost:5173
```

Open FastAPI documentation:

```text
http://localhost:8000/docs
```

## Run without Docker

### PostgreSQL

Create a PostgreSQL database called:

```text
jobtrack
```

### Backend

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Set the database URL:

```text
DATABASE_URL=postgresql://jobtrack:jobtrack@localhost:5432/jobtrack
```

Run:

```bash
uvicorn app.main:app --reload
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/applications` | List applications |
| POST | `/applications` | Create application |
| GET | `/applications/{id}` | Get one application |
| PATCH | `/applications/{id}` | Update application |
| DELETE | `/applications/{id}` | Delete application |
| GET | `/analytics` | Dashboard statistics |
| GET | `/health` | API health check |

## Suggested Portfolio Improvements

The current version is an MVP. Recommended next additions:

- User authentication with JWT
- Recruiter/contact management
- Follow-up reminders
- CV version tracking
- Interview calendar
- Data visualisation charts
- CSV export
- Automated tests
- CI/CD with GitHub Actions
- Cloud deployment

## Skills Demonstrated

- Full-stack development
- REST API development
- Relational database design
- CRUD operations
- API integration
- Responsive frontend development
- Backend validation
- Docker-based development
- Git/GitHub workflow

## 🧪 Automated Testing & Continuous Integration

JobTrack NZ includes automated backend tests and a GitHub Actions continuous integration workflow.

### Backend Test Coverage

The automated test suite validates:

- API health checks
- User registration and login
- JWT-protected REST API endpoints
- Duplicate-account protection
- Job application CRUD operations
- Application analytics
- Multi-user data isolation
- Recruiter/contact CRUD operations

Run the tests locally:

```bash
docker compose exec backend pytest tests -q

## Author

**Vivek Tollawala**  
Graduate Software & Data Developer  
Auckland, New Zealand

GitHub: https://github.com/Vivek31041126  
LinkedIn: https://linkedin.com/in/vivek-tollawala-613a12384
