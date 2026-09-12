'use client';

import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface AnswerFeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  onNext: () => void;
  isLastQuestion: boolean;
}

export function AnswerFeedback({
  isCorrect,
  correctAnswer,
  explanation,
  onNext,
  isLastQuestion,
}: AnswerFeedbackProps) {
  return (
    <div
      className={`w-full mt-5 p-4 rounded-2xl border transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${
        isCorrect
          ? 'bg-[#4ADE80]/10 border-[#4ADE80]/40 shadow-[0_0_20px_rgba(74,222,128,0.15)]'
          : 'bg-[#FB7185]/10 border-[#FB7185]/40 shadow-[0_0_20px_rgba(251,113,133,0.15)]'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            {isCorrect ? (
              <CheckCircle2 size={24} className="text-[#4ADE80]" />
            ) : (
              <XCircle size={24} className="text-[#FB7185]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-base font-bold ${
                  isCorrect ? 'text-[#4ADE80]' : 'text-[#FB7185]'
                }`}
              >
                {isCorrect ? '✓ Correct!' : '✕ Incorrect'}
              </span>
              {!isCorrect && (
                <span className="text-sm font-semibold text-[#F8FAFC]">
                  Correct answer: <span className="text-[#22D3EE] font-japanese font-bold">{correctAnswer}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#B8A9AF] mt-1">{explanation}</p>
          </div>
        </div>

        <button
          onClick={onNext}
          autoFocus
          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shrink-0 ${
            isCorrect
              ? 'bg-[#4ADE80] hover:bg-[#22c55e] text-[#240D16]'
              : 'bg-[#22D3EE] hover:bg-[#67E8F9] text-[#240D16]'
          }`}
        >
          <span>{isLastQuestion ? 'See Results' : 'Next Question'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
