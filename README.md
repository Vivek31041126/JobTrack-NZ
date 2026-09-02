# JobTrack NZ

A full-stack job application management platform built as a portfolio project using **React, FastAPI, PostgreSQL and REST APIs**.

## Why this project

JobTrack NZ solves a real problem for job seekers: keeping track of applications, interview stages, recruiter contacts, job links and outcomes across multiple platforms.

It demonstrates practical software-engineering skills beyond academic coursework.

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

```text
React Frontend
      ↓
REST API / JSON
      ↓
FastAPI Backend
      ↓
SQLAlchemy ORM
      ↓
PostgreSQL
```

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

## Author

**Vivek Tollawala**  
Graduate Software & Data Developer  
Auckland, New Zealand

GitHub: https://github.com/Vivek31041126  
LinkedIn: https://linkedin.com/in/vivek-tollawala-613a12384
