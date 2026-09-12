'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PracticeQuestion, QuizResult as QuizResultType, ScriptCategory } from '@/types';
import { generatePracticeQuiz } from '@/lib/quizGenerator';
import { useProgress } from '@/context/ProgressContext';
import { QuizCard } from './QuizCard';
import { QuizResult } from './QuizResult';
import { ProgressBar } from './ProgressBar';
import { soundFX } from '@/lib/audio';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PracticeEngineProps {
  initialCategory?: ScriptCategory | 'mixed' | 'weak' | 'kanji-n4' | 'kanji-n5';
  targetLevel?: string;
  targetCharacter?: string;
  onExit?: () => void;
}

export function PracticeEngine({
  initialCategory = 'hiragana',
  targetLevel,
  targetCharacter,
  onExit,
}: PracticeEngineProps) {
  const { recordQuizResult } = useProgress();

  const [category, setCategory] = useState<ScriptCategory | 'mixed' | 'weak' | 'kanji-n4' | 'kanji-n5'>(initialCategory);
  const [level, setLevel] = useState<string | undefined>(targetLevel);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [sessionMistakes, setSessionMistakes] = useState<
    Array<{
      character: string;
      romajiOrMeaning: string;
      userAnswer: string;
      correctAnswer: string;
    }>
  >([]);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState<QuizResultType | null>(null);
  const [durationSeconds, setDurationSeconds] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startNewSession = useCallback((
    cat: ScriptCategory | 'mixed' | 'weak' | 'kanji-n4' | 'kanji-n5',
    filterChar?: string,
    lvl?: string
  ) => {
    const generated = generatePracticeQuiz(cat, 10, filterChar, lvl);
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setSessionMistakes([]);
    setScore(0);
    setIsCompleted(false);
    setFinalResult(null);
    setDurationSeconds(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDurationSeconds(prev => prev + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    startNewSession(initialCategory, targetCharacter, targetLevel);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initialCategory, targetCharacter, targetLevel, startNewSession]);

  const handleSelectAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);

    const currentQ = questions[currentIndex];
    const isCorrect = answer === currentQ.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setSessionMistakes(prev => [
        ...prev,
        {
          character: currentQ.characterRef,
          romajiOrMeaning: currentQ.correctAnswer,
          userAnswer: answer,
          correctAnswer: currentQ.correctAnswer,
        },
      ]);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz complete
      if (timerRef.current) clearInterval(timerRef.current);

      const finalScore = score + (selectedAnswer === questions[currentIndex].correctAnswer ? 0 : 0);
      const accuracy = Math.round((score / questions.length) * 100);

      // XP calculation: +10 XP per correct answer, +20 XP quiz completion
      const xpEarned = score * 10 + 20;

      const resolvedCategory: ScriptCategory | 'mixed' | 'weak' =
        category === 'kanji-n4' || category === 'kanji-n5' ? 'kanji' : category;
      const subCategory = level || (category === 'kanji-n4' ? 'N4' : category === 'kanji-n5' ? 'N5' : undefined);

      const result: QuizResultType = {
        id: `quiz-${Date.now()}`,
        category: resolvedCategory,
        subCategory,
        score,
        totalQuestions: questions.length,
        accuracy,
        xpEarned,
        durationSeconds,
        timestamp: new Date().toISOString(),
        mistakes: sessionMistakes,
      };

      setFinalResult(result);
      setIsCompleted(true);
      recordQuizResult(result);

      if (accuracy >= 70) {
        soundFX.playCelebration();
      }
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#6E1835] text-[#22D3EE] flex items-center justify-center animate-spin mb-4">
          <Sparkles size={24} />
        </div>
        <p className="text-[#B8A9AF] text-sm">Preparing your customized Japanese exercise...</p>
      </div>
    );
  }

  if (isCompleted && finalResult) {
    return (
      <QuizResult
        result={finalResult}
        onPracticeAgain={() => startNewSession(category, targetCharacter, level)}
        onReviewMistakes={() => {
          setCategory('weak');
          startNewSession('weak');
        }}
      />
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Top Header: Category Switcher / Exit Button + Progress */}
      <div className="flex items-center justify-between gap-4">
        {onExit ? (
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#B8A9AF] hover:text-[#22D3EE] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Exit Practice</span>
          </button>
        ) : (
          <Link
            href="/practice"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#B8A9AF] hover:text-[#22D3EE] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Practice Hub</span>
          </Link>
        )}

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-[#B8A9AF]">Current Score:</span>
          <span className="text-[#22D3EE] font-bold text-sm">{score}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar current={currentIndex + 1} total={questions.length} />

      {/* Active Question Card */}
      <QuizCard
        question={currentQ}
        questionIndex={currentIndex}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        onSelectAnswer={handleSelectAnswer}
        onNextQuestion={handleNextQuestion}
        isLastQuestion={currentIndex + 1 === questions.length}
      />
    </div>
  );
}
