import {
  CharacterProgress,
  MistakeRecord,
  QuizResult,
  UserStats,
  Achievement,
  ScriptCategory,
  UserProfile,
} from '@/types';
import { db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { INITIAL_ACHIEVEMENTS } from '@/data/achievements';

const STORAGE_KEYS = {
  STATS: 'nihongo_stats_v1',
  PROGRESS: 'nihongo_char_progress_v1',
  MISTAKES: 'nihongo_mistakes_v1',
  QUIZ_RESULTS: 'nihongo_quizzes_v1',
  ACHIEVEMENTS: 'nihongo_achievements_v1',
  LEARNED_IDS: 'nihongo_learned_ids_v1',
};

const DEFAULT_STATS: UserStats = {
  xp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastPracticeDate: null,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  hiraganaLearnedCount: 0,
  katakanaLearnedCount: 0,
  kanjiLearnedCount: 0,
};

export class StorageManager {
  // Local storage helpers
  private static getLocal<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private static setLocal<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  }

  // --- USER PROFILE FIRESTORE SYNC ---
  static async saveUserProfile(user: UserProfile): Promise<void> {
    if (!user || user.isAnonymous || !db) return;
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          profile: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            avatar: user.avatar || null,
            joinedDate: user.joinedDate,
          },
          lastActive: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore user profile sync error:', err);
    }
  }

  // --- LOAD & SYNC FROM FIRESTORE ---
  static async syncFromFirestore(userId: string): Promise<{
    stats: UserStats | null;
    learnedIds: string[] | null;
    mistakes: Record<string, MistakeRecord> | null;
    characterProgress: Record<string, CharacterProgress> | null;
  }> {
    if (!userId || !db) {
      return { stats: null, learnedIds: null, mistakes: null, characterProgress: null };
    }

    try {
      // 1. Fetch user root document
      const userDocRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userDocRef);

      let remoteStats: UserStats | null = null;
      let remoteProgress: Record<string, CharacterProgress> | null = null;
      let remoteLearnedIds: string[] | null = null;

      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.stats) {
          remoteStats = data.stats as UserStats;
          // Merge with local: take higher values
          const localStats = this.getStats();
          const mergedStats: UserStats = {
            xp: Math.max(localStats.xp, remoteStats.xp),
            currentStreak: Math.max(localStats.currentStreak, remoteStats.currentStreak),
            longestStreak: Math.max(localStats.longestStreak, remoteStats.longestStreak),
            lastPracticeDate: remoteStats.lastPracticeDate || localStats.lastPracticeDate,
            totalQuestionsAnswered: Math.max(
              localStats.totalQuestionsAnswered,
              remoteStats.totalQuestionsAnswered
            ),
            totalCorrectAnswers: Math.max(
              localStats.totalCorrectAnswers,
              remoteStats.totalCorrectAnswers
            ),
            hiraganaLearnedCount: Math.max(
              localStats.hiraganaLearnedCount,
              remoteStats.hiraganaLearnedCount
            ),
            katakanaLearnedCount: Math.max(
              localStats.katakanaLearnedCount,
              remoteStats.katakanaLearnedCount
            ),
            kanjiLearnedCount: Math.max(
              localStats.kanjiLearnedCount,
              remoteStats.kanjiLearnedCount
            ),
          };
          this.setLocal(STORAGE_KEYS.STATS, mergedStats);
          remoteStats = mergedStats;
        }

        if (data.learnedIds && Array.isArray(data.learnedIds)) {
          const localLearned = this.getLearnedIds();
          const merged = Array.from(new Set([...localLearned, ...data.learnedIds]));
          this.setLocal(STORAGE_KEYS.LEARNED_IDS, merged);
          remoteLearnedIds = merged;
        }

        if (data.characterProgress) {
          remoteProgress = { ...this.getCharacterProgress(), ...data.characterProgress };
          this.setLocal(STORAGE_KEYS.PROGRESS, remoteProgress);
        }
      }

      // 2. Fetch mistakes subcollection
      const mistakesCollection = collection(db, 'users', userId, 'mistakes');
      const mistakesSnap = await getDocs(mistakesCollection);
      const remoteMistakes: Record<string, MistakeRecord> = { ...this.getMistakes() };

      mistakesSnap.forEach(docSnap => {
        const m = docSnap.data() as MistakeRecord;
        if (m && m.character) {
          remoteMistakes[m.character] = m;
        }
      });
      this.setLocal(STORAGE_KEYS.MISTAKES, remoteMistakes);

      return {
        stats: remoteStats,
        learnedIds: remoteLearnedIds,
        mistakes: remoteMistakes,
        characterProgress: remoteProgress,
      };
    } catch (err) {
      console.warn('Error fetching Firestore data:', err);
      return { stats: null, learnedIds: null, mistakes: null, characterProgress: null };
    }
  }

  // --- STATS ---
  static getStats(): UserStats {
    return this.getLocal<UserStats>(STORAGE_KEYS.STATS, DEFAULT_STATS);
  }

  static async saveStats(stats: UserStats, userId?: string | null): Promise<void> {
    this.setLocal(STORAGE_KEYS.STATS, stats);
    if (userId && userId !== 'guest-learner' && db) {
      try {
        await setDoc(doc(db, 'users', userId), { stats, lastUpdated: new Date().toISOString() }, { merge: true });
      } catch (err) {
        console.warn('Firestore sync failed for stats:', err);
      }
    }
  }

  // Streak logic
  static updateStreak(currentStats: UserStats): { currentStreak: number; longestStreak: number; streakEarnedXp: number } {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = currentStats.lastPracticeDate;

    let newStreak = currentStats.currentStreak;
    let streakBonusXp = 0;

    if (!lastDate) {
      newStreak = 1;
      streakBonusXp = 30; // Daily practice bonus
    } else if (lastDate === today) {
      // Already practiced today
      newStreak = Math.max(1, currentStats.currentStreak);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastDate === yesterdayStr) {
        newStreak = currentStats.currentStreak + 1;
        streakBonusXp = 30;
      } else {
        // Streak broken
        newStreak = 1;
        streakBonusXp = 30;
      }
    }

    const longestStreak = Math.max(newStreak, currentStats.longestStreak || 0);

    return {
      currentStreak: newStreak,
      longestStreak,
      streakEarnedXp: streakBonusXp,
    };
  }

  // --- CHARACTER PROGRESS ---
  static getCharacterProgress(): Record<string, CharacterProgress> {
    return this.getLocal<Record<string, CharacterProgress>>(STORAGE_KEYS.PROGRESS, {});
  }

  static async saveCharacterProgress(
    progress: Record<string, CharacterProgress>,
    userId?: string | null
  ): Promise<void> {
    this.setLocal(STORAGE_KEYS.PROGRESS, progress);
    if (userId && userId !== 'guest-learner' && db) {
      try {
        await setDoc(doc(db, 'users', userId), { characterProgress: progress }, { merge: true });
      } catch (err) {
        console.warn('Firestore sync failed for character progress:', err);
      }
    }
  }

  // --- LEARNED CHARACTERS ---
  static getLearnedIds(): string[] {
    return this.getLocal<string[]>(STORAGE_KEYS.LEARNED_IDS, []);
  }

  static toggleLearned(characterId: string, userId?: string | null): string[] {
    const ids = this.getLearnedIds();
    const index = ids.indexOf(characterId);
    let updated: string[];
    if (index >= 0) {
      updated = ids.filter(id => id !== characterId);
    } else {
      updated = [...ids, characterId];
    }
    this.setLocal(STORAGE_KEYS.LEARNED_IDS, updated);

    if (userId && userId !== 'guest-learner' && db) {
      setDoc(doc(db, 'users', userId), { learnedIds: updated }, { merge: true }).catch(err => {
        console.warn('Firestore learnedIds sync error:', err);
      });
    }

    return updated;
  }

  // --- MISTAKES ---
  static getMistakes(): Record<string, MistakeRecord> {
    return this.getLocal<Record<string, MistakeRecord>>(STORAGE_KEYS.MISTAKES, {});
  }

  static async saveMistake(
    character: string,
    romajiOrMeaning: string,
    category: ScriptCategory,
    userId?: string | null
  ): Promise<Record<string, MistakeRecord>> {
    const mistakes = this.getMistakes();
    const existing = mistakes[character];

    if (existing) {
      existing.mistakeCount += 1;
      existing.attempts += 1;
      existing.lastIncorrect = new Date().toISOString();
    } else {
      mistakes[character] = {
        character,
        romajiOrMeaning,
        category,
        mistakeCount: 1,
        attempts: 1,
        lastIncorrect: new Date().toISOString(),
        questionTypes: [],
      };
    }

    this.setLocal(STORAGE_KEYS.MISTAKES, mistakes);
    if (userId && userId !== 'guest-learner' && db) {
      try {
        await setDoc(doc(db, 'users', userId, 'mistakes', character), mistakes[character]);
      } catch (err) {
        console.warn('Firestore mistake sync failed:', err);
      }
    }
    return mistakes;
  }

  static clearMistake(character: string): Record<string, MistakeRecord> {
    const mistakes = this.getMistakes();
    delete mistakes[character];
    this.setLocal(STORAGE_KEYS.MISTAKES, mistakes);
    return mistakes;
  }

  // --- QUIZ RESULTS ---
  static getQuizResults(): QuizResult[] {
    return this.getLocal<QuizResult[]>(STORAGE_KEYS.QUIZ_RESULTS, []);
  }

  static async saveQuizResult(result: QuizResult, userId?: string | null): Promise<void> {
    const results = this.getQuizResults();
    results.unshift(result);
    // Keep last 50
    const trimmed = results.slice(0, 50);
    this.setLocal(STORAGE_KEYS.QUIZ_RESULTS, trimmed);

    if (userId && userId !== 'guest-learner' && db) {
      try {
        await setDoc(doc(db, 'users', userId, 'quizResults', result.id), result);
      } catch (err) {
        console.warn('Firestore quiz result sync failed:', err);
      }
    }
  }

  // --- ACHIEVEMENTS ---
  static getAchievements(): Achievement[] {
    const saved = this.getLocal<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, []);
    if (!saved || saved.length === 0) {
      return INITIAL_ACHIEVEMENTS;
    }
    return saved;
  }

  static evaluateAchievements(
    stats: UserStats,
    lastQuiz?: QuizResult
  ): { achievements: Achievement[]; newUnlocked: Achievement[] } {
    const current = this.getAchievements();
    const newUnlocked: Achievement[] = [];

    const updated = current.map(item => {
      if (item.unlockedAt) return item; // Already unlocked

      let currentVal = 0;
      switch (item.id) {
        case 'first-practice':
          currentVal = stats.totalQuestionsAnswered > 0 ? 1 : 0;
          break;
        case 'xp-100':
        case 'xp-500':
          currentVal = stats.xp;
          break;
        case 'streak-3':
        case 'streak-7':
          currentVal = stats.currentStreak;
          break;
        case 'hiragana-beginner':
        case 'hiragana-master':
          currentVal = stats.hiraganaLearnedCount;
          break;
        case 'katakana-beginner':
        case 'katakana-master':
          currentVal = stats.katakanaLearnedCount;
          break;
        case 'kanji-explorer':
        case 'kanji-n4-adventurer':
          currentVal = stats.kanjiLearnedCount;
          break;
        case 'perfect-quiz':
          if (lastQuiz && lastQuiz.totalQuestions >= 5 && lastQuiz.accuracy === 100) {
            currentVal = 1;
          }
          break;
        default:
          break;
      }

      const progress = Math.min(100, Math.round((currentVal / item.threshold) * 100));
      const unlocked = currentVal >= item.threshold;

      if (unlocked && !item.unlockedAt) {
        const itemUnlocked = {
          ...item,
          currentValue: currentVal,
          progress: 100,
          unlockedAt: new Date().toISOString(),
        };
        newUnlocked.push(itemUnlocked);
        return itemUnlocked;
      }

      return {
        ...item,
        currentValue: currentVal,
        progress,
      };
    });

    this.setLocal(STORAGE_KEYS.ACHIEVEMENTS, updated);
    return { achievements: updated, newUnlocked };
  }

  // --- SEED SAMPLE DATA FOR FIRST-TIME ENGAGING EXPERIENCE ---
  static seedInitialDataIfEmpty(): void {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!existing) {
      const initialStats: UserStats = {
        xp: 40,
        currentStreak: 2,
        longestStreak: 2,
        lastPracticeDate: new Date().toISOString().split('T')[0],
        totalQuestionsAnswered: 4,
        totalCorrectAnswers: 4,
        hiraganaLearnedCount: 5,
        katakanaLearnedCount: 2,
        kanjiLearnedCount: 1,
      };
      this.setLocal(STORAGE_KEYS.STATS, initialStats);

      // Seed a few initial learned IDs so dashboard has immediate colorful visual progress
      this.setLocal(STORAGE_KEYS.LEARNED_IDS, ['h-a', 'h-i', 'h-u', 'h-e', 'h-o', 'k-a', 'k-i', 'k-n5-15']);

      // Seed a sample mistake for "さ" and "シ" to show the "Recommended Review" feature
      const initialMistakes: Record<string, MistakeRecord> = {
        'さ': {
          character: 'さ',
          romajiOrMeaning: 'sa',
          category: 'hiragana',
          mistakeCount: 3,
          attempts: 5,
          lastIncorrect: new Date().toISOString(),
          questionTypes: ['char-to-romaji'],
        },
        'シ': {
          character: 'シ',
          romajiOrMeaning: 'shi',
          category: 'katakana',
          mistakeCount: 2,
          attempts: 4,
          lastIncorrect: new Date().toISOString(),
          questionTypes: ['char-to-romaji'],
        },
        'ツ': {
          character: 'ツ',
          romajiOrMeaning: 'tsu',
          category: 'katakana',
          mistakeCount: 2,
          attempts: 3,
          lastIncorrect: new Date().toISOString(),
          questionTypes: ['romaji-to-char'],
        },
      };
      this.setLocal(STORAGE_KEYS.MISTAKES, initialMistakes);
    }
  }
}
