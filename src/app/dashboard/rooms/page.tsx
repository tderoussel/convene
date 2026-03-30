"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { seedRooms } from "@/data/seedRooms";
import type { RoomCategory } from "@/types";
import TierBadge from "@/components/ui/TierBadge";
import { TIER_ORDER } from "@/lib/tiers";

const categories: { value: RoomCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "industry", label: "Industry" },
  { value: "cofounder", label: "Co-founder" },
  { value: "investors", label: "Investors" },
  { value: "advice", label: "Advice" },
  { value: "city", label: "City" },
];

export default function RoomsPage() {
  const { currentUser, joinedRoomIds, joinRoom } = useAppStore();
  const [categoryFilter, setCategoryFilter] = useState<RoomCategory | "all">("all");

  const rooms = useMemo(() => {
    if (categoryFilter === "all") return seedRooms;
    return seedRooms.filter((r) => r.category === categoryFilter);
  }, [categoryFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-semibold text-text-primary mb-5">Rooms</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              categoryFilter === cat.value
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-surface-light text-text-muted border border-border hover:text-text-secondary"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rooms.map((room) => {
          const isJoined = joinedRoomIds.includes(room.id);
          const isLocked = currentUser && TIER_ORDER[room.min_tier] > TIER_ORDER[currentUser.tier];

          return (
            <div key={room.id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <Link href={`/dashboard/rooms/${room.id}`} className="text-sm font-medium text-text-primary hover:text-primary transition-colors">
                  {room.name}
                </Link>
                {room.min_tier !== "explorer" && <TierBadge tier={room.min_tier} size="sm" />}
              </div>
              <p className="text-xs text-text-muted line-clamp-2 mb-3">{room.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-muted">{room.member_count} members</span>
                {isLocked ? (
                  <span className="text-[11px] text-text-muted">Locked</span>
                ) : isJoined ? (
                  <Link href={`/dashboard/rooms/${room.id}`} className="text-[11px] text-primary hover:text-primary-hover transition-colors">
                    Open
                  </Link>
                ) : (
                  <button onClick={() => joinRoom(room.id)} className="text-[11px] text-primary hover:text-primary-hover transition-colors">
                    Join
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
