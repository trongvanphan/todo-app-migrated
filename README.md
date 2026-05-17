# Todo App — FastAPI + Next.js Migration

A full-stack todo application migrated from Angular 4 + Firebase to FastAPI (Python) + Next.js 14.

## Stack

| Layer | Technology |
|---|---|
| Backend | Python FastAPI, SQLite, SQLAlchemy, python-jose |
| Frontend | Next.js 14 (App Router), NextAuth.js v5, TanStack Query v5 |
| Auth | Google OAuth, GitHub OAuth, Anonymous (guest) |
| Styling | Tailwind CSS |

## Structure

```
todo-app-migrated/
├── backend/     # FastAPI REST API (port 8000)
└── frontend/    # Next.js app (port 3000)
```

## Quick Start

**Prerequisites:** Python 3.11+, Node.js 18+, OAuth credentials (see frontend/README.md)

1. Start the backend — see [backend/README.md](backend/README.md)
2. Start the frontend — see [frontend/README.md](frontend/README.md)

> ⚠️ Start the backend first — the frontend exchanges tokens with FastAPI on sign-in.

## Optional OAuth providers

Twitter and Facebook can be added later:
- **Twitter:** Requires OAuth 1.0a credentials from [developer.twitter.com](https://developer.twitter.com). Add `Twitter` provider from `next-auth/providers/twitter` to `frontend/auth.ts`.
- **Facebook:** Requires HTTPS redirect URI. Use [ngrok](https://ngrok.com) for local dev: `ngrok http 3000`. Configure the callback URL in Facebook App settings. Add `Facebook` provider from `next-auth/providers/facebook`.
