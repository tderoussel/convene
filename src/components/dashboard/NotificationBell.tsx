"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import type { Notification } from "@/types";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function notificationIcon(type: string) {
  switch (type) {
    case "mention":
    case "room_mention":
      return (
        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </div>
      );
    case "reply":
    case "room_reply":
      return (
        <div className="w-7 h-7 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
        </div>
      );
    case "new_connection":
    case "bookmark_received":
    case "room_invite":
      return (
        <div className="w-7 h-7 rounded-md bg-success/10 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      );
    case "tier_upgrade":
      return (
        <div className="w-7 h-7 rounded-md bg-warning/10 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
        </div>
      );
    case "new_message":
    case "dm_received":
      return (
        <div className="w-7 h-7 rounded-md bg-violet-500/10 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
      );
    case "welcome":
      return (
        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-7 h-7 rounded-md bg-surface-lighter flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </div>
      );
  }
}

// Seed notifications covering all event types
const seedNotifications: Notification[] = [
  {
    id: "n1",
    user_id: "u1",
    type: "reply",
    title: "New reply",
    body: "Raj Patel replied to your message in AI Founders",
    link: "/dashboard/rooms/r1",
    read: false,
    created_at: "2026-03-29T10:30:00Z",
  },
  {
    id: "n2",
    user_id: "u1",
    type: "tier_upgrade",
    title: "Tier upgrade",
    body: "You've been promoted to Builder tier!",
    link: "/dashboard/profile",
    read: false,
    created_at: "2026-03-29T08:00:00Z",
  },
  {
    id: "n3",
    user_id: "u1",
    type: "new_connection",
    title: "New connection",
    body: "You and Sophie Zhang are now connected!",
    link: "/dashboard/members/m2",
    read: false,
    created_at: "2026-03-28T20:00:00Z",
  },
  {
    id: "n4",
    user_id: "u1",
    type: "bookmark_received",
    title: "Bookmark received",
    body: "Elena Vasquez bookmarked your profile",
    link: "/dashboard/members/m4",
    read: true,
    created_at: "2026-03-28T16:00:00Z",
  },
  {
    id: "n5",
    user_id: "u1",
    type: "new_message",
    title: "New message",
    body: "Nina Kowalski sent you a message",
    link: "/dashboard/messages/conv-5",
    read: true,
    created_at: "2026-03-28T14:00:00Z",
  },
  {
    id: "n6",
    user_id: "u1",
    type: "room_invite",
    title: "Room invite",
    body: "You've been invited to join Catalyst Lounge",
    link: "/dashboard/rooms/r9",
    read: true,
    created_at: "2026-03-28T12:00:00Z",
  },
  {
    id: "n7",
    user_id: "u1",
    type: "welcome",
    title: "Welcome to Alyned",
    body: "Your application has been accepted. Start by exploring rooms and connecting with members.",
    link: "/dashboard",
    read: true,
    created_at: "2026-03-25T09:00:00Z",
  },
];

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(seedNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications: storeNotifications, unreadCount: storeUnread } = useAppStore();

  // Merge store notifications with seed notifications
  const allNotifications = [...storeNotifications, ...notifications];
  const localUnread = notifications.filter((n) => !n.read).length;
  const totalUnread = localUnread + storeUnread;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    useAppStore.getState().markAllNotificationsRead();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-light transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {totalUnread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-80 card shadow-lg z-50 animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
            {totalUnread > 0 && (
              <button onClick={markAllRead} className="text-[11px] text-primary hover:text-primary-hover transition-colors">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {allNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-text-muted">No notifications yet.</p>
              </div>
            ) : (
              allNotifications
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 30)
                .map((n) => (
                  <Link
                    key={n.id}
                    href={n.link ?? "#"}
                    onClick={() => {
                      markAsRead(n.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-surface-light ${
                      !n.read ? "bg-primary/[0.03]" : ""
                    }`}
                  >
                    {notificationIcon(n.type)}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${!n.read ? "text-text-primary font-medium" : "text-text-secondary"}`}>
                        {n.body}
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">{timeAgo(n.created_at)}</p>
                    </div>
                    {!n.read && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    )}
                  </Link>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
