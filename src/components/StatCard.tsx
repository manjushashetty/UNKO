'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  accentColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-[#22D3EE]',
  accentColor = 'border-[#6E1835]/50',
}: StatCardProps) {
  return (
    <div
      className={`p-5 rounded-2xl bg-[#351522] border ${accentColor} shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:border-[#22D3EE]/40 transition-all duration-200 group`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#8E7A83] uppercase tracking-wider">
            {title}
          </p>
          <div className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight group-hover:text-[#22D3EE] transition-colors">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-[#B8A9AF] font-medium pt-0.5">{subtitle}</p>
          )}
        </div>

        <div className={`p-3 rounded-xl bg-[#240D16] border border-[#6E1835] ${iconColor} group-hover:scale-110 transition-transform`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
