"use client";

import { useState } from "react";
import type { WaitlistEntry } from "@/types";

const seedWaitlist: WaitlistEntry[] = [
  {
    id: "w1",
    email: "sam.brooks@techstartup.io",
    full_name: "Sam Brooks",
    one_liner: "Building an AI scheduling assistant for enterprise teams",
    linkedin_url: "https://linkedin.com/in/sam-brooks",
    referral_source: "twitter",
    referred_by_code: null,
    status: "waiting",
    admin_notes: null,
    invited_at: null,
    created_at: "2026-03-20T10:00:00Z",
  },
  {
    id: "w2",
    email: "lisa.wang@stripe.com",
    full_name: "Lisa Wang",
    one_liner: "Senior PM at Stripe, exploring fintech ideas for gig workers",
    linkedin_url: "https://linkedin.com/in/lisa-wang",
    referral_source: "referral",
    referred_by_code: "raj-patel-x7k2",
    status: "waiting",
    admin_notes: null,
    invited_at: null,
    created_at: "2026-03-21T14:30:00Z",
  },
  {
    id: "w3",
    email: "tom.fischer@gmail.com",
    full_name: "Tom Fischer",
    one_liner: "Ex-Google engineer, working on open-source database tooling",
    linkedin_url: "https://linkedin.com/in/tom-fischer",
    referral_source: "product_hunt",
    referred_by_code: null,
    status: "accepted",
    admin_notes: "Strong technical background",
    invited_at: "2026-03-22T09:00:00Z",
    created_at: "2026-03-19T08:15:00Z",
  },
  {
    id: "w4",
    email: "anita.sharma@outlook.com",
    full_name: "Anita Sharma",
    one_liner: "MBA student at Wharton, researching proptech opportunities",
    linkedin_url: "https://linkedin.com/in/anita-sharma",
    referral_source: "linkedin",
    referred_by_code: null,
    status: "waiting",
    admin_notes: null,
    invited_at: null,
    created_at: "2026-03-22T16:00:00Z",
  },
  {
    id: "w5",
    email: "james.clark@techcrunch.com",
    full_name: "James Clark",
    one_liner: "Tech journalist exploring community building for creators",
    linkedin_url: "https://linkedin.com/in/james-clark",
    referral_source: "twitter",
    referred_by_code: null,
    status: "rejected",
    admin_notes: "Journalist, not a builder",
    invited_at: null,
    created_at: "2026-03-18T11:00:00Z",
  },
];

interface WaitlistTableProps {
  statusFilter?: "all" | "waiting" | "accepted" | "rejected";
}

export default function WaitlistTable({
  statusFilter = "all",
}: WaitlistTableProps) {
  const [entries, setEntries] = useState(seedWaitlist);
  const [filter, setFilter] = useState(statusFilter);

  const filtered =
    filter === "all" ? entries : entries.filter((e) => e.status === filter);

  const updateStatus = (id: string, status: WaitlistEntry["status"]) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status,
              invited_at:
                status === "accepted" ? new Date().toISOString() : e.invited_at,
            }
          : e
      )
    );
  };

  return (
    <div>
      {/* Filter */}
      <div className="flex gap-1.5 mb-4">
        {(["all", "waiting", "accepted", "rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
              filter === s
                ? "bg-primary/10 text-primary"
                : "bg-surface-light text-text-muted border border-border hover:bg-surface-lighter"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3">Name</th>
              <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3">Email</th>
              <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3 hidden md:table-cell">One-Liner</th>
              <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3 hidden lg:table-cell">Link</th>
              <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3">Status</th>
              <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3">Date</th>
              <th className="text-left text-text-muted font-medium text-xs py-2.5 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => (
              <tr key={entry.id} className="border-b border-border/50 hover:bg-surface-light/50 transition-colors">
                <td className="py-2.5 px-3 text-text-primary font-medium">{entry.full_name}</td>
                <td className="py-2.5 px-3 text-text-muted text-xs">{entry.email}</td>
                <td className="py-2.5 px-3 text-text-muted hidden md:table-cell text-xs max-w-[200px] truncate">{entry.one_liner}</td>
                <td className="py-2.5 px-3 hidden lg:table-cell">
                  <a href={entry.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover text-xs transition-colors">
                    LinkedIn
                  </a>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      entry.status === "accepted"
                        ? "bg-success/10 text-success"
                        : entry.status === "rejected"
                          ? "bg-danger/10 text-danger"
                          : "bg-warning/10 text-warning"
                    }`}
                  >
                    {entry.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-text-muted text-xs">
                  {new Date(entry.created_at).toLocaleDateString()}
                </td>
                <td className="py-2.5 px-3">
                  {entry.status === "waiting" && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateStatus(entry.id, "accepted")}
                        className="text-xs px-2 py-1 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(entry.id, "rejected")}
                        className="text-xs px-2 py-1 rounded-md bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-muted py-8 text-sm">No entries found.</p>
      )}
    </div>
  );
}
