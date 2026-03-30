import type { Tier } from '@/types';
import { TIER_THRESHOLDS } from './constants';

/** Numeric ordering for tier comparisons. */
export const TIER_ORDER: Record<Tier, number> = {
  explorer: 0,
  builder: 1,
  catalyst: 2,
};

/** Derive a tier from a reputation score. */
export function getTierFromReputation(score: number): Tier {
  if (score >= TIER_THRESHOLDS.catalyst) return 'catalyst';
  if (score >= TIER_THRESHOLDS.builder) return 'builder';
  return 'explorer';
}

/**
 * Whether the sender is allowed to DM the recipient.
 * Explorers can only DM builders or catalysts (not other explorers).
 * Builders and catalysts can DM anyone.
 */
export function canDM(senderTier: Tier, recipientTier: Tier): boolean {
  if (TIER_ORDER[senderTier] >= TIER_ORDER.builder) return true;
  // Explorers can reach out to higher tiers only
  return TIER_ORDER[recipientTier] > TIER_ORDER[senderTier];
}

/** Only builders and catalysts may create rooms. */
export function canCreateRoom(tier: Tier): boolean {
  return TIER_ORDER[tier] >= TIER_ORDER.builder;
}

/** Elevations can only flow upward or laterally (no self-elevation). */
export function canElevate(elevatorTier: Tier, elevatedTier: Tier): boolean {
  return TIER_ORDER[elevatorTier] >= TIER_ORDER[elevatedTier];
}

/** CSS colour variable for a given tier. */
export function getTierColor(tier: Tier): string {
  const map: Record<Tier, string> = {
    explorer: 'var(--color-tier-explorer)',
    builder: 'var(--color-tier-builder)',
    catalyst: 'var(--color-tier-catalyst)',
  };
  return map[tier];
}

/** Human-readable label for a given tier. */
export function getTierLabel(tier: Tier): string {
  const map: Record<Tier, string> = {
    explorer: 'Explorer',
    builder: 'Builder',
    catalyst: 'Catalyst',
  };
  return map[tier];
}
