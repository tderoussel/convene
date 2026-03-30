# Convene — Strategic Research Notes

## 1. Competitive Intelligence

### Hampton ($8,500/year)
**Strengths:** Strong peer-group model (8-10 founders), content-gated scarcity, revenue-based qualification, Sam Parr's personal brand drives top-of-funnel, annual pricing signals commitment.
**Weaknesses:** Thin tech layer (Slack + Zoom), geographic limitations, prices out pre-revenue founders, limited serendipity in small groups.
**Takeaway:** Application should ask real business metrics. Don't rely on Slack as community infrastructure.

### Lunchclub (Free, AI-matching)
**Strengths:** Correct core insight (curated > scroll), low friction onboarding, intent-based matching ("both fundraising").
**Weaknesses:** Wildly inconsistent match quality, no reputation/feedback loop, poor retention (3-5 matches then churn), no community layer, feels transactional.
**Takeaway:** Declaring intent as a matching signal is powerful. Pure algorithmic matching without community fails.

### Chief (~$7,800/year)
**Strengths:** Razor-sharp positioning (executive women, VP+), Core Group model, programming layer (events, workshops), exceptional brand design, in-person anchors.
**Weaknesses:** Scaling diluted quality, price too high for broad market, geographic dependency, mediocre tech platform.
**Takeaway:** Identity-centric positioning beats generic "professional network." Chief says "where executive women lead," not "professional network."

### South Park Commons (Free fellowship)
**Strengths:** "Exploration" framing attracts high-potential people in transition, strong alumni bonds, aggressive curation (<5% acceptance), SF physical space.
**Weaknesses:** Not a product (fellowship/institution), SF-only, no scalable revenue model.
**Takeaway:** Segment by phase (exploring, building, scaling), not just status.

### Founders Network ($75-375/month)
**Strengths:** Tiered pricing with escalating access, monthly pricing lowers barrier, peer advisory format.
**Weaknesses:** Dated brand, muddled positioning, no viral loop, thin product (Slack + Zoom + directory).
**Takeaway:** Tiered pricing with clear value escalation works. Generic "founder community" positioning is invisible.

### On Deck (~$2,500-3,000 fellowship)
**Strengths:** Cohort model creates shared identity and FOMO, cross-vertical expansion, Twitter-native growth (2020-2021), two-sided marketplace (builders + talent).
**Weaknesses:** Scaled too fast, post-cohort retention was terrible, significant layoffs/restructuring, tech never became the product.
**Takeaway:** Cohort energy doesn't equal retention. Convene needs ongoing daily value (feed + rooms), not just a burst of connection.

### The Org (Free/Freemium)
**Strengths:** Clever org-chart concept, SEO-driven growth, clean modern design.
**Weaknesses:** Directory not community, weak network effects, unclear monetization.
**Takeaway:** Not a direct competitor. Convene's member profiles should be at least as rich and well-structured.

### Competitive Gap Analysis

| Need | Current Solutions | Gap Convene Fills |
|---|---|---|
| Deep peer advisory | Hampton, YPO, Chief ($7-10K/yr) | No tech platform worth using |
| AI-curated matching | Lunchclub | No community, bad retention |
| Cohort energy | On Deck | No post-cohort retention |
| Daily professional feed | LinkedIn | Noisy, unfiltered, performative |
| Curated founder community | All of the above | None combine feed + matching + rooms + reputation in one product |

**Convene's positioning:** "The daily professional network for builders — curated matches, focused rooms, zero noise."

---

## 2. Landing Page Anti-Pattern Analysis

### AI-Generated / Vibe-Coded Signals (KILL LIST)

**Typography:**
- Gradient text on headings (especially purple-to-blue)
- Overly large hero text (80px+) with no hierarchy below
- Generic taglines: "The future of [X]", "Reimagine [X]"
- Excessive em-dashes (AI writing signature)

**Visual Design:**
- Glass morphism cards with frosted blur backgrounds
- Floating 3D objects unrelated to the product
- Gradient mesh backgrounds (purple/blue/pink blobs)
- Dot grid or grid pattern overlays
- "Bento box" feature grids with equal visual weight
- Dark mode with excessive glow/neon effects
- Particle effects, starfields, floating dots
- Abstract hero illustrations instead of product screenshots

