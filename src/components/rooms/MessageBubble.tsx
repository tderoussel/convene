"use client";

import { useState } from "react";
import Link from "next/link";
import type { RoomMessage, MemberProfile } from "@/types";
import TierBadge from "@/components/ui/TierBadge";
import { useAppStore } from "@/lib/store";

interface MessageBubbleProps {
  message: RoomMessage;
  author: MemberProfile | undefined;
  replyTo?: RoomMessage;
  replyAuthor?: MemberProfile;
  onReply: (messageId: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
}

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

export default function MessageBubble({
  message,
  author,
  replyTo,
  replyAuthor,
  onReply,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const [imgError, setImgError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const { currentUser } = useAppStore();
  const isOwn = currentUser?.id === message.author_id;

  const handleSaveEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(message.id, editContent.trim());
    }
    setEditing(false);
  };

  return (
    <div className="group flex gap-3 py-2.5 px-2 hover:bg-surface-light/50 rounded-md transition-colors">
      {/* Avatar */}
      <Link
        href={`/dashboard/members/${author?.id ?? message.author_id}`}
        className="shrink-0"
      >
        {author?.photo_url && !imgError ? (
          <img
            src={author.photo_url}
            alt={author.full_name}
            className="w-7 h-7 rounded-md object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-7 h-7 rounded-md bg-surface-lighter flex items-center justify-center text-[10px] font-medium text-text-muted">
            {author?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? "?"}
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        {/* Reply quote */}
        {replyTo && (
          <div className="mb-1 pl-2.5 border-l-2 border-border">
            <p className="text-[11px] text-text-muted">
              <span className="font-medium text-text-secondary">{replyAuthor?.full_name ?? "Unknown"}</span>
            </p>
            <p className="text-[11px] text-text-muted line-clamp-1">{replyTo.content}</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/dashboard/members/${author?.id ?? message.author_id}`}
            className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
          >
            {author?.full_name ?? "Unknown"}
          </Link>
          {author && <TierBadge tier={author.tier} size="sm" />}
          <span className="text-[11px] text-text-muted">{timeAgo(message.created_at)}</span>
        </div>

        {/* Content */}
        {editing ? (
          <div className="mt-1.5 space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="input text-sm resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <button onClick={handleSaveEdit} className="btn-primary text-xs px-3 py-1">Save</button>
              <button onClick={() => { setEditing(false); setEditContent(message.content); }} className="btn-secondary text-xs px-3 py-1">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-secondary mt-0.5 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        )}

        {/* Actions */}
        {!editing && (
          <div className="opacity-0 group-hover:opacity-100 mt-1 flex items-center gap-3 transition-opacity">
            <button
              onClick={() => onReply(message.id)}
              className="text-[11px] text-text-muted hover:text-primary transition-colors flex items-center gap-1"
            >
              Reply
            </button>
            {isOwn && onEdit && (
              <button
                onClick={() => setEditing(true)}
                className="text-[11px] text-text-muted hover:text-text-primary transition-colors"
              >
                Edit
              </button>
            )}
            {isOwn && onDelete && (
              <button
                onClick={() => onDelete(message.id)}
                className="text-[11px] text-text-muted hover:text-danger transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
