# JobTrack NZ Version 3 — Analytics + Recruiter CRM

This upgrade adds:
- Application pipeline chart
- Interview rate and offer rate
- Recruiter/contact management
- Relationship stages
- Follow-up dates
- LinkedIn links
- Protected contact APIs

## Install

1. Stop Docker:
```powershell
docker compose down
```

2. Copy these patch files into your existing JobTrack-NZ project and replace matching files.

3. Do NOT delete your PostgreSQL volume. This update only adds a new table, so your current users and applications can remain.

4. Rebuild:
```powershell
docker compose up --build
```

5. Open:
```text
http://localhost:5173
```

## Test

- Sign in with your existing account.
- Confirm your current applications still appear.
- Check the new pipeline chart.
- Open **Recruiters & Contacts**.
- Add a test recruiter/contact.
- Refresh the browser.
- Change the relationship stage.
- Test the LinkedIn link.
- Delete the test contact.

## API

Swagger:
```text
http://localhost:8000/docs
```

New routes:
- GET `/contacts`
- POST `/contacts`
- PATCH `/contacts/{contact_id}`
- DELETE `/contacts/{contact_id}`

## Git

After testing:
```powershell
git add .
git commit -m "Add application analytics and recruiter CRM"
git push
```
