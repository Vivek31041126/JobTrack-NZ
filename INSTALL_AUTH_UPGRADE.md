# Install JobTrack NZ Authentication Upgrade

This upgrades the working MVP with registration, Argon2 password hashing, JWT login, protected APIs, sign-out, and user-specific applications/analytics.

## Important
The database schema changes. The easiest development migration is to reset the Docker database volume. **This deletes your current sample applications.**

## Steps
1. Stop the project: `docker compose down`
2. Copy the patch files into your existing JobTrack project and replace matching files.
3. Reset PostgreSQL: `docker compose down -v`
4. Rebuild: `docker compose up --build`
5. Open `http://localhost:5173`
6. Click **Create an account** and register with an 8+ character password.
7. Confirm you automatically enter the private dashboard.
8. Test sign out and sign back in.
9. Add a job, refresh the page, and verify it persists.
10. Create a second test account to confirm it does not see the first account's applications.

Swagger: `http://localhost:8000/docs`

New auth endpoints:
- POST `/auth/register`
- POST `/auth/token`
- GET `/auth/me`

After testing:
```powershell
git add .
git commit -m "Add JWT authentication and user-specific job tracking"
git push
```
