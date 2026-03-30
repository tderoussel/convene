"use client";

import type { Tier } from "@/types";

interface TierBadgeProps {
  tier: Tier;
  size?: "sm" | "md" | "lg";
}

const tierConfig: Record<Tier, { label: string; className: string }> = {
  explorer: {
    label: "Explorer",
    className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  },
  builder: {
    label: "Builder",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  catalyst: {
    label: "Catalyst",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
};

const sizeConfig: Record<string, string> = {
  sm: "text-[10px] px-1.5 py-px",
  md: "text-[11px] px-2 py-0.5",
  lg: "text-xs px-2.5 py-0.5",
};

export default function TierBadge({ tier, size = "md" }: TierBadgeProps) {
  const config = tierConfig[tier];
  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${config.className} ${sizeConfig[size]}`}
    >
      {config.label}
    </span>
  );
}
