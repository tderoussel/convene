"use client";

import { useState } from "react";
import type { Tier, RoomCategory } from "@/types";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (room: {
    name: string;
    description: string;
    category: RoomCategory;
    min_tier: Tier;
  }) => void;
}

const categories: { value: RoomCategory; label: string }[] = [
  { value: "general", label: "General" },
  { value: "industry", label: "Industry" },
  { value: "cofounder", label: "Cofounder" },
  { value: "investors", label: "Investors" },
  { value: "hiring", label: "Hiring" },
  { value: "advice", label: "Advice" },
  { value: "city", label: "City" },
];

const tiers: { value: Tier; label: string }[] = [
  { value: "explorer", label: "Explorer (open to all)" },
  { value: "builder", label: "Builder+" },
  { value: "catalyst", label: "Catalyst only" },
];

export default function CreateRoomModal({ isOpen, onClose, onCreateRoom }: CreateRoomModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RoomCategory>("general");
  const [minTier, setMinTier] = useState<Tier>("explorer");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    onCreateRoom({ name: name.trim(), description: description.trim(), category, min_tier: minTier });
    setName("");
    setDescription("");
    setCategory("general");
    setMinTier("explorer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md card p-6 animate-fade-in">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Create a Room</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-text-muted mb-1">Room Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value.slice(0, 50))} placeholder="e.g., Climate Tech Founders" maxLength={50} className="input" />
            <p className="text-[11px] text-text-muted mt-0.5 text-right">{name.length}/50</p>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value.slice(0, 200))} placeholder="What is this room about?" maxLength={200} rows={3} className="input resize-none" />
            <p className="text-[11px] text-text-muted mt-0.5 text-right">{description.length}/200</p>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as RoomCategory)} className="input appearance-none">
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Minimum Tier</label>
            <select value={minTier} onChange={(e) => setMinTier(e.target.value as Tier)} className="input appearance-none">
              {tiers.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2">Cancel</button>
            <button type="submit" disabled={!name.trim() || !description.trim()} className="btn-primary flex-1 py-2 disabled:opacity-40">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
