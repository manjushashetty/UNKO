'use client';

import React from 'react';
import { KanjiItem } from '@/types';
import { useProgress } from '@/context/ProgressContext';
import { Check, Volume2 } from 'lucide-react';
import { playJapaneseAudio } from '@/lib/audio';

interface KanjiCardProps {
  kanji: KanjiItem;
  onSelect: (kanji: KanjiItem) => void;
}

export function KanjiCard({ kanji, onSelect }: KanjiCardProps) {
  const { isLearned } = useProgress();
  const learned = isLearned(kanji.id);

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    playJapaneseAudio(kanji.character);
  };

  return (
    <div
      onClick={() => onSelect(kanji)}
      className={`group relative flex flex-col justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 select-none ${
        learned
          ? 'bg-[#351522] border border-[#22D3EE]/50 shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:border-[#22D3EE] hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]'
          : 'bg-[#351522]/70 border border-[#6E1835]/40 hover:border-[#6E1835] hover:bg-[#351522] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
      } hover:-translate-y-0.5`}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#6E1835] text-[#22D3EE] tracking-wide">
          {kanji.jlpt}
        </span>

        <div className="flex items-center gap-1.5">
          {learned && (
            <span
              className="w-5 h-5 rounded-full bg-[#22D3EE]/20 border border-[#22D3EE] flex items-center justify-center text-[#22D3EE]"
              title="Learned"
            >
              <Check size={11} strokeWidth={3} />
            </span>
          )}
          <button
            type="button"
            onClick={handleAudio}
            className="w-6 h-6 rounded-md text-[#8E7A83] hover:text-[#22D3EE] flex items-center justify-center transition-colors"
            title="Pronounce Kanji"
            aria-label={`Listen to ${kanji.character}`}
          >
            <Volume2 size={14} />
          </button>
        </div>
      </div>

      {/* Main Kanji Glyph */}
      <div className="my-2.5 text-center">
        <div className="font-japanese text-4xl sm:text-5xl text-[#F8FAFC] font-semibold tracking-wider group-hover:scale-110 transition-transform">
          {kanji.character}
        </div>
        <div className="text-xs font-medium text-[#F8FAFC] mt-1 line-clamp-1 capitalize">
          {kanji.meaning}
        </div>
      </div>

      {/* Readings */}
      <div className="border-t border-[#6E1835]/40 pt-2 text-[11px] space-y-1">
        {kanji.onyomi.length > 0 && (
          <div className="flex items-baseline gap-1 text-[#22D3EE] truncate">
            <span className="text-[#8E7A83] text-[9px] uppercase font-bold shrink-0">On:</span>
            <span className="truncate">{kanji.onyomi.join('・')}</span>
          </div>
        )}
        {kanji.kunyomi.length > 0 && (
          <div className="flex items-baseline gap-1 text-[#67E8F9] truncate">
            <span className="text-[#8E7A83] text-[9px] uppercase font-bold shrink-0">Kun:</span>
            <span className="truncate font-japanese">{kanji.kunyomi.join('・')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
