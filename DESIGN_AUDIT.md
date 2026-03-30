# Convene — Design Audit

## Current State Assessment

The current landing page exhibits multiple "vibe-coded" patterns that undermine credibility with the target audience (founders, investors, operators who use Linear/Notion/Superhuman daily).

## Issues Found & Remediation Plan

### CRITICAL (Immediately signals "AI-generated")

| Issue | Current State | Fix |
|---|---|---|
| Gradient text | Headings use gradient fills | Remove all gradients. Use solid color with weight hierarchy. |
| Glass morphism | Cards use backdrop-blur and semi-transparent backgrounds | Replace with subtle 1px borders, flat backgrounds, no blur |
| Framer Motion overuse | Every element has fade-up/slide-in on scroll | Remove all scroll-triggered animations. Keep only purposeful micro-interactions. |
| Generic hero copy | "The future of networking" energy | Rewrite with specific, founder-voice copy |
| Generic fonts | Syne + Space Grotesk combination feels decorative | Replace with Inter/Geist — clean, professional, proven |
| Excessive decoration | Visual noise competing with content | Strip to typography + whitespace + one accent color |

### HIGH PRIORITY (Looks generic/template-like)

| Issue | Current State | Fix |
|---|---|---|
| 3-column feature grid | Icon + heading + description pattern | Show features in product context (screenshots/mockups) |
| Rounded shadow cards | Cards with drop shadows and large border-radius | Flat cards with subtle borders, sharp or minimal radius |
| Purple/violet color scheme | Primary accent is purple/violet | Switch to refined red or warm accent on dark neutral |
| Animation timing | All animations use same duration/easing | Remove most, keep 1-2 purposeful ones |
| Hero section overload | Too many elements competing for attention | One headline, one CTA, one product preview |

### MEDIUM PRIORITY (Polishing issues)

| Issue | Current State | Fix |
|---|---|---|
| No real product shots | Abstract representations of features | Build actual UI mockups/screenshots into landing page |
| Generic social proof | No specific stats or testimonials | Add specific numbers ("387 founders from 2,400 applications") |
| Long page with equal sections | 8+ sections all same visual weight | 5 sections max, clear hierarchy between them |
| No custom logo | No distinctive brand mark | Design SVG logo (wordmark + icon mark) |
| Default favicon | Next.js default | Generate from logo icon mark |

## Design System Specification

### Colors
```
--background: #09090B
--card: #111113
--border: rgba(255, 255, 255, 0.08)
--border-hover: rgba(255, 255, 255, 0.15)
--text-primary: #FAFAFA
--text-secondary: #A1A1AA
--text-tertiary: #71717A
--accent: #E53935 (brand red — use sparingly)
--accent-hover: #EF5350
--accent-muted: rgba(229, 57, 53, 0.1)
--success: #22C55E
--warning: #F59E0B
--error: #EF4444
```

### Typography
```
--font-heading: 'Inter', system-ui, sans-serif
--font-body: 'Inter', system-ui, sans-serif

Heading sizes:
  h1: 48px / 700 weight / -0.02em tracking
  h2: 32px / 600 weight / -0.01em tracking
  h3: 24px / 600 weight / 0 tracking
  h4: 18px / 600 weight / 0 tracking

Body:
  large: 18px / 400 weight / 1.7 line-height
  default: 16px / 400 weight / 1.6 line-height
  small: 14px / 400 weight / 1.5 line-height
  caption: 12px / 500 weight / 1.4 line-height
```

### Spacing (4px base grid)
```
1: 4px    5: 20px   9: 48px
2: 8px    6: 24px   10: 64px
3: 12px   7: 32px   11: 80px
4: 16px   8: 40px   12: 96px
```

### Components
- **Buttons:** No shadow. Subtle border on secondary. Solid fill on primary (accent color). 8px border-radius max.
- **Cards:** 1px border (--border), --card background, 8-12px border-radius. NO backdrop-blur, NO shadow.
- **Inputs:** 1px border, transparent background, focus ring in accent color. 8px border-radius.
- **Badges:** Pill shape, muted background color, small text. No shadow.

### Animation Policy
- **Allowed:** Button hover/press states (scale 0.98, 150ms), page transitions (opacity, 200ms), loading skeletons (shimmer), focus ring transitions
- **Forbidden:** Scroll-triggered entrance animations, parallax, counter animations, floating particles, typewriter effects, mouse-follow effects
