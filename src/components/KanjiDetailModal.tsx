'use client';

import React from 'react';
import { KanjiItem } from '@/types';
import { useProgress } from '@/context/ProgressContext';
import { X, Volume2, CheckCircle2, Circle, ArrowRight, BookOpen } from 'lucide-react';
import { playJapaneseAudio } from '@/lib/audio';
import Link from 'next/link';

interface KanjiDetailModalProps {
  kanji: KanjiItem | null;
  onClose: () => void;
}

export function KanjiDetailModal({ kanji, onClose }: KanjiDetailModalProps) {
  const { isLearned, toggleLearned } = useProgress();

  if (!kanji) return null;

  const learned = isLearned(kanji.id);

  const playChar = () => {
    playJapaneseAudio(kanji.character);
  };

  const playPhrase = (text: string) => {
    playJapaneseAudio(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#351522] border border-[#6E1835] shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-6 sm:p-7">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#B8A9AF] hover:text-[#F8FAFC] hover:bg-[#3A1422] transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#6E1835]/50">
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#240D16] border border-[#6E1835] flex items-center justify-center text-[#F8FAFC] font-japanese text-6xl sm:text-7xl font-bold shadow-[0_0_20px_rgba(34,211,238,0.15)]">
              {kanji.character}
            </div>
            <button
              onClick={playChar}
              className="absolute -bottom-2 -right-2 p-2.5 rounded-full bg-[#6E1835] border border-[#22D3EE]/40 text-[#22D3EE] hover:scale-110 hover:border-[#22D3EE] hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all shadow-md"
              title="Pronounce Kanji"
              aria-label={`Pronounce ${kanji.character}`}
            >
              <Volume2 size={18} />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#6E1835] text-[#22D3EE]">
                JLPT {kanji.jlpt}
              </span>
              {kanji.strokes && (
                <span className="text-xs text-[#B8A9AF]">
                  {kanji.strokes} strokes
                </span>
              )}
            </div>

            <h3 className="text-2xl font-bold text-[#F8FAFC] capitalize mt-1">
              {kanji.meaning}
            </h3>

            {/* Readings list */}
            <div className="mt-3 space-y-1.5 text-xs">
              <div className="flex items-baseline gap-2">
                <span className="text-[#8E7A83] font-semibold uppercase tracking-wider text-[10px] w-12 shrink-0">
                  On&apos;yomi:
                </span>
                <span className="text-[#22D3EE] font-medium text-sm">
                  {kanji.onyomi.join(' ・ ') || '—'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[#8E7A83] font-semibold uppercase tracking-wider text-[10px] w-12 shrink-0">
                  Kun&apos;yomi:
                </span>
                <span className="text-[#67E8F9] font-medium text-sm font-japanese">
                  {kanji.kunyomi.join(' ・ ') || '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Examples Section */}
        <div className="py-5 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-[#B8A9AF] uppercase tracking-wider mb-2.5">
              Common Vocabulary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {kanji.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#240D16] border border-[#6E1835]/40 hover:border-[#22D3EE]/30 transition-all group"
                >
                  <div className="overflow-hidden">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-japanese font-medium text-[#F8FAFC]">
                        {ex.word}
                      </span>
                      <span className="text-xs text-[#22D3EE]/90 font-japanese">
                        ({ex.reading})
                      </span>
                    </div>
                    <div className="text-[11px] text-[#B8A9AF] truncate">
                      {ex.meaning}
                    </div>
                  </div>
                  <button
                    onClick={() => playPhrase(ex.word)}
                    className="p-1.5 rounded-lg text-[#8E7A83] group-hover:text-[#22D3EE] hover:bg-[#351522] transition-colors shrink-0"
                    title="Play audio"
                    aria-label={`Listen to ${ex.word}`}
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Context Sentence if present */}
          {kanji.exampleSentence && (
            <div>
              <h4 className="text-xs font-semibold text-[#B8A9AF] uppercase tracking-wider mb-2">
                Context Example Sentence
              </h4>
              <div className="p-3.5 rounded-xl bg-[#240D16] border border-[#6E1835]/50 relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-japanese text-[#F8FAFC] text-sm font-medium">
                      {kanji.exampleSentence.japanese}
                    </p>
                    <p className="text-xs text-[#22D3EE]/90 italic mt-0.5">
                      {kanji.exampleSentence.reading}
                    </p>
                    <p className="text-xs text-[#B8A9AF] mt-1">
                      {kanji.exampleSentence.english}
                    </p>
                  </div>
                  <button
                    onClick={() => playPhrase(kanji.exampleSentence!.japanese)}
                    className="p-2 rounded-lg bg-[#351522] text-[#22D3EE] hover:bg-[#6E1835] transition-colors shrink-0"
                    title="Play sentence audio"
                    aria-label="Listen to example sentence"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions footer */}
        <div className="pt-2 border-t border-[#6E1835]/40 flex items-center gap-3">
          <button
            onClick={() => toggleLearned(kanji.id, 'kanji')}
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
            href={`/practice?category=kanji&char=${encodeURIComponent(kanji.character)}`}
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#6E1835] hover:bg-[#8D2246] border border-[#22D3EE]/40 text-[#F8FAFC] hover:text-[#22D3EE] text-sm font-semibold transition-all shadow-[0_0_15px_rgba(110,24,53,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            <BookOpen size={16} />
            <span>Practice Kanji</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
