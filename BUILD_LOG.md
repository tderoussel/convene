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

## Build Verification

- TypeScript: compiled successfully, no errors
- All 23 routes generated (static + dynamic)
- Framer Motion still in dependencies but no longer imported on landing page
- Landing page is now a server component (zero client JS)
