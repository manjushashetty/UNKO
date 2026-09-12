'use client';

import React from 'react';
import { CharacterItem } from '@/types';
import { useProgress } from '@/context/ProgressContext';
import { Volume2, Check } from 'lucide-react';
import { playJapaneseAudio } from '@/lib/audio';

interface CharacterCardProps {
  item: CharacterItem;
  onSelect: (item: CharacterItem) => void;
}

export function CharacterCard({ item, onSelect }: CharacterCardProps) {
  const { isLearned } = useProgress();
  const learned = isLearned(item.id);

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    playJapaneseAudio(item.character);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 select-none ${
        learned
          ? 'bg-[#351522] border border-[#22D3EE]/50 shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:border-[#22D3EE] hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]'
          : 'bg-[#351522]/70 border border-[#6E1835]/40 hover:border-[#6E1835] hover:bg-[#351522] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
      } hover:-translate-y-0.5`}
    >
      {/* Top row: Learned indicator + Audio button */}
      <div className="w-full flex items-center justify-between">
        {learned ? (
          <span
            className="w-5 h-5 rounded-full bg-[#22D3EE]/20 border border-[#22D3EE] flex items-center justify-center text-[#22D3EE]"
            title="Marked as Learned"
          >
            <Check size={11} strokeWidth={3} />
          </span>
        ) : (
          <span className="w-5 h-5" />
        )}

        <button
          type="button"
          onClick={handleAudio}
          className="w-7 h-7 rounded-lg text-[#8E7A83] hover:text-[#22D3EE] hover:bg-[#3A1422] flex items-center justify-center transition-colors opacity-70 group-hover:opacity-100"
          title="Play pronunciation"
          aria-label={`Listen to ${item.character}`}
        >
          <Volume2 size={15} />
        </button>
      </div>

      {/* Prominent Japanese Character */}
      <div className="my-1.5 font-japanese text-3xl sm:text-4xl text-[#F8FAFC] font-medium tracking-wide group-hover:scale-110 transition-transform">
        {item.character}
      </div>

      {/* Romaji */}
      <div className="text-xs sm:text-sm font-semibold tracking-wider text-[#22D3EE] uppercase">
        {item.romaji}
      </div>
    </div>
  );
}
