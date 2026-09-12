'use client';

import React, { useEffect } from 'react';
import { PracticeQuestion } from '@/types';
import { Volume2 } from 'lucide-react';
import { playJapaneseAudio, soundFX } from '@/lib/audio';
import { AnswerFeedback } from './AnswerFeedback';

interface QuizCardProps {
  question: PracticeQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export function QuizCard({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onNextQuestion,
  isLastQuestion,
}: QuizCardProps) {
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.correctAnswer;

  const playPrompt = () => {
    // If Japanese glyph or phrase, pronounce it
    if (question.type === 'char-to-romaji' || question.type === 'kanji-to-reading') {
      playJapaneseAudio(question.prompt);
    } else if (question.characterRef) {
      playJapaneseAudio(question.characterRef);
    }
  };

  // Keyboard shortcut support (keys 1-4 or a-d)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNextQuestion();
        }
        return;
      }

      const key = e.key.toLowerCase();
      let index = -1;
      if (key === '1' || key === 'a') index = 0;
      if (key === '2' || key === 'b') index = 1;
      if (key === '3' || key === 'c') index = 2;
      if (key === '4' || key === 'd') index = 3;

      if (index >= 0 && index < question.options.length) {
        e.preventDefault();
        const chosen = question.options[index];
        onSelectAnswer(chosen);
        if (chosen === question.correctAnswer) {
          soundFX.playCorrect();
        } else {
          soundFX.playIncorrect();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, question, onSelectAnswer, onNextQuestion]);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    onSelectAnswer(option);
    if (option === question.correctAnswer) {
      soundFX.playCorrect();
    } else {
      soundFX.playIncorrect();
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-[#351522] border border-[#6E1835] shadow-[0_15px_40px_rgba(0,0,0,0.6)] p-6 sm:p-8">
      {/* Question Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#6E1835]/40 text-xs">
        <span className="font-semibold text-[#22D3EE] tracking-wide uppercase">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-[#240D16] border border-[#6E1835] text-[#B8A9AF] uppercase text-[10px] tracking-wider">
          {question.category}
        </span>
      </div>

      {/* Sub prompt */}
      <p className="text-xs sm:text-sm text-[#B8A9AF] text-center mt-5 mb-2 font-medium">
        {question.subPrompt || 'Choose the correct answer:'}
      </p>

      {/* Prompt Card / Display */}
      <div className="relative my-4 p-6 sm:p-8 rounded-2xl bg-[#240D16] border border-[#6E1835]/60 flex flex-col items-center justify-center min-h-[140px] group shadow-inner">
        <div className="font-japanese text-5xl sm:text-6xl text-[#F8FAFC] font-bold tracking-wide text-center">
          {question.prompt}
        </div>

        {/* Audio prompt button if Japanese text */}
        <button
          type="button"
          onClick={playPrompt}
          className="absolute top-3 right-3 p-2 rounded-xl text-[#8E7A83] hover:text-[#22D3EE] hover:bg-[#351522] transition-colors"
          title="Listen to pronunciation"
          aria-label="Listen to audio"
        >
          <Volume2 size={18} />
        </button>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {question.options.map((option, idx) => {
          let btnStyle =
            'bg-[#240D16] border-[#6E1835] text-[#F8FAFC] hover:border-[#22D3EE]/60 hover:bg-[#3A1422] hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]';
          let letterStyle = 'bg-[#351522] text-[#B8A9AF] border-[#6E1835]';

          if (isAnswered) {
            if (option === question.correctAnswer) {
              btnStyle =
                'bg-[#4ADE80]/15 border-[#4ADE80] text-[#4ADE80] shadow-[0_0_15px_rgba(74,222,128,0.25)] font-bold';
              letterStyle = 'bg-[#4ADE80] text-[#240D16] font-bold border-[#4ADE80]';
            } else if (option === selectedAnswer) {
              btnStyle =
                'bg-[#FB7185]/15 border-[#FB7185] text-[#FB7185] shadow-[0_0_15px_rgba(251,113,133,0.25)]';
              letterStyle = 'bg-[#FB7185] text-[#240D16] font-bold border-[#FB7185]';
            } else {
              btnStyle = 'bg-[#240D16]/50 border-[#6E1835]/30 text-[#8E7A83] opacity-60';
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleOptionClick(option)}
              className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border text-left text-sm sm:text-base font-medium transition-all ${btnStyle}`}
            >
              <span
                className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${letterStyle}`}
              >
                {optionLetters[idx]}
              </span>
              <span className="font-japanese text-base sm:text-lg flex-1 truncate">
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Answer Feedback state */}
      {isAnswered && (
        <AnswerFeedback
          isCorrect={isCorrect}
          correctAnswer={question.correctAnswer}
          explanation={question.explanation}
          onNext={onNextQuestion}
          isLastQuestion={isLastQuestion}
        />
      )}

      {/* Hint footer */}
      {!isAnswered && (
        <div className="text-center mt-5 text-[11px] text-[#8E7A83]">
          Keyboard shortcuts: Press <kbd className="px-1.5 py-0.5 rounded bg-[#240D16] border border-[#6E1835] text-[#B8A9AF]">1</kbd>-<kbd className="px-1.5 py-0.5 rounded bg-[#240D16] border border-[#6E1835] text-[#B8A9AF]">4</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-[#240D16] border border-[#6E1835] text-[#B8A9AF]">A</kbd>-<kbd className="px-1.5 py-0.5 rounded bg-[#240D16] border border-[#6E1835] text-[#B8A9AF]">D</kbd>
        </div>
      )}
    </div>
  );
}
