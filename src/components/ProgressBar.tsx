'use client';

import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  showText?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ current, total, showText = false, height = 'md' }: ProgressBarProps) {
  const percentage = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between items-center text-xs font-semibold text-[#B8A9AF] mb-1.5">
          <span>Progress</span>
          <span className="text-[#22D3EE]">{percentage}%</span>
        </div>
      )}
      <div className={`w-full ${heightClasses[height]} rounded-full bg-[#240D16] border border-[#6E1835]/60 overflow-hidden shadow-inner`}>
        <div
          className="h-full bg-gradient-to-r from-[#22D3EE] to-[#67E8F9] rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
