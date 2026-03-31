# Convene / Alyned — Codebase Research Notes

## Tech Stack
- **Framework**: Next.js 16.2.1 (App Router, `src/` directory)
- **Runtime**: React 19.2.4
- **Language**: TypeScript 5.x strict
- **Styling**: Tailwind CSS 4 with `@theme inline` in globals.css (no tailwind.config.ts)
- **State**: Zustand 5.0.12 with persist middleware
- **Backend**: Supabase (@supabase/supabase-js 2.100.1, @supabase/ssr 0.9.0)
- **Email**: Resend 6.9.4 (already installed)
- **Auth**: Supabase Auth (magic link / OAuth ready)
- **Proxy**: Next.js 16 uses `src/proxy.ts` instead of `middleware.ts`

## Key Architecture Decisions
- Feature-flagged demo mode via `NEXT_PUBLIC_USE_SUPABASE` env var
- Demo mode uses seed data arrays; Supabase mode uses real DB
- Zustand store persists only `currentUser`, `isAuthenticated`, `joinedRoomIds`
- All design tokens in CSS variables in `globals.css`
- Admin access gated by `ADMIN_EMAILS` constant

## Existing Database Schema (from migrations)
### Tables that exist:
1. `waitlist` — with status, admin_notes, reviewer_notes (added in migration 003)
2. `profiles` — full member profiles with tier, reputation_score, application_status, photo_url
3. `rooms` — discussion rooms with category, min_tier
4. `room_members` — join table for room membership
5. `room_messages` — messages in rooms with reply_to threading
6. `conversations` — DM threads (user_a, user_b with CHECK user_a < user_b)
7. `direct_messages` — individual DMs with read boolean
8. `reputation_events` — point events with event_type, points, source
9. `elevations` — member-to-member elevation records
10. `notifications` — in-app notifications with type, title, body, link, read
11. `bookmarks` — member bookmarks (bookmarker_id, bookmarked_id)
12. `requests` — community requests
13. `request_responses` — responses to requests
14. `connections` — mutual connection system (requester, recipient, status)
15. `admin_activity_log` — admin action audit trail
16. `fund_applications`, `investments` — future fund tables

### Existing Triggers:
- `profiles_updated_at` — auto-update updated_at
- `on_auth_user_created` — auto-create profile on signup
- `reputation_updated` — recalculate reputation_score on event insert
- `room_members_count` — auto-update room member_count

### RLS Policies: Comprehensive set covering all tables

## What Already Exists vs What Needs Building

### Email System (Fix 1)
- **EXISTS**: Resend installed, `src/lib/email.ts` with sendEmail + 3 templates (welcome, application_received, tier_upgrade)
- **EXISTS**: API route `/api/email` with auth header check
- **NEEDS**: Additional templates (rejected, waitlisted, mutual connection, onboarding drip)
- **NEEDS**: Wire email triggers to admin actions in ApplicationReview component
- **NEEDS**: email_logs table for observability

### Direct Messaging (Fix 2)
- **EXISTS**: Full DM UI — conversations list, conversation detail, message sending
- **EXISTS**: Conversations + direct_messages tables in schema
- **EXISTS**: Seed data for conversations and messages
- **NEEDS**: Wire "Send Message" button on member profile to actually create/open conversation
- **NEEDS**: New Message modal should create conversation and navigate to it (currently links to member profile)

### Online Counts (Fix 3)
- **EXISTS**: Room header shows `room.member_count` — this is static, not fake random
- **ASSESSMENT**: The room detail shows member_count which is static from seed data. No random generation found. Will add "last active" timestamps instead.

### Legal Pages (Fix 4)
- **EXISTS**: /about, /privacy, /terms pages with basic content
- **NEEDS**: Expand privacy policy for full GDPR/CCPA compliance
- **NEEDS**: Expand terms for full legal coverage

### Avatar Upload (Fix 5)
- **EXISTS**: Profile page has a photo_url text input field
- **EXISTS**: photo_url column in profiles table
- **NEEDS**: Replace text URL input with actual file upload + crop UI
- **NEEDS**: Supabase Storage bucket or base64 fallback

### Admin Reviewer Notes (Fix 6)
- **EXISTS**: ApplicationReview component with detail view
- **EXISTS**: reviewer_notes column added in migration 003
- **NEEDS**: Add notes textarea to the ApplicationReview detail view
- **NEEDS**: Auto-save on blur + explicit save button

### Smart Feed (Fix 7)
- **EXISTS**: Members page with search/filter, Dashboard home page
- **NEEDS**: Build a daily curated member feed section on dashboard with weighted algorithm

### Reputation (Fix 8)
- **EXISTS**: reputation_events table with trigger to update score
- **EXISTS**: Profile page shows reputation breakdown with point values
- **EXISTS**: REPUTATION_POINTS constants
- **NEEDS**: Actually fire reputation events on user actions
- **NEEDS**: Show point history in expandable section

### Tier Progression (Fix 9)
- **EXISTS**: getTierFromReputation() utility, TIER_THRESHOLDS constants
- **NEEDS**: Auto tier check + upgrade after reputation changes
- **NEEDS**: Tier upgrade email + notification, tier_history table

### Notifications (Fix 10)
- **EXISTS**: NotificationBell component with seed notifications and dropdown
- **EXISTS**: notifications table in schema
- **EXISTS**: Zustand store with addNotification + markNotificationRead
- **NEEDS**: Generate real notifications from events

## Component Patterns
- Cards: `card` and `card-hover` CSS classes
- Buttons: `btn-primary` and `btn-secondary`
- Inputs: `input` class
- Tier badges: `TierBadge` component
- All pages: max-width container with px-4/6 padding
- Mobile-first with responsive breakpoints (md, lg)
