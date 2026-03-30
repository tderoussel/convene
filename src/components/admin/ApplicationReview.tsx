"use client";

import { useState } from "react";
import type { MemberProfile, Tier } from "@/types";
import { seedProfiles } from "@/data/seedProfiles";
import TierBadge from "@/components/ui/TierBadge";

const pendingApplications = (seedProfiles as MemberProfile[])
  .filter((p) => p.application_status === "accepted")
  .slice(0, 5)
  .map((p, i) => ({
    ...p,
    application_status: i < 2 ? ("pending" as const) : p.application_status,
  }));

export default function ApplicationReview() {
  const [applications, setApplications] = useState(pendingApplications);
  const [selectedId, setSelectedId] = useState<string | null>(
    applications.find((a) => a.application_status === "pending")?.id ?? null
  );

  const selected = applications.find((a) => a.id === selectedId);

  const handleAction = (
    id: string,
    status: MemberProfile["application_status"],
    tier?: Tier
  ) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, application_status: status, tier: tier ?? a.tier }
          : a
      )
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Application List */}
      <div className="lg:col-span-1 space-y-1">
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3 px-1">
          Applications
        </h3>
        {applications.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedId(app.id)}
            className={`w-full text-left p-3 rounded-md transition-colors ${
              selectedId === app.id
                ? "bg-primary/10 border border-primary/20"
                : "card-hover"
            }`}
          >
            <div className="flex items-center gap-3">
              {app.photo_url ? (
                <img src={app.photo_url} alt={app.full_name} className="w-8 h-8 rounded-md object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-md bg-surface-lighter flex items-center justify-center text-xs font-medium text-text-muted">
                  {app.full_name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{app.full_name}</p>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    app.application_status === "pending"
                      ? "bg-warning/10 text-warning"
                      : app.application_status === "accepted"
                        ? "bg-success/10 text-success"
                        : "bg-danger/10 text-danger"
                  }`}
                >
                  {app.application_status}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail View */}
      <div className="lg:col-span-2">
        {selected ? (
          <div className="card p-5">
            <div className="flex items-start gap-4 mb-5">
              {selected.photo_url ? (
                <img src={selected.photo_url} alt={selected.full_name} className="w-14 h-14 rounded-md object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-md bg-surface-lighter flex items-center justify-center text-xl font-medium text-text-muted">
                  {selected.full_name.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-text-primary">{selected.full_name}</h2>
                <p className="text-sm text-text-muted">{selected.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <TierBadge tier={selected.tier} size="sm" />
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      selected.application_status === "pending"
                        ? "bg-warning/10 text-warning"
                        : selected.application_status === "accepted"
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                    }`}
                  >
                    {selected.application_status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {selected.one_liner && (
                <div>
                  <h4 className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1">One-Liner</h4>
                  <p className="text-sm text-text-secondary">{selected.one_liner}</p>
                </div>
              )}
              {selected.offer_statement && (
                <div>
                  <h4 className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1">What They Offer</h4>
                  <p className="text-sm text-text-secondary">{selected.offer_statement}</p>
                </div>
              )}
              {selected.what_looking_for && (
                <div>
                  <h4 className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1">Looking For</h4>
                  <p className="text-sm text-text-secondary">{selected.what_looking_for}</p>
                </div>
              )}
              <div className="flex gap-3 flex-wrap">
                {selected.linkedin_url && (
                  <a href={selected.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover transition-colors">
                    LinkedIn
                  </a>
                )}
                {selected.company_url && (
                  <a href={selected.company_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover transition-colors">
                    Company
                  </a>
                )}
              </div>
            </div>

            {/* Actions */}
            {selected.application_status === "pending" && (
              <div className="mt-5 pt-5 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    id="tier-select"
                    defaultValue={selected.tier}
                    className="px-2.5 py-1.5 rounded-md bg-surface border border-border text-text-primary text-sm focus:outline-none focus:border-primary/50"
                    onChange={() => {}}
                  >
                    <option value="explorer">Explorer</option>
                    <option value="builder">Builder</option>
                    <option value="catalyst">Catalyst</option>
                  </select>
                  <button
                    onClick={() => {
                      const sel = document.getElementById("tier-select") as HTMLSelectElement;
                      handleAction(selected.id, "accepted", sel.value as Tier);
                    }}
                    className="btn-primary text-xs px-3 py-1.5 !bg-success hover:!bg-success/90"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(selected.id, "waitlisted")}
                    className="btn-secondary text-xs px-3 py-1.5 !border-warning/30 !text-warning hover:!bg-warning/5"
                  >
                    Waitlist
                  </button>
                  <button
                    onClick={() => handleAction(selected.id, "rejected")}
                    className="btn-secondary text-xs px-3 py-1.5 !border-danger/30 !text-danger hover:!bg-danger/5"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 card">
            <p className="text-text-muted text-sm">Select an application to review</p>
          </div>
        )}
      </div>
    </div>
  );
}
