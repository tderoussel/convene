"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";

export default function SettingsPage() {
  const { currentUser, logout } = useAppStore();
  const [notifications, setNotifications] = useState({
    room_messages: true,
    direct_messages: true,
    elevations: true,
    weekly_digest: false,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-semibold text-text-primary mb-6">Settings</h1>

      {/* Notifications */}
      <section className="card p-5 mb-4">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Notifications</h2>
        <div className="space-y-3">
          {[
            { key: "room_messages" as const, label: "Room messages", desc: "New messages in joined rooms" },
            { key: "direct_messages" as const, label: "Direct messages", desc: "New direct messages" },
            { key: "elevations" as const, label: "Elevations", desc: "When someone elevates you" },
            { key: "weekly_digest" as const, label: "Weekly digest", desc: "Weekly community summary" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-1.5">
              <div>
                <p className="text-sm text-text-primary">{item.label}</p>
                <p className="text-[11px] text-text-muted">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  notifications[item.key] ? "bg-primary" : "bg-surface-lighter border border-border"
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                  notifications[item.key] ? "translate-x-[18px]" : "translate-x-[3px]"
                }`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Appearance */}
      <section className="card p-5 mb-4">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-primary">Theme</p>
            <p className="text-[11px] text-text-muted">Dark mode only</p>
          </div>
          <span className="text-xs text-text-muted bg-surface-light border border-border rounded px-2 py-1">Dark</span>
        </div>
      </section>

      {/* Account */}
      <section className="card p-5 mb-4">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Account</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-text-muted mb-1">Email</label>
            <input type="email" value={currentUser.email} readOnly className="input opacity-60 cursor-not-allowed" />
          </div>
        </div>
      </section>

      {/* Logout */}
      <section className="card p-5 mb-4">
        <button onClick={() => logout()} className="btn-secondary w-full py-2">Log out</button>
      </section>

      {/* Data Export */}
      <section className="card p-5 mb-4">
        <h2 className="text-sm font-semibold text-text-primary mb-2">Data export</h2>
        <p className="text-xs text-text-muted mb-3">Download a copy of your data as JSON.</p>
        <button
          onClick={() => {
            const data = JSON.stringify(currentUser, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'alyned-data.json';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="btn-secondary text-xs px-4 py-1.5"
        >
          Download my data
        </button>
      </section>

      {/* Danger Zone */}
      <section className="rounded-lg border border-danger/20 bg-danger/5 p-5">
        <h2 className="text-sm font-semibold text-danger mb-1">Danger zone</h2>
        <p className="text-xs text-text-muted mb-3">Permanently delete your account. This cannot be undone.</p>
        {showDeleteConfirm ? (
          <div className="flex gap-2">
            <button onClick={() => { logout(); setShowDeleteConfirm(false); }} className="px-3 py-1.5 rounded-md bg-danger text-white text-xs font-medium hover:bg-danger/90 transition-colors">
              Confirm delete
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setShowDeleteConfirm(true)} className="px-3 py-1.5 rounded-md border border-danger/30 text-xs text-danger hover:bg-danger/10 transition-colors">
            Delete account
          </button>
        )}
      </section>
    </div>
  );
}
