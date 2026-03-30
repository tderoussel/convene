"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { seedRooms } from "@/data/seedRooms";
import { seedMessages } from "@/data/seedMessages";
import { seedProfiles } from "@/data/seedProfiles";
import TierBadge from "@/components/ui/TierBadge";
import { TIER_THRESHOLDS } from "@/lib/constants";
import { getTierLabel } from "@/lib/tiers";

function timeAgo(dateStr: string): string {
  const now = new Date("2026-03-29T12:00:00Z");
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function DashboardPage() {
  const { currentUser, joinedRoomIds } = useAppStore();

  const joinedRooms = useMemo(
    () => seedRooms.filter((r) => joinedRoomIds.includes(r.id)),
    [joinedRoomIds]
  );

  const recommendedRooms = useMemo(
    () => seedRooms.filter((r) => !joinedRoomIds.includes(r.id)).slice(0, 4),
    [joinedRoomIds]
  );

  const recentActivity = useMemo(() => {
    const joinedSet = new Set(joinedRoomIds);
    return seedMessages
      .filter((m) => joinedSet.has(m.room_id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6);
  }, [joinedRoomIds]);

  const profileMap = useMemo(() => {
    const map = new Map<string, (typeof seedProfiles)[0]>();
    seedProfiles.forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  const roomMap = useMemo(() => {
    const map = new Map<string, (typeof seedRooms)[0]>();
    seedRooms.forEach((r) => map.set(r.id, r));
    return map;
  }, []);

  if (!currentUser) return null;

  const tierProgress =
    currentUser.tier === "catalyst"
      ? 100
      : currentUser.tier === "builder"
        ? Math.min(100, ((currentUser.reputation_score - TIER_THRESHOLDS.builder) / (TIER_THRESHOLDS.catalyst - TIER_THRESHOLDS.builder)) * 100)
        : Math.min(100, (currentUser.reputation_score / TIER_THRESHOLDS.builder) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-text-primary">
          Welcome back, {currentUser.full_name.split(" ")[0]}
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Here&apos;s what&apos;s happening in your community.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Rooms", value: joinedRoomIds.length },
          { label: "Reputation", value: currentUser.reputation_score },
          { label: "Posts", value: currentUser.total_room_posts },
          { label: "Tier", value: getTierLabel(currentUser.tier) },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-[11px] text-text-muted font-medium uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-xl font-semibold text-text-primary mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tier Progress */}
      {currentUser.tier !== "catalyst" && (
        <div className="card p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">
              Progress to {getTierLabel(currentUser.tier === "explorer" ? "builder" : "catalyst")}
            </span>
            <span className="text-xs text-text-muted font-mono">
              {currentUser.reputation_score} / {currentUser.tier === "explorer" ? TIER_THRESHOLDS.builder : TIER_THRESHOLDS.catalyst}
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-lighter rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, tierProgress)}%` }}
            />
          </div>
        </div>
      )}

      {/* Your Rooms */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary">Your Rooms</h2>
          <Link href="/dashboard/rooms" className="text-xs text-primary hover:text-primary-hover transition-colors">
            View all
          </Link>
        </div>
        {joinedRooms.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-sm text-text-muted mb-3">You haven&apos;t joined any rooms yet.</p>
            <Link href="/dashboard/rooms" className="btn-primary text-sm">Browse Rooms</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {joinedRooms.slice(0, 6).map((room) => (
              <Link key={room.id} href={`/dashboard/rooms/${room.id}`} className="card-hover p-4">
                <h3 className="text-sm font-medium text-text-primary">{room.name}</h3>
                <p className="text-xs text-text-muted mt-1 line-clamp-1">{room.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-text-muted">{room.member_count} members</span>
                  <span className="text-[11px] px-1.5 py-px rounded bg-surface-lighter text-text-muted capitalize">{room.category}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recommended Rooms */}
      {recommendedRooms.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-text-primary mb-3">Recommended</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recommendedRooms.map((room) => (
              <Link key={room.id} href={`/dashboard/rooms/${room.id}`} className="card-hover p-3">
                <h3 className="text-xs font-medium text-text-primary">{room.name}</h3>
                <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">{room.description}</p>
                <span className="text-[11px] text-text-muted mt-1 block">{room.member_count} members</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-text-primary mb-3">Recent Activity</h2>
          <div className="space-y-1">
            {recentActivity.map((msg) => {
              const author = profileMap.get(msg.author_id);
              const room = roomMap.get(msg.room_id);
              return (
                <Link
                  key={msg.id}
                  href={`/dashboard/rooms/${msg.room_id}`}
                  className="flex gap-3 card-hover p-3"
                >
                  {author?.photo_url ? (
                    <img src={author.photo_url} alt={author.full_name} className="w-7 h-7 rounded-md object-cover shrink-0" />
                  ) : (
                    <div className="w-7 h-7 rounded-md bg-surface-lighter flex items-center justify-center text-[10px] font-medium text-text-muted shrink-0">
                      {author?.full_name?.charAt(0) ?? "?"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-text-primary">{author?.full_name ?? "Unknown"}</span>
                      {author && <TierBadge tier={author.tier} size="sm" />}
                      <span className="text-[11px] text-text-muted">in {room?.name ?? "Unknown"}</span>
                      <span className="text-[11px] text-text-muted ml-auto">{timeAgo(msg.created_at)}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{msg.content}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
