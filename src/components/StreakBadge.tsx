'use client';

import React from 'react';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 13,
    md: 16,
    lg: 20,
  };

  const hasStreak = streak > 0;

  return (
    <div
      className={`inline-flex items-center rounded-full bg-[#351522] border ${
        hasStreak ? 'border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]' : 'border-[#6E1835]/50 text-[#B8A9AF]'
      } font-medium transition-all ${sizeClasses[size]}`}
      title={`${streak} Day Learning Streak`}
    >
      <Flame
        size={iconSizes[size]}
        className={hasStreak ? 'fill-amber-400 text-amber-400 animate-bounce' : 'text-[#8E7A83]'}
      />
      <span>{streak}</span>
      <span className="text-[0.8em] opacity-80">{streak === 1 ? 'Day' : 'Days'}</span>
    </div>
  );
}
