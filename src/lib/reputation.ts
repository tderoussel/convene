import type { ReputationEvent, MemberProfile, Tier } from "@/types";
import { REPUTATION_POINTS } from "./constants";
import { getTierFromReputation } from "./tiers";

// ── In-memory reputation event store (demo mode) ──

let reputationEvents: ReputationEvent[] = [];
let eventIdCounter = 1;

export function getReputationEvents(userId: string): ReputationEvent[] {
  return reputationEvents.filter((e) => e.user_id === userId);
}

export function addReputationEvent(
  userId: string,
  eventType: keyof typeof REPUTATION_POINTS,
  sourceUserId?: string,
  sourceDescription?: string
): ReputationEvent {
  const points = REPUTATION_POINTS[eventType];
  const event: ReputationEvent = {
    id: `rep-${eventIdCounter++}`,
    user_id: userId,
    event_type: eventType,
    points,
    source_user_id: sourceUserId ?? null,
    source_description: sourceDescription ?? null,
    created_at: new Date().toISOString(),
  };
  reputationEvents.push(event);
  return event;
}

export function calculateReputationScore(userId: string): number {
  return reputationEvents
    .filter((e) => e.user_id === userId)
    .reduce((sum, e) => sum + e.points, 0);
}

/**
 * Check if a user's tier should change based on their current score.
 * Returns the new tier if it changed, or null if no change.
 */
export function checkTierProgression(
  currentTier: Tier,
  currentScore: number
): Tier | null {
  const newTier = getTierFromReputation(currentScore);
  if (newTier !== currentTier) return newTier;
  return null;
}

// ── Tier history ──

export interface TierChange {
  id: string;
  user_id: string;
  old_tier: Tier;
  new_tier: Tier;
  changed_at: string;
}

let tierHistory: TierChange[] = [];
let tierChangeIdCounter = 1;

export function recordTierChange(
  userId: string,
  oldTier: Tier,
  newTier: Tier
): TierChange {
  const change: TierChange = {
    id: `tier-${tierChangeIdCounter++}`,
    user_id: userId,
    old_tier: oldTier,
    new_tier: newTier,
    changed_at: new Date().toISOString(),
  };
  tierHistory.push(change);
  return change;
}

export function getTierHistory(userId: string): TierChange[] {
  return tierHistory.filter((t) => t.user_id === userId);
}

// ── Seed some initial reputation events for demo ──

export function seedReputationData(profiles: MemberProfile[]) {
  if (reputationEvents.length > 0) return; // Already seeded

  for (const profile of profiles) {
    // Generate representative events based on existing scores
    const targetScore = profile.reputation_score;
    const posts = profile.total_room_posts ?? 0;

    // Room posts
    const postEvents = Math.min(posts, Math.floor(targetScore / REPUTATION_POINTS.room_post * 0.4));
    for (let i = 0; i < postEvents; i++) {
      addReputationEvent(profile.id, "room_post", undefined, "Room discussion post");
    }

    // Bookmarks received
    const bookmarkEvents = Math.floor((targetScore - postEvents * REPUTATION_POINTS.room_post) / REPUTATION_POINTS.bookmark_received * 0.5);
    for (let i = 0; i < Math.max(0, bookmarkEvents); i++) {
      addReputationEvent(profile.id, "bookmark_received", undefined, "Bookmarked by a member");
    }

    // Elevations
    const remaining = targetScore - (postEvents * REPUTATION_POINTS.room_post + bookmarkEvents * REPUTATION_POINTS.bookmark_received);
    if (remaining > 0) {
      const elevations = Math.floor(remaining / REPUTATION_POINTS.elevated);
      for (let i = 0; i < Math.max(0, elevations); i++) {
        addReputationEvent(profile.id, "elevated", undefined, "Elevated by a peer");
      }
    }
  }
}

/**
 * Human-readable label for reputation event types.
 */
export function getEventTypeLabel(eventType: string): string {
  const labels: Record<string, string> = {
    room_post: "Room post",
    bookmark_received: "Bookmark received",
    request_completed: "Request completed",
    elevated: "Peer elevation",
    flagged: "Flagged",
  };
  return labels[eventType] ?? eventType;
}
