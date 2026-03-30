"use client";

import { useState, useMemo } from "react";
import { seedProfiles } from "@/data/seedProfiles";
import MemberCard from "@/components/members/MemberCard";
import type { Tier, MemberProfile } from "@/types";

const tierFilters: { value: Tier | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "explorer", label: "Explorer" },
  { value: "builder", label: "Builder" },
  { value: "catalyst", label: "Catalyst" },
];

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<Tier | "all">("all");

  const filtered = useMemo(() => {
    return (seedProfiles as MemberProfile[]).filter((p) => {
      if (tierFilter !== "all" && p.tier !== tierFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.full_name.toLowerCase().includes(q) &&
          !(p.one_liner ?? "").toLowerCase().includes(q) &&
          !(p.location ?? "").toLowerCase().includes(q) &&
          !(p.what_looking_for ?? "").toLowerCase().includes(q) &&
          !(p.offer_statement ?? "").toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [search, tierFilter]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-semibold text-text-primary mb-5">Members</h1>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, bio, location, or skills..."
            className="input pl-9"
          />
        </div>
      </div>

      {/* Tier Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tierFilters.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setTierFilter(tf.value)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              tierFilter === tf.value
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-surface-light text-text-muted border border-border hover:text-text-secondary"
            }`}
          >
            {tf.label}
          </button>
        ))}
        <span className="text-xs text-text-muted self-center ml-2">{filtered.length} members</span>
      </div>

      {/* Member Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-text-muted">No members match your search.</p>
        </div>
      )}
    </div>
  );
}
