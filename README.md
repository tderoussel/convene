# Convene

The curated network for founders, investors, and operators. Five matches a day. Focused rooms. Zero noise.

## Tech Stack

- **Framework:** Next.js 16 (App Router, `src/` directory)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 (design tokens via `@theme inline` in globals.css)
- **State:** Zustand with persist middleware
- **Backend:** Supabase (Postgres + RLS + Edge Functions + Realtime)
- **Fonts:** Inter + JetBrains Mono (via `next/font/google`)
- **Deployment:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Run in demo mode (no Supabase needed)
npm run dev

# Run with Supabase
cp .env.local.example .env.local
# Fill in your Supabase credentials
# Set NEXT_PUBLIC_USE_SUPABASE=true
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Mode

By default, the app runs in demo mode with 30 seed member profiles, 10 rooms, and realistic conversation data. Click "Try Demo Mode" on the login page to explore the full app as Raj Patel (Catalyst tier).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_USE_SUPABASE` | Set to `"true"` to enable live database |
| `NEXT_PUBLIC_SITE_URL` | App URL (used for auth callbacks) |

## Project Structure

```
src/
  app/                 # Next.js App Router pages
    dashboard/         # Authenticated app pages
    admin/             # Admin-only pages
  components/
    ui/                # Design system (Logo, TierBadge, ReputationBadge)
    dashboard/         # Dashboard components (Sidebar)
    rooms/             # Room components (MessageBubble, CreateRoomModal)
    members/           # Member components (MemberCard)
  lib/
    store.ts           # Zustand global state
    constants.ts       # App constants, tier thresholds, admin emails
    tiers.ts           # Tier utility functions
    feature-flags.ts   # Demo/live mode flags
    supabase/          # Supabase client helpers (client, server, admin)
  data/                # Seed data for demo mode
  types/               # TypeScript interfaces
  proxy.ts             # Auth middleware (Next.js proxy)
supabase/
  migrations/          # SQL schema and RLS policies
```

## Tier System

| Tier | Rep Required | Access |
|---|---|---|
| Explorer | 0+ | Public rooms, daily feed, requests |
| Builder | 100+ | Private rooms, DMs (15/day), room creation |
| Catalyst | 500+ | Unlimited DMs, elevations, Catalyst Lounge |

## Admin

Emails in `ADMIN_EMAILS` (src/lib/constants.ts) can access `/admin/*` routes. Currently: `tderoussel@gmail.com`.

## Database Migrations

Three files in `supabase/migrations/`:
1. `001_initial_schema.sql` — Tables, indexes, triggers
2. `002_rls_policies.sql` — Row Level Security policies
3. `003_security_fixes.sql` — Security hardening, delete policies, connections, audit log

Run migrations in order in your Supabase SQL editor.
