"use client";

import { useState } from "react";
import Link from "next/link";
import type { MemberProfile } from "@/types";
import TierBadge from "@/components/ui/TierBadge";

interface MemberCardProps {
  member: MemberProfile;
}

export default function MemberCard({ member }: MemberCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/dashboard/members/${member.id}`}
      className="card-hover p-4 block"
    >
      <div className="flex items-start gap-3">
        {member.photo_url && !imgError ? (
          <img
            src={member.photo_url}
            alt={member.full_name}
            className="w-10 h-10 rounded-md object-cover shrink-0"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-10 h-10 rounded-md bg-surface-lighter flex items-center justify-center text-sm font-medium text-text-muted shrink-0">
            {member.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-medium text-text-primary">
              {member.full_name}
            </h3>
            <TierBadge tier={member.tier} size="sm" />
          </div>
          {member.one_liner && (
            <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
              {member.one_liner}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[11px] text-text-muted font-mono">{member.reputation_score} rep</span>
            {member.location && (
              <span className="text-[11px] text-text-muted">{member.location}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
