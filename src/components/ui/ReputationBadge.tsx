"use client";

interface ReputationBadgeProps {
  score: number;
}

export default function ReputationBadge({ score }: ReputationBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-surface-light border border-border px-1.5 py-0.5 text-[11px] font-mono text-text-muted">
      {score} rep
    </span>
  );
}
