"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { seedRooms } from "@/data/seedRooms";
import { seedMessages } from "@/data/seedMessages";
import { seedProfiles } from "@/data/seedProfiles";
import { TIER_ORDER } from "@/lib/tiers";
import type { RoomMessage, MemberProfile } from "@/types";
import MessageBubble from "@/components/rooms/MessageBubble";
import TierBadge from "@/components/ui/TierBadge";
import { useRealtimeMessages } from "@/lib/hooks/useRealtimeMessages";

export default function RoomDetailPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const { currentUser, joinedRoomIds, joinRoom, leaveRoom } = useAppStore();

  const room = seedRooms.find((r) => r.id === roomId);

  const profileMap = useMemo(() => {
    const map = new Map<string, MemberProfile>();
    seedProfiles.forEach((p) => map.set(p.id, p as MemberProfile));
    return map;
  }, []);

  const initialMessages = useMemo(
    () =>
      seedMessages
        .filter((m) => m.room_id === roomId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
    [roomId]
  );

  const [messages, setMessages] = useState<RoomMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Supabase Realtime — live message updates when connected
  useRealtimeMessages(roomId, {
    onInsert: (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    },
    onUpdate: (msg) => {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? msg : m)));
    },
    onDelete: (old) => {
      setMessages((prev) => prev.filter((m) => m.id !== old.id));
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!room) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-sm text-text-muted mb-3">Room not found.</p>
          <Link href="/dashboard/rooms" className="text-sm text-primary hover:text-primary-hover">Back to Rooms</Link>
        </div>
      </div>
    );
  }

  const isLocked = currentUser && TIER_ORDER[room.min_tier] > TIER_ORDER[currentUser.tier];
  const isJoined = joinedRoomIds.includes(room.id);

  const messageMap = new Map<string, RoomMessage>();
  messages.forEach((m) => messageMap.set(m.id, m));

  const replyToMessage = replyToId ? messageMap.get(replyToId) : undefined;

  const handleSend = () => {
    if (!inputValue.trim() || !currentUser) return;
    const newMsg: RoomMessage = {
      id: `msg-local-${Date.now()}`,
      room_id: roomId,
      author_id: currentUser.id,
      content: inputValue.trim(),
      reply_to: replyToId,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    setReplyToId(null);
  };

  const handleEdit = (messageId: string, content: string) => {
    setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, content } : m));
  };

  const handleDelete = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLocked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-lg bg-surface-light border border-border flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-text-primary mb-1">{room.name}</h2>
          <p className="text-sm text-text-muted mb-4">
            Requires <TierBadge tier={room.min_tier} size="sm" /> tier or higher.
          </p>
          <Link href="/dashboard/rooms" className="text-sm text-primary hover:text-primary-hover">Back to Rooms</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen md:h-[calc(100vh)] overflow-hidden">
      {/* Room Header */}
      <div className="shrink-0 border-b border-border bg-surface px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard/rooms" className="text-text-muted hover:text-text-primary transition-colors md:hidden">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-text-primary truncate">{room.name}</h1>
              <p className="text-[11px] text-text-muted truncate">
                {room.member_count} members
                {messages.length > 0 && (
                  <> &middot; Last message {(() => {
                    const last = messages[messages.length - 1];
                    const now = new Date("2026-03-29T12:00:00Z");
                    const date = new Date(last.created_at);
                    const hours = Math.floor((now.getTime() - date.getTime()) / 3600000);
                    if (hours < 1) return "just now";
                    if (hours < 24) return `${hours}h ago`;
                    return `${Math.floor(hours / 24)}d ago`;
                  })()}</>
                )}
              </p>
            </div>
          </div>
          <div>
            {isJoined ? (
              <button onClick={() => leaveRoom(room.id)} className="text-xs text-text-muted hover:text-danger transition-colors px-3 py-1.5 rounded-md hover:bg-danger/5">
                Leave
              </button>
            ) : (
              <button onClick={() => joinRoom(room.id)} className="btn-primary text-xs px-3 py-1.5">Join</button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto py-4 space-y-0.5">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-text-muted">No messages yet. Be the first to post.</p>
            </div>
          )}
          {messages.map((msg) => {
            const author = profileMap.get(msg.author_id);
            const replyMsg = msg.reply_to ? messageMap.get(msg.reply_to) : undefined;
            const replyAuth = replyMsg ? profileMap.get(replyMsg.author_id) : undefined;
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                author={author}
                replyTo={replyMsg}
                replyAuthor={replyAuth}
                onReply={setReplyToId}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border bg-surface px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto">
          {replyToMessage && (
            <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-surface-light rounded-md border border-border">
              <span className="text-[11px] text-text-muted">
                Replying to <span className="text-text-secondary font-medium">{profileMap.get(replyToMessage.author_id)?.full_name ?? "Unknown"}</span>
              </span>
              <button onClick={() => setReplyToId(null)} className="ml-auto text-text-muted hover:text-text-primary">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isJoined ? "Type a message..." : "Join the room to post"}
              disabled={!isJoined}
              className="input flex-1 disabled:opacity-40"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || !isJoined}
              className="btn-primary px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
