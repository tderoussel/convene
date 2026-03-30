"use client";

import type { Room, Tier } from "@/types";
import { TIER_ORDER } from "@/lib/tiers";
import TierBadge from "@/components/ui/TierBadge";

function formatTimeAgo(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  return `${diffDays}d ago`;
}

function isVeryRecentlyActive(date: string): boolean {
  return Date.now() - new Date(date).getTime() < 3600000; // < 1 hour
}

function isRecentlyActive(date: string): boolean {
  return Date.now() - new Date(date).getTime() < 86400000; // < 24 hours
}

interface RoomCardProps {
  room: Room;
  userTier: Tier;
  isJoined: boolean;
  onJoin: () => void;
  messagesToday?: number;
  lastActiveAt?: string;
}

export default function RoomCard(props: RoomCardProps) {
  const { room, userTier, isJoined, onJoin } = props;
  const isLocked = TIER_ORDER[room.min_tier] > TIER_ORDER[userTier];

  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col transition-colors ${
        isLocked ? "opacity-60" : "hover:bg-white/[0.08]"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-text-primary text-base leading-tight">
          {room.name}
        </h3>
        {isLocked && (
          <svg
            className="w-4 h-4 text-text-muted shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        )}
      </div>

      <p className="text-sm text-text-secondary line-clamp-2 mb-3 flex-1">
        {room.description}
      </p>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-text-secondary capitalize">
          {room.category}
        </span>
        <span className="text-xs text-text-muted">
          {room.member_count} members
        </span>
        {room.min_tier !== "explorer" && (
          <TierBadge tier={room.min_tier} size="sm" />
        )}
        {/* Activity indicator */}
        {props.lastActiveAt && (
          <span className={`text-xs flex items-center gap-1 ${
            (props.messagesToday ?? 0) > 0
              ? 'text-violet-400'
              : isRecentlyActive(props.lastActiveAt)
                ? 'text-text-secondary'
                : 'text-text-muted'
          }`}>
            {isVeryRecentlyActive(props.lastActiveAt) && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
            {(props.messagesToday ?? 0) > 0
              ? `${props.messagesToday} messages today`
              : `Active ${formatTimeAgo(props.lastActiveAt)}`}
          </span>
        )}
      </div>

      {isLocked ? (
        <p className="text-xs text-text-muted text-center py-2">
          {room.min_tier === "catalyst" ? "Catalyst" : "Builder"}+ required
        </p>
      ) : isJoined ? (
        <span className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-emerald-400 py-2">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          Joined
        </span>
      ) : (
        <button
          onClick={onJoin}
          className="w-full py-2 rounded-xl border border-violet-500/40 text-sm font-medium text-violet-400 hover:bg-violet-600/15 transition-colors"
        >
          Join
        </button>
      )}
    </div>
  );
}
