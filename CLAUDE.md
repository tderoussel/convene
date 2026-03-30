@AGENTS.md

# Convene — Project Instructions

## Overview

Convene is a private, invite-only community platform for ambitious builders.
It is built with Next.js 16 (App Router, `src/` directory), TypeScript, Tailwind CSS 4, Zustand, and Supabase.

## Key conventions

- **Next.js 16**: Middleware has been renamed to **proxy** (`src/proxy.ts`, exported function `proxy`). Do NOT create a `middleware.ts` file.
- **Tailwind CSS 4**: Uses `@theme inline` in `globals.css` for design tokens. No `tailwind.config.ts` file — all configuration lives in CSS.
- **Supabase SSR**: Three client helpers in `src/lib/supabase/` — `client.ts` (browser), `server.ts` (RSC / Server Actions), `admin.ts` (service-role). Always use the appropriate one.
- **Feature flags**: `src/lib/feature-flags.ts` — when `NEXT_PUBLIC_USE_SUPABASE` is not `"true"`, the app runs in demo mode with mock data.
- **State management**: Zustand store in `src/lib/store.ts` with `persist` middleware. Only `currentUser`, `isAuthenticated`, and `joinedRoomIds` are persisted to localStorage.
- **Types**: All shared TypeScript interfaces live in `src/types/index.ts`.
- **Constants & tiers**: `src/lib/constants.ts` and `src/lib/tiers.ts` hold tier thresholds, DM limits, reputation points, and tier utility functions.

## Tier system

| Tier      | Reputation required | Colour  |
|-----------|--------------------:|---------|
| Explorer  |                   0 | Slate   |
| Builder   |                 100 | Blue    |
| Catalyst  |                 500 | Amber   |

## Folder structure

```
src/
  app/          — Next.js App Router pages & layouts
  lib/          — Utilities, store, Supabase clients, constants
    supabase/   — client.ts, server.ts, admin.ts
  types/        — Shared TypeScript interfaces
  proxy.ts      — Next.js proxy (auth gate)
```

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in real values before running with Supabase enabled.

## Email notifications

Email is handled via Resend (`src/lib/email.ts`). Set `RESEND_API_KEY` in `.env.local`. Templates: welcome, application received, tier upgrade. API route: `/api/email`.

## Supabase Realtime

Room messages use Supabase Realtime subscriptions (`src/lib/hooks/useRealtimeMessages.ts`). Only active when `NEXT_PUBLIC_USE_SUPABASE=true`.

## OG Image

Dynamic OG image generated at `/api/og` (Edge runtime, 1200x630). Referenced in `layout.tsx` metadata.

## Admin access

Only emails listed in `ADMIN_EMAILS` (in `src/lib/constants.ts`) can access `/admin/*` routes. Currently: `tderoussel@gmail.com`.

## Deployment

- **Vercel project**: `convene` (team: `team_g38i5vk2mGU2ELm65GcB1RWf`, project: `prj_0pIqYJIbFC3Qz5EoEHKrYT22bq0Q`)
- **Supabase project**: `alyned` (ref: `lvanestnxowluiknvdll`)
- Deploy via `vercel deploy --prod` from the `convene/` directory
