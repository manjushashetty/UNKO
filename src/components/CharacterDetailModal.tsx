'use client';

import React from 'react';
import { CharacterItem } from '@/types';
import { useProgress } from '@/context/ProgressContext';
import { X, Volume2, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { playJapaneseAudio } from '@/lib/audio';
import Link from 'next/link';

interface CharacterDetailModalProps {
  item: CharacterItem | null;
  onClose: () => void;
}

export function CharacterDetailModal({ item, onClose }: CharacterDetailModalProps) {
  const { isLearned, toggleLearned } = useProgress();

  if (!item) return null;

  const learned = isLearned(item.id);

  const playChar = () => {
    playJapaneseAudio(item.character);
  };

  const playWord = (word: string) => {
    playJapaneseAudio(word);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#351522] border border-[#6E1835] shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-6 sm:p-7 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#B8A9AF] hover:text-[#F8FAFC] hover:bg-[#3A1422] transition-colors"
          aria-label="Close detail modal"
        >
          <X size={20} />
        </button>

        {/* Header Hero */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-[#6E1835]/50">
          <div className="relative group my-2">
            <div className="font-japanese text-7xl sm:text-8xl font-bold text-[#F8FAFC] tracking-wider drop-shadow-[0_0_20px_rgba(34,211,238,0.25)]">
              {item.character}
            </div>
            <button
              onClick={playChar}
              className="absolute -bottom-2 -right-2 p-2.5 rounded-full bg-[#6E1835] border border-[#22D3EE]/40 text-[#22D3EE] hover:scale-110 hover:border-[#22D3EE] hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all shadow-md"
              title="Pronounce Character"
              aria-label={`Pronounce ${item.character}`}
            >
              <Volume2 size={18} />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl font-bold text-[#22D3EE] uppercase tracking-wider">
              {item.romaji}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#6E1835]/70 text-[#F8FAFC] uppercase tracking-wide">
              {item.category} • {item.row.toUpperCase()} row
            </span>
          </div>
        </div>

        {/* Example Words Section */}
        <div className="py-5">
          <h4 className="text-xs font-semibold text-[#B8A9AF] uppercase tracking-wider mb-3">
            Example Vocabulary
          </h4>
          <div className="space-y-2.5">
            {item.examples.map((ex, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-[#240D16] border border-[#6E1835]/40 hover:border-[#22D3EE]/40 transition-all group"
              >
                <div className="flex items-baseline gap-2.5">
                  <span className="font-japanese text-lg font-medium text-[#F8FAFC]">
                    {ex.word}
                  </span>
                  {ex.reading && (
                    <span className="text-xs font-mono text-[#22D3EE]/90">
                      [{ex.reading}]
                    </span>
                  )}
                  <span className="text-xs text-[#B8A9AF]">— {ex.meaning}</span>
                </div>
                <button
                  type="button"
                  onClick={() => playWord(ex.word)}
                  className="p-1.5 rounded-lg text-[#8E7A83] group-hover:text-[#22D3EE] hover:bg-[#351522] transition-colors"
                  title="Listen to word"
                  aria-label={`Listen to ${ex.word}`}
                >
                  <Volume2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={() => toggleLearned(item.id, item.category)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
              learned
                ? 'bg-[#22D3EE]/20 border border-[#22D3EE] text-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                : 'bg-[#3A1422] border border-[#6E1835] text-[#B8A9AF] hover:text-[#F8FAFC] hover:border-[#22D3EE]/40'
            }`}
          >
            {learned ? (
              <>
                <CheckCircle2 size={16} className="text-[#22D3EE]" />
                <span>Marked as Learned</span>
              </>
            ) : (
              <>
                <Circle size={16} />
                <span>Mark as Learned</span>
              </>
            )}
          </button>

          <Link
            href={`/practice?category=${item.category}&char=${encodeURIComponent(item.character)}`}
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#6E1835] hover:bg-[#8D2246] border border-[#22D3EE]/40 text-[#F8FAFC] hover:text-[#22D3EE] text-sm font-semibold transition-all shadow-[0_0_15px_rgba(110,24,53,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            <span>Practice</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
