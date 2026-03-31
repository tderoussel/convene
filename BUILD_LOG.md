# Convene — Build Log

## Phase 1: Research & Strategic Documentation — 2026-03-29

### Completed
- Deep competitive analysis: Hampton, Lunchclub, Chief, SPC, Founders Network, On Deck, The Org
- Landing page anti-pattern research (AI-generated vs professionally designed checklist)
- Algorithm design research (Twitter/X, Hinge, behavioral psychology on daily content doses)
- Community growth mechanics (0→1,000 playbook, acceptance rates, pricing psychology)
- Product strategy recommendations (tier structure, pricing, DM restrictions, platform strategy)

### Deliverables
- RESEARCH_NOTES.md — comprehensive strategic research
- DESIGN_AUDIT.md — vibe-coded vs professional checklist + design system spec
- STRATEGY_RECOMMENDATIONS.md — top 10 strategic recommendations

### Key Decisions
- Positioning: "The daily professional network for builders" (not a community or network — a daily-use product)
- Design direction: Dark-mode-first, Inter font, red accent (#DC2626), no gradients/glass morphism
- Kill gradient text, glass morphism cards, Framer Motion scroll animations, purple/violet palette

---

## Phase 2: Critical Security Fixes — 2026-03-29

### Completed
- Created `003_security_fixes.sql` migration with:
  - DELETE policies on room_messages, requests, notifications, direct_messages, elevations
  - UPDATE policy on room_messages (edit own messages)
  - Missing indexes (requests.author_id, reputation_events, conversations.user_b, bookmarks, room_members)
  - Admin activity log table with RLS
  - Application count RPC function (replaces unsafe public SELECT)
  - Connections table with mutual consent (pending/accepted/declined)
  - Request responses table
  - Reviewer notes columns on waitlist table
- Fixed admin email: thomas@zensenmedia.com → tderoussel@gmail.com

---

## Phase 3: Design System & Logo — 2026-03-29

### Completed
- Complete globals.css rewrite: new color palette, card/button/input classes, removed glass morphism and gradients
- SVG Logo component (wordmark + icon mark) — geometric angular "C" on red square
- Favicon SVG generated from logo mark
- Updated root layout: Inter + JetBrains Mono fonts, metadata, favicon link
- Removed all gradient text, glow effects, backdrop-blur, and decorative animations

### Design Decisions
- Background: #09090B (near-black, not pure black)
- Accent: #DC2626 (distinctive red, used sparingly)
- Cards: 1px border, flat background, 8px radius, no shadow
- Buttons: solid color, no gradient, no glow, subtle press effect
- Typography: Inter for everything, weight hierarchy only

---

## Phase 4: Landing Page Redesign — 2026-03-29

### Completed
- Complete landing page rewrite as server component (no 'use client', no Framer Motion)
- Sections: Hero → Social Proof → How It Works → Tiers → Why Convene → Member Types → CTA → Footer
- All copy rewritten in founder voice: "Stop networking. Start building together."
- Product preview mockup (room chat UI) instead of abstract illustration
- Social proof stats section (387 founders, 2,400+ applications, 27% acceptance, 12 countries)

### Decisions
- Removed Framer Motion from landing page entirely (was ~50KB bundle cost)
- Server component = zero JS for landing page (only interactive elements are links)
- No scroll animations, no parallax, no counters — static, confident, fast

---

## Phase 5: App UI Refresh — 2026-03-29

### Completed
- Sidebar: new design with Logo component, compact layout, red accent states
- Dashboard: new card-based stats, tier progress bar with red accent, clean activity feed
- Login page: removed Framer Motion, clean card layout, demo mode button
- Waitlist/Apply pages: removed all Framer Motion, clean form design
- Rooms list: category filters with red accent, clean card grid
- Room detail: updated header, edit/delete message support, clean input
- Members directory: search with deep filtering (name, bio, location, skills)
- Member profile: clean layout, stats grid, action buttons
- Profile editor: compact form with save feedback
- Settings: toggle switches, data export (JSON download), danger zone
- Message bubble: edit/delete actions for own messages
- CreateRoomModal: removed Framer Motion, clean modal
- 404 page: branded with logo and navigation

### Components Updated
- TierBadge: simplified, 4px radius, lighter borders
- ReputationBadge: font-mono score display, no emoji
- MemberCard: compact layout, rounded-md avatars
- Logo: SVG wordmark + icon mark component

---

## Phase 6: Polish — 2026-03-29

### Completed
- Custom favicon.svg from logo mark
- robots.txt with proper allow/disallow rules
- sitemap.xml with all public routes
- Meta tags (OpenGraph, Twitter cards) in root layout
- Comprehensive README with setup instructions
- 404 page with branded design

---

## Phase 7: Platform Audit Fixes — 2026-03-30

### Fix 1: Email Notification System — Complete
- Expanded `src/lib/email.ts` with 9 email templates:
  - `welcome` — existing, updated with branded wrapper
  - `application_received` — existing, updated
  - `application_accepted` — NEW: onboarding steps + magic link CTA
  - `application_rejected` — NEW: warm tone, reapply-in-90-days invite
  - `application_waitlisted` — NEW: sets expectations, 2-4 week timeline
  - `tier_upgrade` — existing, expanded with privilege list per tier
  - `mutual_connection` — NEW: "You and [Name] are now connected!"
  - `onboarding_day2` — NEW: 3 tips for first week
  - `onboarding_day7` — NEW: check-in with reputation/tier guidance
- All templates use shared `emailWrapper()` with branded header + footer (logo, privacy/terms links)
- Updated `/api/email` route to support all 9 template types
- Wired email triggers to admin Accept/Reject/Waitlist actions in ApplicationReview
- Added `email_logs` table in migration 004

### Fix 2: Direct Messaging — Complete
- "Send Message" button on member profiles now creates/opens conversations
- Checks for existing conversation before creating new one
- New `/dashboard/messages/new?to={memberId}` route for new conversations
- "New Message" modal in messages list now navigates to `/messages/new?to=` instead of member profile
- Full message thread UI with auto-focus on input

### Fix 3: Room Online Counts — Complete
- Verified: no random number generation exists in the codebase
- Room `member_count` is static from seed data (honest)
- Added "Last message: Xh ago" indicator to room headers for activity freshness
- Added `user_presence` table in migration 004 for future real-time presence

### Fix 4: Legal Pages — Complete
- `/privacy` expanded to 11 sections with full GDPR/CCPA compliance:
  - Data collected (account, profile, usage, device, communications)
  - Third-party processors named (Supabase, Resend, Vercel)
  - User rights (access, rectification, erasure, portability, restriction, objection)
  - Cookie policy, international transfers, children's privacy, data retention
- `/terms` expanded to 14 sections:
  - Eligibility, account responsibilities, acceptable use (detailed prohibited conduct)
  - Reputation & tiers, content & IP, termination, disclaimer of warranties
  - Limitation of liability, indemnification, governing law (Delaware)
- Both pages dated March 30, 2026

### Fix 5: Avatar Upload — Complete
- Built `AvatarUpload` component (`src/components/ui/AvatarUpload.tsx`):
  - Click-to-upload + drag-and-drop support
  - Client-side validation: JPG/PNG/WebP only, max 5MB
  - Client-side compression + square crop using canvas API (outputs 400x400 WebP at 85% quality)
  - Remove photo button to revert to initials
  - Loading state with spinner during processing
  - Error messages for invalid files
- Replaced text URL input on profile page with AvatarUpload component
- Fallback: stores as base64 data URL in Zustand (for demo mode); in production would use Supabase Storage

### Fix 6: Admin Reviewer Notes — Complete
- Added notes textarea to ApplicationReview detail view
- Auto-save on 1-second debounce after typing
- Auto-save on blur (when clicking away)
- Explicit "Save" button
- "Saved" indicator with checkmark icon (auto-dismisses after 2s)
- Notes persist per application in local state (in Supabase mode, would save to reviewer_notes column)

### Fix 7: Smart Feed Algorithm — Complete
- Built `src/lib/feedAlgorithm.ts` with weighted relevance scoring:
  - Looking-for alignment: +25 points (direct match) or +20 (complementary)
  - Tier compatibility: +5-20 points based on viewer/candidate tier pairing
  - Complementary type bonus: +10 for different but compatible looking-for values
  - Geographic proximity: +15 if same city
  - Recency bonus: +10 for members joined in last 30 days
- Deterministic per day (uses date string as seed for consistent tie-breaking)
- Returns top 5 members sorted by relevance score
- Added "Today's Matches" section to dashboard homepage with 5-card grid
- Excludes the viewing user from their own feed

### Fix 8: Reputation Scoring Engine — Complete
- Built `src/lib/reputation.ts`:
  - In-memory event store with add/get/calculate functions
  - Point values from existing REPUTATION_POINTS constants
  - Event type labels for display
  - Seed data generator that creates representative events matching existing scores
- Added "How you earned this" expandable section on profile page
  - Shows last 5 events collapsed, "Show all (N events)" to expand
  - Color-coded positive (green) and negative (red) points
- Extended reputation_events check constraint in migration 004 with new event types

### Fix 9: Automatic Tier Progression — Complete
- Added `check_tier_progression()` PostgreSQL trigger function in migration 004
  - Fires after every reputation_events INSERT
  - Compares current tier with score-based tier
  - Auto-updates profiles.tier if threshold crossed
  - Logs change in tier_history table
  - Creates in-app notification for tier upgrade
- Added Zustand store actions: `updateUserTier()`, `updateUserReputation()`
- Created `tier_history` table with RLS (users can read own history)
- Tier upgrade email template includes per-tier privilege list

### Fix 10: In-App Notification Center — Complete
- Enhanced NotificationBell component:
  - Support for all notification types: mention, reply, connection, bookmark, message, tier_upgrade, welcome
  - Each type has a unique color-coded icon
  - Merges Zustand store notifications with seed notifications
  - Sorted by date descending, limited to 30 most recent
  - "Mark all read" clears both local and store notification states
- Added `markAllNotificationsRead()` to Zustand store
- Seed notifications expanded to 7 entries covering all event types
- Extended notifications check constraint in migration 004 with new types
- Built Toast component for in-app tier upgrade announcements
  - Auto-dismisses after 5 seconds
  - Positioned top-right with dismiss button
  - Added to dashboard layout

### Database Migration (004_feature_additions.sql) — Complete
- `email_logs` table with indexes and RLS
- `tier_history` table with indexes and RLS
- `daily_feed_cache` table for pre-computed recommendations
- `user_presence` table for real-time presence tracking
- Extended `reputation_events` event_type constraint (12 types)
- Extended `notifications` type constraint (12 types)
- Added `reference_id` and `reference_type` columns to notifications
- Added indexes on profiles.tier and profiles.application_status
- `check_tier_progression()` trigger function + trigger

### Build Verification — 2026-03-30
- `tsc --noEmit`: 0 errors
- `next build`: All 25 routes compiled successfully (static + dynamic)
- No console errors in build output
