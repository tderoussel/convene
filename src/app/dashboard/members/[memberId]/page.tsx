"use client";

import { useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { seedProfiles } from "@/data/seedProfiles";
import { seedConversations } from "@/data/seedConversations";
import TierBadge from "@/components/ui/TierBadge";
import { canDM, canElevate, getTierLabel } from "@/lib/tiers";
import type { MemberProfile } from "@/types";

export default function MemberProfilePage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.memberId as string;
  const { currentUser } = useAppStore();
  const [elevated, setElevated] = useState(false);

  const member = useMemo(
    () => (seedProfiles as MemberProfile[]).find((p) => p.id === memberId) ?? null,
    [memberId]
  );

  const handleSendMessage = useCallback(() => {
    if (!currentUser || !member) return;
    // Check if a conversation already exists between these two users
    const existingConv = seedConversations.find((c) => {
      const ids = [c.user_a, c.user_b];
      return ids.includes(currentUser.id) && ids.includes(member.id);
    });
    if (existingConv) {
      router.push(`/dashboard/messages/${existingConv.id}`);
    } else {
      // Create a new conversation ID and navigate to it
      // In demo mode, we store it via URL params; the conversation page handles creation
      router.push(`/dashboard/messages/new?to=${member.id}`);
    }
  }, [currentUser, member, router]);

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-sm text-text-muted mb-3">Member not found.</p>
          <Link href="/dashboard/members" className="text-sm text-primary">Back to Members</Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === member.id;
  const canSendDM = currentUser && !isOwnProfile && canDM(currentUser.tier, member.tier);
  const canElevateUser = currentUser && !isOwnProfile && canElevate(currentUser.tier, member.tier);
  const lookingForTags = member.what_looking_for ? member.what_looking_for.split(",").map((s) => s.trim()) : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/dashboard/members" className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors mb-5">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </Link>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {member.photo_url ? (
            <img src={member.photo_url} alt={member.full_name} className="w-20 h-20 rounded-lg object-cover shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-surface-lighter flex items-center justify-center text-2xl font-medium text-text-muted shrink-0">
              {member.full_name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold text-text-primary">{member.full_name}</h1>
              <TierBadge tier={member.tier} size="md" />
            </div>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="text-xs text-text-muted font-mono">{member.reputation_score} rep</span>
              {member.location && (
                <span className="text-xs text-text-muted">{member.location}</span>
              )}
            </div>
            {member.one_liner && (
              <p className="text-sm text-text-secondary mt-3 leading-relaxed">{member.one_liner}</p>
            )}

            <div className="flex gap-2 mt-4 flex-wrap">
              {isOwnProfile ? (
                <Link href="/dashboard/profile" className="btn-primary text-xs px-4 py-1.5">Edit Profile</Link>
              ) : (
                <>
                  {canSendDM ? (
                    <button onClick={handleSendMessage} className="btn-primary text-xs px-4 py-1.5">Send Message</button>
                  ) : (
                    <div className="text-[11px] text-text-muted bg-surface-light border border-border rounded-md px-3 py-1.5">
                      Cannot DM this member
                    </div>
                  )}
                  {canElevateUser && !elevated && (
                    <button onClick={() => setElevated(true)} className="px-3 py-1.5 rounded-md border border-amber-500/30 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors">
                      Elevate
                    </button>
                  )}
                  {elevated && (
                    <span className="px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">Elevated</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-border space-y-5">
          {lookingForTags.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Looking for</h3>
              <div className="flex gap-1.5 flex-wrap">
                {lookingForTags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[11px] bg-primary/10 text-primary border border-primary/20">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {member.offer_statement && (
            <div>
              <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">What I offer</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{member.offer_statement}</p>
            </div>
          )}

          <div className="flex gap-4 flex-wrap">
            {member.linkedin_url && (
              <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover transition-colors">
                LinkedIn
              </a>
            )}
            {member.company_url && (
              <a href={member.company_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover transition-colors">
                Company
              </a>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3 pt-4 border-t border-border">
            {[
              { value: member.total_room_posts, label: "Posts" },
              { value: member.reputation_score, label: "Reputation" },
              { value: getTierLabel(member.tier), label: "Tier" },
              { value: new Date(member.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }), label: "Joined" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-sm font-semibold text-text-primary">{stat.value}</p>
                <p className="text-[11px] text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
