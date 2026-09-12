'use client';

import React from 'react';
import { Zap } from 'lucide-react';

interface XPBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function XPBadge({ xp, size = 'md', showLabel = true }: XPBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 12,
    md: 15,
    lg: 18,
  };

  return (
    <div
      className={`inline-flex items-center rounded-full bg-[#351522] border border-[#22D3EE]/40 text-[#22D3EE] font-medium shadow-[0_0_12px_rgba(34,211,238,0.15)] transition-all hover:border-[#22D3EE] hover:shadow-[0_0_18px_rgba(34,211,238,0.25)] ${sizeClasses[size]}`}
      title={`${xp} Total Experience Points`}
    >
      <Zap size={iconSizes[size]} className="fill-[#22D3EE] text-[#22D3EE] animate-pulse" />
      <span>{xp.toLocaleString()}</span>
      {showLabel && <span className="text-[#67E8F9]/70 text-[0.8em] font-normal">XP</span>}
    </div>
  );
}
