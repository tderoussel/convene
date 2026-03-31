"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import TierBadge from "@/components/ui/TierBadge";
import AvatarUpload from "@/components/ui/AvatarUpload";
import { TIER_THRESHOLDS, REPUTATION_POINTS } from "@/lib/constants";
import { getTierLabel } from "@/lib/tiers";
import { getReputationEvents, seedReputationData, getEventTypeLabel } from "@/lib/reputation";
import { seedProfiles } from "@/data/seedProfiles";
import type { MemberProfile } from "@/types";

export default function ProfilePage() {
  const { currentUser, login } = useAppStore();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    full_name: currentUser?.full_name ?? "",
    photo_url: currentUser?.photo_url ?? "",
    location: currentUser?.location ?? "",
    one_liner: currentUser?.one_liner ?? "",
    what_looking_for: currentUser?.what_looking_for ?? "",
    offer_statement: currentUser?.offer_statement ?? "",
    linkedin_url: currentUser?.linkedin_url ?? "",
    company_url: currentUser?.company_url ?? "",
  });

  if (!currentUser) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = () => {
    login({
      ...currentUser,
      ...form,
      photo_url: form.photo_url || null,
      location: form.location || null,
      one_liner: form.one_liner || null,
      what_looking_for: form.what_looking_for || null,
      offer_statement: form.offer_statement || null,
      linkedin_url: form.linkedin_url || null,
      company_url: form.company_url || null,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tierProgress =
    currentUser.tier === "catalyst" ? 100
      : currentUser.tier === "builder"
        ? Math.min(100, ((currentUser.reputation_score - TIER_THRESHOLDS.builder) / (TIER_THRESHOLDS.catalyst - TIER_THRESHOLDS.builder)) * 100)
        : Math.min(100, (currentUser.reputation_score / TIER_THRESHOLDS.builder) * 100);

  const nextTier = currentUser.tier === "catalyst" ? null : currentUser.tier === "builder" ? "catalyst" : "builder";
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier as keyof typeof TIER_THRESHOLDS] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-semibold text-text-primary mb-5">Your Profile</h1>

      {/* Current Status */}
      <div className="card p-5 mb-5">
        <div className="flex items-center gap-4 mb-4">
          {currentUser.photo_url ? (
            <img src={currentUser.photo_url} alt={currentUser.full_name} className="w-14 h-14 rounded-lg object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-surface-lighter flex items-center justify-center text-xl font-medium text-text-muted">
              {currentUser.full_name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-base font-semibold text-text-primary">{currentUser.full_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <TierBadge tier={currentUser.tier} />
              <span className="text-xs text-text-muted font-mono">{currentUser.reputation_score} rep</span>
            </div>
          </div>
        </div>

        {nextTier && nextThreshold && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-text-muted">Progress to {getTierLabel(nextTier as 'builder' | 'catalyst')}</span>
              <span className="text-xs text-text-muted font-mono">{currentUser.reputation_score} / {nextThreshold}</span>
            </div>
            <div className="w-full h-1.5 bg-surface-lighter rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${Math.max(2, tierProgress)}%` }} />
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">How to earn reputation</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: "Room post", points: REPUTATION_POINTS.room_post },
              { label: "Bookmark received", points: REPUTATION_POINTS.bookmark_received },
              { label: "Request completed", points: REPUTATION_POINTS.request_completed },
              { label: "Elevation received", points: REPUTATION_POINTS.elevated },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-[11px]">
                <span className="text-text-muted">{item.label}</span>
                <span className="text-text-muted font-mono">+{item.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reputation History */}
      <ReputationHistory userId={currentUser.id} />

      {/* Edit Form */}
      <div className="card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-text-primary">Edit Profile</h2>

        <div>
          <label className="block text-xs text-text-muted mb-1">Full Name</label>
          <input type="text" name="full_name" value={form.full_name} onChange={handleChange} className="input" />
        </div>

        <AvatarUpload
          currentUrl={form.photo_url || null}
          name={form.full_name || "User"}
          onUpload={(dataUrl) => {
            setForm((prev) => ({ ...prev, photo_url: dataUrl }));
            setSaved(false);
          }}
          onRemove={() => {
            setForm((prev) => ({ ...prev, photo_url: "" }));
            setSaved(false);
          }}
        />

        <div>
          <label className="block text-xs text-text-muted mb-1">Location</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="San Francisco, CA" className="input" />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">One-liner</label>
          <textarea name="one_liner" value={form.one_liner} onChange={handleChange} rows={2} placeholder="A brief description..." className="input resize-none" />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">Looking for</label>
          <select name="what_looking_for" value={form.what_looking_for} onChange={handleChange} className="input appearance-none">
            <option value="">Select...</option>
            <option value="Cofounder">Cofounder</option>
            <option value="Investment">Investment</option>
            <option value="Advisor">Advisor</option>
            <option value="Hires">Hires</option>
            <option value="Community">Community</option>
            <option value="Multiple">Multiple</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">What I offer</label>
          <textarea name="offer_statement" value={form.offer_statement} onChange={handleChange} rows={3} placeholder="How can you help others?" className="input resize-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-text-muted mb-1">LinkedIn URL</label>
            <input type="url" name="linkedin_url" value={form.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="input" />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Company URL</label>
            <input type="url" name="company_url" value={form.company_url} onChange={handleChange} placeholder="https://yourcompany.com" className="input" />
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary text-sm px-5 py-2">
          {saved ? "Saved" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function ReputationHistory({ userId }: { userId: string }) {
  const [expanded, setExpanded] = useState(false);

  // Ensure seed data is loaded
  seedReputationData(seedProfiles as MemberProfile[]);

  const events = getReputationEvents(userId);
  const recentEvents = expanded ? events.slice(-20).reverse() : events.slice(-5).reverse();

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="card p-5 mb-5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">
          How you earned this
        </h3>
        <svg
          className={`w-4 h-4 text-text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`mt-3 space-y-1.5 ${expanded ? "" : "max-h-40 overflow-hidden"}`}>
        {recentEvents.map((event) => (
          <div key={event.id} className="flex items-center justify-between text-[11px]">
            <span className="text-text-secondary">{getEventTypeLabel(event.event_type)}</span>
            <span className={`font-mono ${event.points >= 0 ? "text-success" : "text-danger"}`}>
              {event.points >= 0 ? "+" : ""}{event.points}
            </span>
          </div>
        ))}
      </div>

      {events.length > 5 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="text-[11px] text-primary hover:text-primary-hover transition-colors mt-2"
        >
          Show all ({events.length} events)
        </button>
      )}
    </div>
  );
}
