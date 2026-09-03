## Automated Testing & CI

JobTrack NZ includes automated backend tests and a GitHub Actions continuous-integration workflow.

### Backend tests

The test suite validates:

- API health checks
- User registration and login
- JWT-protected endpoints
- Duplicate-account protection
- Job application CRUD operations
- Application analytics
- User-specific data isolation
- Recruiter/contact CRUD operations

Run locally:

```powershell
pytest backend/tests -q
```

### Continuous Integration

Every push and pull request to `main` automatically runs:

1. **FastAPI automated tests**
2. **React production build**

The workflow is defined in:

```text
.github/workflows/ci.yml
```

This helps detect backend regressions and frontend build failures before deployment.
