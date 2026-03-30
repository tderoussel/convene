"use client";

import { useState } from "react";
import { seedRooms } from "@/data/seedRooms";
import { seedProfiles } from "@/data/seedProfiles";
import type { Room, MemberProfile } from "@/types";
import TierBadge from "@/components/ui/TierBadge";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(seedRooms);

  const profileMap = new Map<string, MemberProfile>();
  (seedProfiles as MemberProfile[]).forEach((p) => profileMap.set(p.id, p));

  const toggleArchive = (id: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, is_archived: !r.is_archived } : r
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1
        className="text-2xl font-bold text-text-primary mb-6"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Room Management
      </h1>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-text-muted font-medium py-3 px-3">
                  Room
                </th>
                <th className="text-left text-text-muted font-medium py-3 px-3 hidden md:table-cell">
                  Category
                </th>
                <th className="text-left text-text-muted font-medium py-3 px-3">
                  Min Tier
                </th>
                <th className="text-left text-text-muted font-medium py-3 px-3">
                  Members
                </th>
                <th className="text-left text-text-muted font-medium py-3 px-3 hidden lg:table-cell">
                  Created By
                </th>
                <th className="text-left text-text-muted font-medium py-3 px-3">
                  Status
                </th>
                <th className="text-left text-text-muted font-medium py-3 px-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => {
                const creator = profileMap.get(room.created_by);
                return (
                  <tr
                    key={room.id}
                    className={`border-b border-white/[0.03] hover:bg-white/[0.02] ${
                      room.is_archived ? "opacity-50" : ""
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div>
                        <p className="text-text-primary font-medium">
                          {room.name}
                        </p>
                        <p className="text-xs text-text-muted truncate max-w-[200px]">
                          {room.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-text-secondary capitalize">
                        {room.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <TierBadge tier={room.min_tier} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-text-secondary text-xs">
                      {room.member_count}
                    </td>
                    <td className="py-3 px-3 text-text-muted text-xs hidden lg:table-cell">
                      {creator?.full_name ?? "-"}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          room.is_archived
                            ? "bg-red-500/15 text-red-400"
                            : "bg-emerald-500/15 text-emerald-400"
                        }`}
                      >
                        {room.is_archived ? "Archived" : "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => toggleArchive(room.id)}
                        className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                          room.is_archived
                            ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        }`}
                      >
                        {room.is_archived ? "Restore" : "Archive"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
