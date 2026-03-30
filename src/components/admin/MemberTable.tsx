"use client";

import { useState, useMemo } from "react";
import type { MemberProfile, Tier } from "@/types";
import { seedProfiles } from "@/data/seedProfiles";
import TierBadge from "@/components/ui/TierBadge";

export default function MemberTable() {
  const [members, setMembers] = useState(seedProfiles as MemberProfile[]);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return members;
    const q = search.toLowerCase();
    return members.filter(
      (m) =>
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.location ?? "").toLowerCase().includes(q)
    );
  }, [members, search]);

  const handleTierChange = (id: string, tier: Tier) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, tier } : m))
    );
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members..."
          className="input max-w-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3">Member</th>
              <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3 hidden md:table-cell">Email</th>
              <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3 hidden lg:table-cell">Location</th>
              <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3">Tier</th>
              <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3">Rep</th>
              <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3">Posts</th>
              <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3">Change Tier</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.id} className="border-b border-border/50 hover:bg-surface-light/50 transition-colors">
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.full_name} className="w-7 h-7 rounded-md object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-md bg-surface-lighter flex items-center justify-center text-xs font-medium text-text-muted">
                        {member.full_name.charAt(0)}
                      </div>
                    )}
                    <span className="text-text-primary font-medium text-sm">{member.full_name}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-text-muted hidden md:table-cell text-xs">{member.email}</td>
                <td className="py-2.5 px-3 text-text-muted hidden lg:table-cell text-xs">{member.location ?? "-"}</td>
                <td className="py-2.5 px-3"><TierBadge tier={member.tier} size="sm" /></td>
                <td className="py-2.5 px-3 text-text-secondary text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                  {member.reputation_score}
                </td>
                <td className="py-2.5 px-3 text-text-muted text-xs">{member.total_room_posts}</td>
                <td className="py-2.5 px-3">
                  <select
                    value={member.tier}
                    onChange={(e) => handleTierChange(member.id, e.target.value as Tier)}
                    className="px-2 py-1 rounded-md bg-surface border border-border text-text-primary text-xs focus:outline-none focus:border-primary/50"
                  >
                    <option value="explorer">Explorer</option>
                    <option value="builder">Builder</option>
                    <option value="catalyst">Catalyst</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-muted py-8 text-sm">No members found.</p>
      )}
    </div>
  );
}
