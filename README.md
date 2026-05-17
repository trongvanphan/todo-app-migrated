# todo-app-migrated

Migration target for `todo-angular-firebase-demo`. Stack:

- **Backend**: Python 3.11 + FastAPI + SQLAlchemy + SQLite + `firebase-admin` (ID-token verification)
- **Frontend**: Next.js 14 (App Router) + React 18 + Firebase JS SDK (auth only)

Data has been moved off Firebase RTDB into the FastAPI-owned SQLite database. Auth still uses Firebase (Google / GitHub / Anonymous); the frontend sends the user's ID token as a bearer header on every API call, and the backend verifies it via `firebase-admin`.

See `backend/README.md` and `frontend/README.md` for setup.

Migration artifacts (spec/design/tasks/verify) live under `../migration/`.
