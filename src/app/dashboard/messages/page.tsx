"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { seedConversations, seedDirectMessages } from "@/data/seedConversations";
import { seedProfiles } from "@/data/seedProfiles";
import TierBadge from "@/components/ui/TierBadge";
import type { MemberProfile } from "@/types";
import { canDM } from "@/lib/tiers";

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

export default function MessagesPage() {
  const { currentUser } = useAppStore();
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileMap = useMemo(() => {
    const map = new Map<string, MemberProfile>();
    seedProfiles.forEach((p) => map.set(p.id, p as MemberProfile));
    return map;
  }, []);

  const userConversations = useMemo(() => {
    if (!currentUser) return [];
    return seedConversations
      .filter((c) => c.user_a === currentUser.id || c.user_b === currentUser.id)
      .map((c) => {
        const otherId = c.user_a === currentUser.id ? c.user_b : c.user_a;
        const otherUser = profileMap.get(otherId);
        const convMessages = seedDirectMessages
          .filter((dm) => dm.conversation_id === c.id)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const lastMessage = convMessages[0];
        const unreadCount = convMessages.filter((dm) => dm.sender_id !== currentUser.id && !dm.read).length;
        return { ...c, otherUser, lastMessage, unreadCount };
      })
      .sort((a, b) => {
        const aTime = a.lastMessage?.created_at ?? a.created_at;
        const bTime = b.lastMessage?.created_at ?? b.created_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
  }, [currentUser, profileMap]);

  const availableMembers = useMemo(() => {
    if (!currentUser) return [];
    return seedProfiles
      .filter((p) => p.id !== currentUser.id && canDM(currentUser.tier, p.tier as MemberProfile["tier"]) &&
        (searchQuery === "" || p.full_name.toLowerCase().includes(searchQuery.toLowerCase())))
      .slice(0, 20) as MemberProfile[];
  }, [currentUser, searchQuery]);

  if (!currentUser) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-text-primary">Messages</h1>
        <button onClick={() => setShowNewMessage(true)} className="btn-primary text-xs px-3 py-1.5">
          New Message
        </button>
      </div>

      <div className="space-y-1">
        {userConversations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-lg bg-surface-light border border-border flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <p className="text-sm text-text-muted mb-1">No conversations yet.</p>
            <p className="text-xs text-text-muted">Start from a member profile.</p>
          </div>
        ) : (
          userConversations.map((conv) => (
            <Link key={conv.id} href={`/dashboard/messages/${conv.id}`} className="flex items-center gap-3 card-hover p-3">
              {conv.otherUser?.photo_url ? (
                <img src={conv.otherUser.photo_url} alt={conv.otherUser.full_name} className="w-10 h-10 rounded-md object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-md bg-surface-lighter flex items-center justify-center text-sm font-medium text-text-muted shrink-0">
                  {conv.otherUser?.full_name?.charAt(0) ?? "?"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary truncate">{conv.otherUser?.full_name ?? "Unknown"}</span>
                  {conv.otherUser && <TierBadge tier={conv.otherUser.tier} size="sm" />}
                </div>
                {conv.lastMessage && (
                  <p className="text-xs text-text-muted truncate mt-0.5">
                    {conv.lastMessage.sender_id === currentUser.id ? "You: " : ""}{conv.lastMessage.content}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                {conv.lastMessage && <span className="text-[11px] text-text-muted block">{timeAgo(conv.lastMessage.created_at)}</span>}
                {conv.unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 bg-primary text-white text-[10px] font-medium rounded mt-0.5">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowNewMessage(false)} />
          <div className="relative w-full max-w-md card p-5 max-h-[80vh] flex flex-col animate-fade-in">
            <h2 className="text-lg font-semibold text-text-primary mb-3">New Message</h2>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search members..." className="input mb-3" />
            <div className="flex-1 overflow-y-auto space-y-0.5">
              {availableMembers.map((member) => (
                <Link key={member.id} href={`/dashboard/messages/new?to=${member.id}`} onClick={() => setShowNewMessage(false)}
                  className="flex items-center gap-3 p-2.5 rounded-md hover:bg-surface-light transition-colors">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.full_name} className="w-8 h-8 rounded-md object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-md bg-surface-lighter flex items-center justify-center text-xs font-medium text-text-muted">
                      {member.full_name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{member.full_name}</p>
                    <p className="text-[11px] text-text-muted truncate">{member.one_liner}</p>
                  </div>
                  <TierBadge tier={member.tier} size="sm" />
                </Link>
              ))}
              {availableMembers.length === 0 && (
                <p className="text-center text-text-muted text-sm py-4">{searchQuery ? "No members found." : "No members available."}</p>
              )}
            </div>
            <button onClick={() => setShowNewMessage(false)} className="btn-secondary w-full mt-3 py-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
