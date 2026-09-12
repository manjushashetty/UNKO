'use client';

import React from 'react';
import { MistakeRecord } from '@/types';
import { Volume2, AlertTriangle, ArrowRight } from 'lucide-react';
import { playJapaneseAudio } from '@/lib/audio';
import Link from 'next/link';

interface MistakeCardProps {
  mistakes: MistakeRecord[];
  limit?: number;
}

export function MistakeCard({ mistakes, limit = 6 }: MistakeCardProps) {
  const sorted = [...mistakes].sort((a, b) => b.mistakeCount - a.mistakeCount);
  const displayItems = sorted.slice(0, limit);

  if (displayItems.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-[#351522] border border-[#6E1835]/50 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#4ADE80]/15 text-[#4ADE80] flex items-center justify-center mx-auto mb-3">
          ✓
        </div>
        <h4 className="text-base font-bold text-[#F8FAFC]">No Frequent Mistakes!</h4>
        <p className="text-xs text-[#B8A9AF] mt-1">
          Your accuracy is clean. Complete practice sessions to identify any tricky characters.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-[#351522] border border-[#6E1835] shadow-[0_4px_25px_rgba(0,0,0,0.3)] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#FB7185]/15 text-[#FB7185]">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Recommended Review</h3>
            <p className="text-xs text-[#8E7A83]">Characters you frequently miss during practice</p>
          </div>
        </div>

        <Link
          href="/practice?category=weak"
          className="px-3 py-1.5 rounded-xl bg-[#6E1835] hover:bg-[#8D2246] border border-[#22D3EE]/40 text-[#22D3EE] text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,211,238,0.2)] transition-all shrink-0"
        >
          <span>Practice Weak</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {displayItems.map((m, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-xl bg-[#240D16] border border-[#6E1835]/60 hover:border-[#FB7185]/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="font-japanese text-2xl font-bold text-[#F8FAFC] group-hover:scale-110 transition-transform">
                {m.character}
              </span>
              <div>
                <div className="text-xs font-medium text-[#22D3EE]">
                  {m.romajiOrMeaning}
                </div>
                <div className="text-[10px] text-[#FB7185] font-semibold">
                  {m.mistakeCount} {m.mistakeCount === 1 ? 'mistake' : 'mistakes'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => playJapaneseAudio(m.character)}
              className="p-1.5 rounded-lg text-[#8E7A83] hover:text-[#22D3EE] hover:bg-[#351522] transition-colors"
              title="Listen"
              aria-label={`Listen to ${m.character}`}
            >
              <Volume2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
