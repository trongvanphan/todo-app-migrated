# Backend — todo-app-migrated

FastAPI + SQLAlchemy + Firebase Admin (token verification).

## Run

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"

export GOOGLE_APPLICATION_CREDENTIALS=/path/to/firebase-service-account.json
export CORS_ORIGINS=http://localhost:3000
uvicorn app.main:app --reload --port 8000
```

## Test

```bash
pytest -q
```

## API

- `GET  /api/health` — no auth
- `GET  /api/me` — returns the verified user
- `GET  /api/tasks?filter=all|active|completed`
- `POST /api/tasks` `{ title }`
- `PATCH /api/tasks/{id}` `{ title?, completed? }`
- `DELETE /api/tasks/{id}`

All `/api/tasks*` and `/api/me` require `Authorization: Bearer <firebase-id-token>`.
