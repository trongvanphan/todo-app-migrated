# Frontend — todo-app-migrated

Next.js (App Router) + Firebase JS SDK (auth only; data via FastAPI).

## Setup

```bash
cp .env.local.example .env.local   # fill in Firebase web config + API base URL
npm install
npm run dev                        # http://localhost:3000
```

The backend must be running at `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:8000`).

## Routes

- `/` → redirects to `/sign-in` or `/tasks` based on auth
- `/sign-in` — Google / GitHub / Anonymous
- `/tasks` (protected) — list + form; `?filter=active|completed` for filters
