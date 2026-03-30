"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import {
  seedConversations,
  seedDirectMessages,
} from "@/data/seedConversations";
import { seedProfiles } from "@/data/seedProfiles";
import TierBadge from "@/components/ui/TierBadge";
import type { DirectMessage, MemberProfile } from "@/types";

function timeAgo(dateStr: string): string {
  const now = new Date("2026-03-26T12:00:00Z");
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

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { currentUser } = useAppStore();

  const profileMap = useMemo(() => {
    const map = new Map<string, MemberProfile>();
    seedProfiles.forEach((p) => map.set(p.id, p as MemberProfile));
    return map;
  }, []);

  const conversation = seedConversations.find((c) => c.id === conversationId);

  const otherUser = useMemo(() => {
    if (!conversation || !currentUser) return undefined;
    const otherId = conversation.user_a === currentUser.id ? conversation.user_b : conversation.user_a;
    return profileMap.get(otherId);
  }, [conversation, currentUser, profileMap]);

  const initialMessages = useMemo(
    () =>
      seedDirectMessages
        .filter((dm) => dm.conversation_id === conversationId)
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        ),
    [conversationId]
  );

  const [messages, setMessages] = useState<DirectMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!conversation || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-text-secondary mb-4">Conversation not found.</p>
          <Link
            href="/dashboard/messages"
            className="text-violet-400 hover:text-violet-300 text-sm"
          >
            Back to Messages
          </Link>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: DirectMessage = {
      id: `dm-local-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: currentUser.id,
      content: inputValue.trim(),
      read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen md:h-[calc(100vh)] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-white/[0.06] bg-surface/80 backdrop-blur-xl px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <Link
            href="/dashboard/messages"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </Link>
          {otherUser?.photo_url ? (
            <img
              src={otherUser.photo_url}
              alt={otherUser.full_name}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-violet-600/30 flex items-center justify-center text-sm font-semibold text-violet-300">
              {otherUser?.full_name?.charAt(0) ?? "?"}
            </div>
          )}
          <div>
            <h1 className="text-sm font-semibold text-text-primary">
              {otherUser?.full_name ?? "Unknown User"}
            </h1>
            {otherUser && <TierBadge tier={otherUser.tier} size="sm" />}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto py-4 space-y-4">
          {messages.map((msg) => {
            const isMine = msg.sender_id === currentUser.id;
            const sender = profileMap.get(msg.sender_id);
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isMine ? "flex-row-reverse" : ""}`}
              >
                {!isMine &&
                  (sender?.photo_url ? (
                    <img
                      src={sender.photo_url}
                      alt={sender.full_name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-xs font-semibold text-violet-300 shrink-0">
                      {sender?.full_name?.charAt(0) ?? "?"}
                    </div>
                  ))}
                <div
                  className={`max-w-[75%] ${
                    isMine ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMine
                        ? "bg-violet-600/20 border border-violet-500/20 text-text-primary"
                        : "bg-white/5 border border-white/10 text-text-secondary"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-text-muted mt-1 block px-1">
                    {timeAgo(msg.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-white/[0.06] bg-surface/80 backdrop-blur-xl px-4 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="btn-primary px-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
