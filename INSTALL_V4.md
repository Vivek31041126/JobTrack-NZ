# JobTrack NZ Version 4 — Automated Testing + GitHub Actions CI

This is an additive reliability upgrade.

## What this adds

- Pytest automated API tests
- Authentication tests
- JWT-protection test
- Multi-user data-isolation test
- Job CRUD and analytics tests
- Recruiter CRM tests
- GitHub Actions CI
- React production-build verification

## Install

Copy the following into your existing JobTrack-NZ project:

```text
backend/app/database.py
backend/tests/conftest.py
backend/tests/test_api.py
.github/workflows/ci.yml
```

Choose **Replace** only for `backend/app/database.py`.

No database reset is required.

## Run tests locally

From the repository root:

```powershell
docker compose exec backend pytest tests -q
```

Expected result:

```text
7 passed
```

If the backend container was created before the latest files were copied, rebuild once:

```powershell
docker compose up --build
```

Then retry:

```powershell
docker compose exec backend pytest tests -q
```

## Test the React production build

Run:

```powershell
docker compose exec frontend npm run build
```

You should see Vite complete a production build without errors.

## Push to GitHub

```powershell
git add .
git commit -m "Add automated tests and GitHub Actions CI"
git push
```

Then open your GitHub repository and click the **Actions** tab.

You should see:

```text
JobTrack NZ CI
```

The workflow contains two jobs:

- FastAPI automated tests
- React production build

Both should turn green.

## README

The file `README_CI_SECTION.md` contains a section you can paste into your main README after the CI workflow succeeds.

## Next milestone

After CI passes, the next stage is live deployment:

```text
GitHub
   ↓
Continuous Integration
   ↓
Cloud Backend
   ↓
Managed PostgreSQL
   ↓
Hosted React Frontend
   ↓
Public JobTrack NZ URL
```
