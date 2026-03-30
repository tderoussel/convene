"use client";

import Link from "next/link";
import { seedProfiles } from "@/data/seedProfiles";
import { seedRooms } from "@/data/seedRooms";
import { seedMessages } from "@/data/seedMessages";
import type { MemberProfile } from "@/types";
import TierBadge from "@/components/ui/TierBadge";

const stats = {
  totalWaitlist: 47,
  pendingApplications: 12,
  activeMembers: seedProfiles.length,
  totalRooms: seedRooms.length,
  messagesToday: seedMessages.filter((m) =>
    m.created_at.startsWith("2026-03-16")
  ).length,
};

const recentApplications = (seedProfiles as MemberProfile[])
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  .slice(0, 5);

export default function AdminPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-semibold text-text-primary mb-6">Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {[
          { label: "Total Waitlist", value: stats.totalWaitlist },
          { label: "Pending Apps", value: stats.pendingApplications, highlight: true },
          { label: "Active Members", value: stats.activeMembers },
          { label: "Total Rooms", value: stats.totalRooms },
          { label: "Messages Today", value: stats.messagesToday },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`card p-4 ${stat.highlight ? "border-warning/30" : ""}`}
          >
            <p className="text-text-muted text-[11px] font-medium uppercase tracking-wider">
              {stat.label}
            </p>
            <p
              className={`text-2xl font-semibold mt-1 ${
                stat.highlight ? "text-warning" : "text-text-primary"
              }`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <Link href="/admin/waitlist" className="btn-primary text-xs px-3 py-1.5">
          View Applications
        </Link>
        <Link href="/admin/members" className="btn-secondary text-xs px-3 py-1.5">
          Manage Members
        </Link>
      </div>

      {/* Recent Applications */}
      <section className="card p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Recent Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3">Name</th>
                <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3 hidden md:table-cell">Email</th>
                <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3 hidden lg:table-cell">One-Liner</th>
                <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3">Tier</th>
                <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((member) => (
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
                  <td className="py-2.5 px-3 text-text-muted hidden lg:table-cell text-xs max-w-[200px] truncate">{member.one_liner}</td>
                  <td className="py-2.5 px-3"><TierBadge tier={member.tier} size="sm" /></td>
                  <td className="py-2.5 px-3 text-text-muted text-xs">{new Date(member.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
