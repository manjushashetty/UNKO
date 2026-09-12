'use client';

import React from 'react';
import Link from 'next/link';
import { ALL_KATAKANA } from '@/data/katakana';
import { CharacterGrid } from '@/components/CharacterGrid';
import { useProgress } from '@/context/ProgressContext';
import { Compass, CheckCircle2 } from 'lucide-react';

export default function KatakanaPage() {
  const { learnedIds } = useProgress();

  const learnedCount = learnedIds.filter(
    id => id.startsWith('k-') && !id.startsWith('k-n5')
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#6E1835]/50">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#67E8F9] uppercase tracking-wider mb-1">
            <span>Loanword & Modern Script</span>
            <span>•</span>
            <span className="font-japanese">カタカナ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC]">
            Katakana Library
          </h1>
          <p className="text-sm text-[#B8A9AF] mt-1 max-w-xl">
            Explore the 46 angular Katakana characters and their loanword examples like コーヒー (coffee) and テレビ (television).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#351522] border border-[#6E1835] text-xs font-semibold">
            <CheckCircle2 size={16} className="text-[#4ADE80]" />
            <span className="text-[#F8FAFC]">{learnedCount} / 46 Learned</span>
          </div>

          <Link
            href="/practice?category=katakana"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#67E8F9] hover:bg-[#22D3EE] text-[#240D16] font-bold text-xs shadow-[0_0_15px_rgba(103,232,249,0.3)] transition-all"
          >
            <Compass size={16} />
            <span>Practice Katakana</span>
          </Link>
        </div>
      </div>

      {/* Grid */}
      <CharacterGrid characters={ALL_KATAKANA} category="katakana" />
    </div>
  );
}
