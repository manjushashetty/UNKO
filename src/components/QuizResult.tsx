'use client';

import React from 'react';
import { QuizResult as QuizResultType } from '@/types';
import Link from 'next/link';
import { Trophy, RotateCcw, AlertCircle, Home, CheckCircle2, XCircle, Clock, Zap, Volume2 } from 'lucide-react';
import { playJapaneseAudio } from '@/lib/audio';

interface QuizResultProps {
  result: QuizResultType;
  onPracticeAgain: () => void;
  onReviewMistakes?: () => void;
}

export function QuizResult({ result, onPracticeAgain, onReviewMistakes }: QuizResultProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const hasMistakes = result.mistakes.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-[#351522] border border-[#6E1835] shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-6 sm:p-10 animate-in zoom-in-95 duration-300">
      {/* Header Banner */}
      <div className="text-center pb-6 border-b border-[#6E1835]/50">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6E1835] to-[#3A1422] border border-[#22D3EE]/50 text-[#22D3EE] mb-4 shadow-[0_0_25px_rgba(34,211,238,0.25)] animate-bounce">
          <Trophy size={32} />
        </div>
        <h2 className="text-3xl font-bold text-[#F8FAFC]">Practice Complete!</h2>
        <p className="text-sm text-[#B8A9AF] mt-1">
          Excellent effort. Every session strengthens your neural recall.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        {/* Score */}
        <div className="p-4 rounded-2xl bg-[#240D16] border border-[#6E1835]/60 text-center">
          <div className="text-xs text-[#8E7A83] uppercase font-semibold">Score</div>
          <div className="text-2xl font-bold text-[#F8FAFC] mt-1">
            {result.score} <span className="text-xs text-[#8E7A83]">/ {result.totalQuestions}</span>
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-2xl bg-[#240D16] border border-[#6E1835]/60 text-center">
          <div className="text-xs text-[#8E7A83] uppercase font-semibold">Accuracy</div>
          <div className="text-2xl font-bold text-[#22D3EE] mt-1">
            {result.accuracy}%
          </div>
        </div>

        {/* XP Earned */}
        <div className="p-4 rounded-2xl bg-[#240D16] border border-[#6E1835]/60 text-center">
          <div className="text-xs text-[#8E7A83] uppercase font-semibold flex items-center justify-center gap-1">
            <Zap size={12} className="text-[#22D3EE]" />
            <span>XP Earned</span>
          </div>
          <div className="text-2xl font-bold text-[#4ADE80] mt-1">
            +{result.xpEarned}
          </div>
        </div>

        {/* Time */}
        <div className="p-4 rounded-2xl bg-[#240D16] border border-[#6E1835]/60 text-center">
          <div className="text-xs text-[#8E7A83] uppercase font-semibold flex items-center justify-center gap-1">
            <Clock size={12} />
            <span>Duration</span>
          </div>
          <div className="text-2xl font-bold text-[#F8FAFC] mt-1">
            {formatTime(result.durationSeconds)}
          </div>
        </div>
      </div>

      {/* Correct / Incorrect Summary */}
      <div className="flex items-center justify-center gap-6 py-2 text-xs font-semibold">
        <span className="flex items-center gap-1.5 text-[#4ADE80]">
          <CheckCircle2 size={16} />
          {result.score} Correct
        </span>
        <span className="flex items-center gap-1.5 text-[#FB7185]">
          <XCircle size={16} />
          {result.totalQuestions - result.score} Incorrect
        </span>
      </div>

      {/* Characters to Review Section */}
      {hasMistakes && (
        <div className="mt-6 pt-6 border-t border-[#6E1835]/50">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-[#FB7185] uppercase tracking-wider">
            <AlertCircle size={14} />
            <span>Characters to Review ({result.mistakes.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {result.mistakes.map((m, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-[#240D16] border border-[#FB7185]/30 hover:border-[#FB7185]/60 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="font-japanese text-2xl font-bold text-[#F8FAFC]">
                    {m.character}
                  </span>
                  <div>
                    <div className="text-xs font-medium text-[#22D3EE]">
                      {m.romajiOrMeaning}
                    </div>
                    <div className="text-[11px] text-[#FB7185]">
                      You picked: {m.userAnswer}
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
                  <Volume2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 pt-6 border-t border-[#6E1835]/50">
        {hasMistakes && onReviewMistakes && (
          <button
            onClick={onReviewMistakes}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#6E1835] hover:bg-[#8D2246] border border-[#22D3EE]/50 text-[#22D3EE] font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
          >
            <AlertCircle size={16} />
            <span>Review Mistakes</span>
          </button>
        )}

        <button
          onClick={onPracticeAgain}
          className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#22D3EE] hover:bg-[#67E8F9] text-[#240D16] font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
        >
          <RotateCcw size={16} />
          <span>Practice Again</span>
        </button>

        <Link
          href="/dashboard"
          className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#240D16] hover:bg-[#3A1422] border border-[#6E1835] text-[#F8FAFC] font-semibold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Home size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
