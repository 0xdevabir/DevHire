# DevHire — GitHub Developer Explorer

DevHire is a recruiter-focused internal tool built with Next.js and Tailwind CSS to:
- authenticate recruiter access
- search GitHub developers
- view detailed developer profiles
- explore repositories
- shortlist candidates with persistence
- view summary analytics in dashboard

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- GitHub REST API (proxied through internal API routes)

## Run Project

1. Install dependencies

```bash
npm install
```

2. Optional: set a GitHub API token to improve rate limits

```bash
cp .env.example .env.local
```

Then add:

```env
GITHUB_TOKEN=your_github_token_here
```

3. Start development server

```bash
npm run dev
```

4. Open

http://localhost:3000

## Folder Structure

```text
app/
  api/github/                   # API layer for GitHub integration
    search/route.ts
    users/[username]/route.ts
    users/[username]/repos/route.ts
  dashboard/page.tsx            # analytics dashboard
  developers/page.tsx           # search and pagination
  developers/[username]/page.tsx# profile + repos + shortlist toggle
  login/page.tsx                # basic auth form
  shortlist/page.tsx            # shortlisted candidates
  globals.css
  layout.tsx
  page.tsx
components/
  AppShell.tsx
  DeveloperCard.tsx
  RepoCard.tsx
  ShortlistCard.tsx
  StatCard.tsx
  StatsChart.tsx
lib/
  auth.ts                       # session helpers (cookie + local storage)
  client-api.ts                 # UI API wrappers
  github-server.ts              # server-side GitHub fetch layer
  storage.ts                    # shortlist + dashboard stats persistence
  types.ts
proxy.ts                        # protected route handling
```

## State Management

This project uses React local component state + localStorage:
- Auth session: cookie (`devhire_session`) + localStorage
- Shortlist data: localStorage (`devhire_shortlist`)
- Dashboard stats: localStorage (`devhire_stats`)

No external state library is used to keep bundle size small and performance high.

## API Integration Flow

UI does not call GitHub directly.

Instead:
1. UI calls internal routes under `/api/github/*`
2. Route handlers call GitHub API via `lib/github-server.ts`
3. Responses are returned to UI with consistent error handling

This keeps API logic separate from UI and allows secure token usage through server environment variables.

## Performance Notes

- `next/image` for avatar optimization
- Route middleware protection before page render
- Server-side API proxy with revalidation
- Small, reusable UI components to reduce repeated render logic
