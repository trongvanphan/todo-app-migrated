# Frontend — Next.js 14 + NextAuth v5

## Prerequisites

- Node.js 18+
- Backend running on port 8000 (see [../backend/README.md](../backend/README.md))
- OAuth credentials for at least one provider (Google or GitHub)

## Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

## OAuth App Setup

### Google
1. Go to [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret to `.env.local`

### GitHub
1. Go to [github.com/settings/developers](https://github.com/settings/developers) → OAuth Apps → New OAuth App
2. Set Homepage URL: `http://localhost:3000`
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`

## Configuration

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

Edit `.env.local`:
```
NEXTAUTH_SECRET=<generated-secret>
AUTH_SECRET=<same-generated-secret>
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
INTERNAL_API_URL=http://localhost:8000
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
GITHUB_CLIENT_ID=<from-github-settings>
GITHUB_CLIENT_SECRET=<from-github-settings>
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tests

```bash
npm test
```

## Feature parity with legacy app

| Feature | Legacy (Angular + Firebase) | This app |
|---|---|---|
| Sign in | Firebase Auth (popup) | NextAuth v5 (OAuth + guest) |
| Tasks storage | Firebase Realtime DB | SQLite via FastAPI |
| Filter tasks | Route param `completed` | URL query `?completed=` |
| Inline edit | `ngModel` + autoFocus directive | `useRef` + `useEffect` |
| Route guards | `RequireAuthGuard` / `RequireUnauthGuard` | NextAuth middleware |
| Responsive | SCSS breakpoints | Tailwind `sm540:` breakpoint |
