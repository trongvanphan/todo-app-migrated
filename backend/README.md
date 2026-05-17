# Backend — FastAPI + SQLite

## Setup

```bash
cd backend
pip install -r requirements.txt
```

## Configuration

Copy `.env.example` to `.env` and set a strong `SECRET_KEY`:

```bash
cp .env.example .env
# Edit .env — replace the SECRET_KEY value
```

`.env` variables:

| Variable | Default | Description |
|---|---|---|
| `SECRET_KEY` | *(required)* | JWT signing secret — generate with `openssl rand -hex 32` |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_DAYS` | `30` | JWT validity in days |
| `DATABASE_URL` | `sqlite:///./todo.db` | SQLite file path |
| `CORS_ORIGINS` | `["http://localhost:3000"]` | Allowed frontend origins |

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

The database file `todo.db` is created automatically on first startup.

Verify it's running:
```bash
curl http://localhost:8000/
# → {"status": "ok"}
```

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/oauth` | None | Exchange OAuth identity for JWT |
| POST | `/auth/anonymous` | None | Create guest session |
| GET | `/tasks` | Bearer | List tasks (optional `?completed=`) |
| POST | `/tasks` | Bearer | Create task |
| PATCH | `/tasks/{id}` | Bearer | Update task (partial) |
| DELETE | `/tasks/{id}` | Bearer | Delete task |

## Tests

```bash
pytest tests/ -v
```

All 13 tests should pass.
