'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Achievement,
  CharacterProgress,
  MistakeRecord,
  QuizResult,
  ScriptCategory,
  UserStats,
} from '@/types';
import { StorageManager } from '@/lib/storage';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface ProgressContextType {
  stats: UserStats;
  characterProgress: Record<string, CharacterProgress>;
  learnedIds: string[];
  mistakes: Record<string, MistakeRecord>;
  quizResults: QuizResult[];
  achievements: Achievement[];
  isLearned: (id: string) => boolean;
  toggleLearned: (id: string, category?: ScriptCategory) => void;
  recordQuizResult: (result: QuizResult) => void;
  recordMistake: (character: string, romajiOrMeaning: string, category: ScriptCategory) => void;
  clearMistake: (character: string) => void;
  resetAllData: () => void;
  recentlyUnlocked: Achievement | null;
  dismissAchievement: () => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPracticeDate: null,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    hiraganaLearnedCount: 0,
    katakanaLearnedCount: 0,
    kanjiLearnedCount: 0,
  });
  const [characterProgress, setCharacterProgress] = useState<Record<string, CharacterProgress>>({});
  const [learnedIds, setLearnedIds] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<Record<string, MistakeRecord>>({});
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<Achievement | null>(null);

  // Load storage data on mount
  useEffect(() => {
    StorageManager.seedInitialDataIfEmpty();

    const loadedStats = StorageManager.getStats();
    const loadedProgress = StorageManager.getCharacterProgress();
    const loadedLearned = StorageManager.getLearnedIds();
    const loadedMistakes = StorageManager.getMistakes();
    const loadedQuizzes = StorageManager.getQuizResults();
    const loadedAchievements = StorageManager.getAchievements();

    setStats(loadedStats);
    setCharacterProgress(loadedProgress);
    setLearnedIds(loadedLearned);
    setMistakes(loadedMistakes);
    setQuizResults(loadedQuizzes);
    setAchievements(loadedAchievements);
  }, []);

  // Sync with Firestore when an authenticated user signs in
  useEffect(() => {
    if (user && !user.isAnonymous) {
      StorageManager.syncFromFirestore(user.uid).then(remote => {
        if (remote.stats) setStats(remote.stats);
        if (remote.learnedIds) setLearnedIds(remote.learnedIds);
        if (remote.mistakes) setMistakes(remote.mistakes);
        if (remote.characterProgress) setCharacterProgress(remote.characterProgress);
      });
    }
  }, [user]);

  const isLearned = (id: string) => learnedIds.includes(id);

  const toggleLearned = (id: string, category?: ScriptCategory) => {
    const updated = StorageManager.toggleLearned(id, user?.uid);
    setLearnedIds(updated);

    // Update stats count
    const hiraganaCount = updated.filter(item => item.startsWith('h-')).length;
    const katakanaCount = updated.filter(item => item.startsWith('k-') && !item.startsWith('k-n5') && !item.startsWith('k-n4')).length;
    const kanjiCount = updated.filter(item => item.startsWith('k-n5') || item.startsWith('k-n4')).length;

    const newStats: UserStats = {
      ...stats,
      hiraganaLearnedCount: hiraganaCount,
      katakanaLearnedCount: katakanaCount,
      kanjiLearnedCount: kanjiCount,
    };

    setStats(newStats);
    StorageManager.saveStats(newStats, user?.uid);

    // Evaluate achievements
    const { achievements: newAchs, newUnlocked } = StorageManager.evaluateAchievements(newStats);
    setAchievements(newAchs);
    if (newUnlocked.length > 0) {
      setRecentlyUnlocked(newUnlocked[0]);
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22D3EE', '#67E8F9', '#6E1835', '#4ADE80'],
      });
    } catch {
      // Confetti fallback
    }
  };

  const recordMistake = async (
    character: string,
    romajiOrMeaning: string,
    category: ScriptCategory
  ) => {
    const updated = await StorageManager.saveMistake(
      character,
      romajiOrMeaning,
      category,
      user?.uid
    );
    setMistakes({ ...updated });
  };

  const clearMistake = (character: string) => {
    const updated = StorageManager.clearMistake(character);
    setMistakes({ ...updated });
  };

  const recordQuizResult = (result: QuizResult) => {
    // 1. Calculate streak & XP
    const { currentStreak, longestStreak, streakEarnedXp } = StorageManager.updateStreak(stats);
    const totalNewXp = stats.xp + result.xpEarned + streakEarnedXp;

    const newStats: UserStats = {
      ...stats,
      xp: totalNewXp,
      currentStreak,
      longestStreak,
      lastPracticeDate: new Date().toISOString().split('T')[0],
      totalQuestionsAnswered: stats.totalQuestionsAnswered + result.totalQuestions,
      totalCorrectAnswers: stats.totalCorrectAnswers + result.score,
    };

    setStats(newStats);
    StorageManager.saveStats(newStats, user?.uid);

    // 2. Save Quiz result
    StorageManager.saveQuizResult(result, user?.uid);
    setQuizResults(prev => [result, ...prev]);

    // 3. Save Mistakes
    result.mistakes.forEach(m => {
      recordMistake(m.character, m.romajiOrMeaning, result.category as ScriptCategory);
    });

    // 4. Evaluate Achievements
    const { achievements: evalAchs, newUnlocked } = StorageManager.evaluateAchievements(
      newStats,
      result
    );
    setAchievements(evalAchs);

    if (newUnlocked.length > 0) {
      setRecentlyUnlocked(newUnlocked[0]);
      triggerConfetti();
    } else if (result.accuracy >= 80) {
      triggerConfetti();
    }
  };

  const resetAllData = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.reload();
    }
  };

  const dismissAchievement = () => {
    setRecentlyUnlocked(null);
  };

  return (
    <ProgressContext.Provider
      value={{
        stats,
        characterProgress,
        learnedIds,
        mistakes,
        quizResults,
        achievements,
        isLearned,
        toggleLearned,
        recordQuizResult,
        recordMistake,
        clearMistake,
        resetAllData,
        recentlyUnlocked,
        dismissAchievement,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextType {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return ctx;
}