**Content Patterns:**
- Icon + heading + 2-line description in 3-column grid (#1 AI pattern)
- Exactly three pricing tiers named "Starter / Pro / Enterprise"
- Testimonial cards with stock-photo avatars
- "Trusted by" section with fake logos
- CTA: "Get Started Free" or "Start Your Journey"

**Animation:**
- Every element animates in on scroll (fade-up, slide-in) with same timing
- Parallax on every section
- Counter animations counting up on scroll
- Mouse-follow effects (cursor glow, tilt cards)
- Typewriter text effects on hero heading

### Professionally Designed Signals (DO THESE)

**Typography:**
- One typeface family, max two. Hierarchy through size, weight, color.
- Body copy 16-18px, comfortable line-height (1.5-1.7), 60-75 char measure
- Specific, concrete copy: "Connect with 3 curated founders daily"
- Confident, short sentences

**Visual Design:**
- Restrained color: 1 accent used consistently, never decoratively
- Real product screenshots as hero content
- Whitespace as a design element (sections breathe)
- Color directs attention, doesn't decorate
- Subtle texture or grain over smooth gradients

**Content:**
- Social proof that feels real: specific names, results, companies
- Narrative arc: problem → insight → solution → proof → action
- Features shown in context (actual product), not abstract icons
- One clear primary CTA repeated consistently

**Animation:**
- Only where it communicates something (product demos, transitions)
- Most of page is static. Movement is exceptional.
- Page loads fast. No heavy animations blocking first paint.

---

## 3. Algorithm & Engagement Design

### Daily Feed Recommendations
- **Show exactly 5 profiles per day.** Sweet spot: enough for choice, few enough to feel curated.
- **Composition:** 3 algorithmically matched, 1 serendipitous (outside typical graph), 1 featured member (editorially curated).
- **Matching signals (priority order):**
  1. Declared intent match (both looking for co-founder, both fundraising)
  2. Complementary skills (technical ↔ business founder)
  3. Stage proximity (±1 stage)
  4. Industry adjacency (fintech might match regtech)
  5. Geographic overlap (same city for IRL potential)
  6. Mutual connections (shared 2nd-degree = trust signal)

### Room Engagement
- Max room size: 30 people (10 active participants ideal per Dunbar's research)
- Consider time-bounded rooms (7-day lifespan) for urgency
- Rooms should require contribution to enter (a take or question)
- Weekly "room of the week" for discovery
- Room hosts get reputation for high-engagement rooms

### Reputation Scoring
- Make reputation visible as qualitative tiers, not raw numbers
- Should be hard to gain, easy to lose (prevents gaming)
- Inputs: profile completeness (10%), post-meeting endorsements (25%), room participation quality (25%), engagement consistency (20%), referral quality (20%)
- 5% monthly decay for inactivity
- Current point system is reasonable but should emphasize quality over quantity

### Notification Strategy
- **Daily digest at 8 AM:** "Your 5 matches are ready" + room activity summary
- **Real-time only for:** DMs, meeting confirmations, application status
- **Weekly digest (Monday 9 AM):** Community highlights
- **Never notify for:** Generic likes, guilt-trip re-engagement
- **Budget:** Max 8 per week (7 daily + 1 weekly)

---

## 4. Community Growth Strategy

### Growth Playbook (0 → 1,000)
1. Launch with 150-200 hand-picked founding members with "Founding Member" permanent status
2. Open applications with ~30% acceptance rate at launch
3. Accept in cohort waves (bi-weekly batches of 20-30)
4. Tighten to 25% at 500 members, 15-20% at 2,000
5. Referral queue-jumping (member vouches skip waitlist)
6. Monthly "state of Convene" emails to waitlisted applicants (FOMO content)

### Acceptance Rate
- Sweet spot at launch: 25-35%
- Below 20%: struggle for critical mass, rejections create detractors
- Above 50%: application feels performative
- Announce acceptance rate publicly — it's marketing

### Minimum Viable Community Size
- **200 active members:** Minimum for 5 non-repeating daily matches with diversity
- **500 active members:** "Feels alive" — active room discussions, personalized matching
- **1,000+ active members:** Escape velocity — network effects outpace churn

---

## 5. Product Strategy Recommendations

### Tier Structure: Keep 3 tiers, consider renaming
- Current: Explorer / Builder / Catalyst
- Consider: Member (free) / Pro ($29/mo) / Patron ($99/mo)
- "Explorer" sounds passive; "Member" is clearer
- "Catalyst" is vague; "Patron" signals community investment

### Pricing
- **$29/mo (or $249/yr)** for Pro tier — above trivial ($10-15), below "ask my accountant" ($50+)
- **$99/mo (or $899/yr)** for Patron tier — captures established founders' willingness-to-pay
- Free base access gated by application — exclusivity comes from acceptance rate, not price
- Annual option saves ~28%, reduces churn dramatically

### One-Way DM Restrictions: DO NOT IMPLEMENT
- Codifies hierarchy into social fabric — creates caste system
- Punishes the most valuable cross-stage interactions
- Creates resentment that drives churn
- **Better approach:** Rate-limit DMs for everyone, let recipients set preferences, require connection request with note

### Platform Strategy
- **Web-first for launch** — founders work at computers, daily-batch model fits desktop routine
- Mobile-responsive from day 1, but defer native mobile until 2,000+ active members
- The daily-batch model doesn't require real-time mobile push

---

## 6. Design Direction

### Color Palette
- **Background:** Near-black (#09090B) — not pure black
- **Accent consideration:** The current red (#E53935) is bold but may be too aggressive for "exclusive community." Consider:
  - Keeping red but desaturating slightly for sophistication
  - Deep warm accent (copper/bronze #C4956A) for premium feel
  - Decision: Keep a variant of the brand red — it's distinctive and memorable. Desaturate to a more refined tone.
- **Text:** #FAFAFA (primary), #A1A1AA (secondary), #71717A (tertiary)

### Typography
- **Heading:** Geist Sans or Inter — clean, modern, widely respected in dev/founder circles
- **Body:** Same family (Inter) for cohesion — hierarchy via weight, not font mixing
- **Avoid:** Display serifs mixed with geometric sans (Playfair + Montserrat = AI cliche)

### Design Principles
1. Confidence over persuasion — private club entrance, not sales pitch
2. Show the product, not the concept — screenshots > abstract illustrations
3. Typography does the heavy lifting — large, light-weight text on dark
4. One accent color, used surgically — CTA, active states, key stats only
5. Negative space is the luxury signal — generous padding, room to breathe
6. Progressive disclosure — intrigue > satisfy
