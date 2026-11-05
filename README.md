# EchoSeed: Smart Articulation Training System

Hindi speech-articulation practice for children, with portals for students, clinicians and parents.

## Folders

| Folder | Contents |
|---|---|
| `frontend/` | The website (HTML, CSS, JS, videos). This is the only folder served publicly. |
| `backend/` | Node.js API, Socket.IO, database migrations and seeds |
| `docs/` | Specifications and the poster (not served) |
| `render.yaml` | Render deployment settings |

## Run locally

```
cd backend
npm install
npm start
```

Open http://localhost:4000. Without a `DATABASE_URL`, the app uses an in-memory database that resets on restart.

## Deploy on Render

1. Push this repo to GitHub.
2. In Render, choose **New > Blueprint** and select the repo.
3. Approve the plan. Render creates the free web service and PostgreSQL database, and generates the secrets.

Every push to the main branch redeploys the site. Migrations run automatically each time the server starts.

Free plan limits: the site sleeps after 15 minutes without traffic and takes about a minute to wake, uploaded audio is lost on restart, and the database expires 30 days after creation (deleted 14 days later unless upgraded).

Set `SEED_DEMO_DATA` to `false` before real families use the site, and remove the demo accounts. Their passwords are public.
