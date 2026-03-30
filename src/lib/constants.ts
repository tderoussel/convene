import type { Tier } from '@/types';

/** Reputation thresholds required to reach each tier. */
export const TIER_THRESHOLDS: Record<Exclude<Tier, 'explorer'>, number> = {
  builder: 100,
  catalyst: 500,
};

/** Maximum DMs per day for each tier. */
export const DM_LIMITS: Record<Tier, number> = {
  explorer: 3,
  builder: 15,
  catalyst: Infinity,
};

/** Points awarded (or deducted) per reputation event type. */
export const REPUTATION_POINTS = {
  room_post: 1,
  bookmark_received: 2,
  request_completed: 5,
  elevated: 10,
  flagged: -5,
} as const;

/** Admin-level email addresses. */
export const ADMIN_EMAILS: string[] = ['tderoussel@gmail.com'];

/** App-wide branding constants. */
export const APP_NAME = 'Alyned' as const;
export const APP_TAGLINE = 'Where ambitious builders connect' as const;
