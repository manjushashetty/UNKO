export type ScriptCategory = 'hiragana' | 'katakana' | 'kanji';

export type CharacterGroup = 'basic' | 'dakuten' | 'handakuten' | 'combination';

export interface ExampleWord {
  word: string;
  reading?: string;
  meaning: string;
}

export interface CharacterItem {
  id: string;
  character: string;
  romaji: string;
  category: 'hiragana' | 'katakana';
  group: CharacterGroup;
  row: string; // e.g. 'a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n'
  column?: number; // 0: a, 1: i, 2: u, 3: e, 4: o
  examples: ExampleWord[];
  notes?: string;
}

export interface KanjiExample {
  word: string;
  reading: string;
  meaning: string;
}

export interface KanjiSentence {
  japanese: string;
  reading: string;
  english: string;
}

export interface KanjiItem {
  id: string;
  character: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  strokes?: number;
  category?: 'numbers' | 'time' | 'people' | 'nature' | 'directions' | 'common';
  examples: KanjiExample[];
  exampleSentence?: KanjiSentence;
}

export type QuestionType =
  | 'char-to-romaji'
  | 'romaji-to-char'
  | 'meaning-to-kanji'
  | 'kanji-to-reading'
  | 'fill-blank';

export interface PracticeQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  subPrompt?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  characterRef: string;
  category: ScriptCategory;
}

export interface CharacterProgress {
  characterId: string;
  character: string;
  category: ScriptCategory;
  attempts: number;
  correct: number;
  incorrect: number;
  mastery: number; // 0 - 100
  lastPracticed: string; // ISO string
  nextReviewDate?: string;
}

export interface MistakeRecord {
  character: string;
  romajiOrMeaning: string;
  category: ScriptCategory;
  mistakeCount: number;
  attempts: number;
  lastIncorrect: string;
  questionTypes: QuestionType[];
}

export interface QuizResult {
  id: string;
  category: ScriptCategory | 'mixed' | 'weak';
  subCategory?: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  xpEarned: number;
  durationSeconds: number;
  timestamp: string;
  mistakes: Array<{
    character: string;
    romajiOrMeaning: string;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number; // 0-100
  threshold: number;
  currentValue: number;
}

export interface UserStats {
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  hiraganaLearnedCount: number;
  katakanaLearnedCount: number;
  kanjiLearnedCount: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
  avatar?: string;
  joinedDate: string;
}
