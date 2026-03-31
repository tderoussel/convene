import type { MemberProfile, Tier } from "@/types";

// ── Scoring weights ──

const WEIGHT_LOOKING_FOR_MATCH = 25;
const WEIGHT_COMPLEMENTARY_TYPE = 20;
const WEIGHT_LOCATION_MATCH = 15;
const WEIGHT_RECENCY = 10;
const FEED_SIZE = 5;

// ── Complementary looking-for relationships ──
// Founders looking for investment match investors looking for deal flow, etc.
const COMPLEMENTARY_LOOKING_FOR: Record<string, string[]> = {
  Cofounder: ["Cofounder"],
  Investment: ["Community", "Multiple"],
  Advisor: ["Community", "Multiple"],
  Hires: ["Community", "Cofounder"],
  Community: ["Investment", "Advisor", "Multiple"],
  Multiple: ["Investment", "Advisor", "Community"],
};

// ── Complementary tiers ──
// Explorers benefit from Builders/Catalysts, Builders from Catalysts
const TIER_COMPATIBILITY_BONUS: Record<Tier, Record<Tier, number>> = {
  explorer: { explorer: 0, builder: 15, catalyst: 20 },
  builder: { explorer: 5, builder: 5, catalyst: 15 },
  catalyst: { explorer: 10, builder: 10, catalyst: 5 },
};

/**
 * Calculate relevance score between two members.
 */
function calculateRelevance(
  viewer: MemberProfile,
  candidate: MemberProfile
): number {
  let score = 0;

  // 1. "Looking for" alignment
  const viewerLooking = viewer.what_looking_for ?? "";
  const candidateLooking = candidate.what_looking_for ?? "";
  if (viewerLooking && candidateLooking) {
    // Direct match: both looking for the same thing
    if (viewerLooking === candidateLooking) {
      score += WEIGHT_LOOKING_FOR_MATCH;
    }
    // Complementary match
    const complementary = COMPLEMENTARY_LOOKING_FOR[viewerLooking] ?? [];
    if (complementary.includes(candidateLooking)) {
      score += WEIGHT_LOOKING_FOR_MATCH * 0.8;
    }
  }

  // 2. Tier compatibility
  score += TIER_COMPATIBILITY_BONUS[viewer.tier]?.[candidate.tier] ?? 0;

  // 3. Complementary type bonus
  if (
    viewerLooking &&
    candidateLooking &&
    viewerLooking !== candidateLooking
  ) {
    score += WEIGHT_COMPLEMENTARY_TYPE * 0.5;
  }

  // 4. Geographic proximity
  if (
    viewer.location &&
    candidate.location &&
    extractCity(viewer.location) === extractCity(candidate.location)
  ) {
    score += WEIGHT_LOCATION_MATCH;
  }

  // 5. Recency bonus (joined in last 30 days)
  const thirtyDaysAgo = new Date("2026-02-28T00:00:00Z");
  if (new Date(candidate.created_at) >= thirtyDaysAgo) {
    score += WEIGHT_RECENCY;
  }

  return score;
}

function extractCity(location: string): string {
  // Normalize: "San Francisco, CA" → "san francisco"
  return location.split(",")[0].trim().toLowerCase();
}

/**
 * Generate a daily curated feed for a given user.
 * Deterministic per day — uses date as seed for consistent results within a day.
 */
export function generateDailyFeed(
  viewer: MemberProfile,
  allMembers: MemberProfile[],
  dateStr: string = "2026-03-29"
): MemberProfile[] {
  // Filter out the viewer themselves and already-connected members
  const candidates = allMembers.filter(
    (m) =>
      m.id !== viewer.id &&
      m.application_status === "accepted"
  );

  // Score each candidate
  const scored = candidates.map((candidate) => ({
    member: candidate,
    score: calculateRelevance(viewer, candidate),
  }));

  // Sort by score descending, with deterministic tie-breaking based on date + member id
  const dateSeed = dateStr.replace(/-/g, "");
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Deterministic tie-break using date seed XOR with member id hash
    const hashA = simpleHash(dateSeed + a.member.id);
    const hashB = simpleHash(dateSeed + b.member.id);
    return hashA - hashB;
  });

  return scored.slice(0, FEED_SIZE).map((s) => s.member);
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}
