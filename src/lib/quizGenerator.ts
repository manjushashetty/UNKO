import { PracticeQuestion, ScriptCategory, QuestionType, CharacterItem, KanjiItem } from '@/types';
import { ALL_HIRAGANA, HIRAGANA_BASIC } from '@/data/hiragana';
import { ALL_KATAKANA, KATAKANA_BASIC } from '@/data/katakana';
import { KANJI_N5 } from '@/data/kanji-n5';
import { KANJI_N4 } from '@/data/kanji-n4';
import { StorageManager } from './storage';

export const ALL_KANJI: KanjiItem[] = [...KANJI_N5, ...KANJI_N4];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generatePracticeQuiz(
  category: ScriptCategory | 'mixed' | 'weak' | 'kanji-n4' | 'kanji-n5',
  questionCount: number = 10,
  filterChar?: string,
  level?: string
): PracticeQuestion[] {
  const questions: PracticeQuestion[] = [];

  // Weak characters practice mode
  if (category === 'weak') {
    const mistakes = StorageManager.getMistakes();
    const weakList = Object.values(mistakes).sort((a, b) => b.mistakeCount - a.mistakeCount);

    if (weakList.length === 0) {
      // Fallback to Hiragana basic if no mistakes yet
      return generatePracticeQuiz('hiragana', questionCount);
    }

    const targetWeak = weakList.slice(0, Math.min(questionCount, weakList.length));
    targetWeak.forEach((item, index) => {
      // Find matching item in datasets
      const hMatch = ALL_HIRAGANA.find(c => c.character === item.character);
      const kMatch = ALL_KATAKANA.find(c => c.character === item.character);
      const kanjiMatch = ALL_KANJI.find(k => k.character === item.character);

      if (hMatch) {
        questions.push(buildCharToRomajiQuestion(hMatch, ALL_HIRAGANA, `q-weak-${index}`));
      } else if (kMatch) {
        questions.push(buildCharToRomajiQuestion(kMatch, ALL_KATAKANA, `q-weak-${index}`));
      } else if (kanjiMatch) {
        questions.push(buildMeaningToKanjiQuestion(kanjiMatch, ALL_KANJI, `q-weak-${index}`));
      }
    });

    // If still less than count, fill with mixed
    while (questions.length < questionCount) {
      const extra = generatePracticeQuiz('hiragana', 1)[0];
      questions.push({ ...extra, id: `q-weak-extra-${questions.length}` });
    }

    return shuffle(questions).slice(0, questionCount);
  }

  // Single Character Focused Practice (when clicked "Practice" from character modal)
  if (filterChar) {
    const h = ALL_HIRAGANA.find(c => c.character === filterChar);
    const k = ALL_KATAKANA.find(c => c.character === filterChar);
    const kanji = ALL_KANJI.find(c => c.character === filterChar);

    if (h) {
      questions.push(buildCharToRomajiQuestion(h, ALL_HIRAGANA, 'q-f1'));
      questions.push(buildRomajiToCharQuestion(h, ALL_HIRAGANA, 'q-f2'));
      // Add a few neighbors
      const others = shuffle(HIRAGANA_BASIC.filter(c => c.character !== filterChar)).slice(0, 3);
      others.forEach((ot, i) => {
        questions.push(buildCharToRomajiQuestion(ot, ALL_HIRAGANA, `q-f3-${i}`));
      });
      return questions;
    } else if (k) {
      questions.push(buildCharToRomajiQuestion(k, ALL_KATAKANA, 'q-f1'));
      questions.push(buildRomajiToCharQuestion(k, ALL_KATAKANA, 'q-f2'));
      const others = shuffle(KATAKANA_BASIC.filter(c => c.character !== filterChar)).slice(0, 3);
      others.forEach((ot, i) => {
        questions.push(buildCharToRomajiQuestion(ot, ALL_KATAKANA, `q-f3-${i}`));
      });
      return questions;
    } else if (kanji) {
      const kanjiPool = kanji.jlpt === 'N4' ? KANJI_N4 : KANJI_N5;
      questions.push(buildMeaningToKanjiQuestion(kanji, kanjiPool, 'q-f1'));
      questions.push(buildKanjiToReadingQuestion(kanji, kanjiPool, 'q-f2'));
      const others = shuffle(kanjiPool.filter(c => c.character !== filterChar)).slice(0, 3);
      others.forEach((ot, i) => {
        questions.push(buildMeaningToKanjiQuestion(ot, kanjiPool, `q-f3-${i}`));
      });
      return questions;
    }
  }

  // Standard category generation
  if (category === 'hiragana') {
    const pool = shuffle([...HIRAGANA_BASIC]);
    for (let i = 0; i < Math.min(questionCount, pool.length); i++) {
      const item = pool[i];
      // Alternate between char->romaji and romaji->char
      if (i % 2 === 0) {
        questions.push(buildCharToRomajiQuestion(item, ALL_HIRAGANA, `q-h-${i}`));
      } else {
        questions.push(buildRomajiToCharQuestion(item, ALL_HIRAGANA, `q-h-${i}`));
      }
    }
  } else if (category === 'katakana') {
    const pool = shuffle([...KATAKANA_BASIC]);
    for (let i = 0; i < Math.min(questionCount, pool.length); i++) {
      const item = pool[i];
      if (i % 2 === 0) {
        questions.push(buildCharToRomajiQuestion(item, ALL_KATAKANA, `q-k-${i}`));
      } else {
        questions.push(buildRomajiToCharQuestion(item, ALL_KATAKANA, `q-k-${i}`));
      }
    }
  } else if (category === 'kanji' || category === 'kanji-n4' || category === 'kanji-n5') {
    const isN4 = category === 'kanji-n4' || level === 'N4';
    const isN5 = category === 'kanji-n5' || level === 'N5';
    const kanjiPool = isN4 ? KANJI_N4 : isN5 ? KANJI_N5 : level === 'all' ? ALL_KANJI : KANJI_N5;
    const distractorPool = isN4 ? KANJI_N4 : isN5 ? KANJI_N5 : ALL_KANJI;
    const pool = shuffle([...kanjiPool]);

    for (let i = 0; i < Math.min(questionCount, pool.length); i++) {
      const item = pool[i];
      const mod = i % 3;
      if (mod === 0) {
        questions.push(buildMeaningToKanjiQuestion(item, distractorPool, `q-kj-${i}`));
      } else if (mod === 1) {
        questions.push(buildKanjiToReadingQuestion(item, distractorPool, `q-kj-${i}`));
      } else {
        questions.push(buildFillBlankQuestion(item, distractorPool, `q-kj-${i}`));
      }
    }
  } else {
    // Mixed category
    const hPart = generatePracticeQuiz('hiragana', 3);
    const kPart = generatePracticeQuiz('katakana', 3);
    const kjN5Part = generatePracticeQuiz('kanji', 2, undefined, 'N5');
    const kjN4Part = generatePracticeQuiz('kanji', 2, undefined, 'N4');
    return shuffle([...hPart, ...kPart, ...kjN5Part, ...kjN4Part]).slice(0, questionCount);
  }

  return shuffle(questions);
}

// 1. Character -> Romaji
function buildCharToRomajiQuestion(
  target: CharacterItem,
  pool: CharacterItem[],
  id: string
): PracticeQuestion {
  const distractors = shuffle(pool.filter(c => c.romaji !== target.romaji))
    .slice(0, 3)
    .map(c => c.romaji);
  const options = shuffle([target.romaji, ...distractors]);

  return {
    id,
    type: 'char-to-romaji',
    prompt: target.character,
    subPrompt: 'Select the correct Romaji reading:',
    options,
    correctAnswer: target.romaji,
    explanation: `The character 「${target.character}」 is pronounced "${target.romaji}".`,
    characterRef: target.character,
    category: target.category,
  };
}

// 2. Romaji -> Character
function buildRomajiToCharQuestion(
  target: CharacterItem,
  pool: CharacterItem[],
  id: string
): PracticeQuestion {
  const distractors = shuffle(pool.filter(c => c.character !== target.character))
    .slice(0, 3)
    .map(c => c.character);
  const options = shuffle([target.character, ...distractors]);

  return {
    id,
    type: 'romaji-to-char',
    prompt: target.romaji,
    subPrompt: 'Select the matching Japanese character:',
    options,
    correctAnswer: target.character,
    explanation: `The romaji "${target.romaji}" corresponds to 「${target.character}」.`,
    characterRef: target.character,
    category: target.category,
  };
}

// 3. Meaning -> Kanji
function buildMeaningToKanjiQuestion(
  target: KanjiItem,
  pool: KanjiItem[],
  id: string
): PracticeQuestion {
  const distractors = shuffle(pool.filter(k => k.character !== target.character))
    .slice(0, 3)
    .map(k => k.character);
  const options = shuffle([target.character, ...distractors]);

  return {
    id,
    type: 'meaning-to-kanji',
    prompt: `"${target.meaning.split('/')[0].trim()}"`,
    subPrompt: 'Select the matching Kanji character:',
    options,
    correctAnswer: target.character,
    explanation: `「${target.character}」 means "${target.meaning}".`,
    characterRef: target.character,
    category: 'kanji',
  };
}

// 4. Kanji -> Reading
function buildKanjiToReadingQuestion(
  target: KanjiItem,
  pool: KanjiItem[],
  id: string
): PracticeQuestion {
  // Use first example or primary on/kun
  const ex = target.examples[0];
  const wordPrompt = ex ? ex.word : target.character;
  const correctReading = ex ? ex.reading : (target.onyomi[0] || target.kunyomi[0]);

  // Distractors
  const otherExamples = pool
    .filter(k => k.character !== target.character && k.examples.length > 0)
    .map(k => k.examples[0].reading);
  const distractors = shuffle(otherExamples.filter(r => r !== correctReading)).slice(0, 3);

  // If not enough, create slight variations
  while (distractors.length < 3) {
    distractors.push(correctReading + 'ん');
  }

  const options = shuffle([correctReading, ...distractors]);

  return {
    id,
    type: 'kanji-to-reading',
    prompt: wordPrompt,
    subPrompt: 'Select the correct reading (Hiragana):',
    options,
    correctAnswer: correctReading,
    explanation: `「${wordPrompt}」 is read as "${correctReading}" (${ex?.meaning || target.meaning}).`,
    characterRef: target.character,
    category: 'kanji',
  };
}

// 5. Fill in the blank
function buildFillBlankQuestion(
  target: KanjiItem,
  pool: KanjiItem[],
  id: string
): PracticeQuestion {
  const sentence = target.exampleSentence;
  if (!sentence) {
    return buildMeaningToKanjiQuestion(target, pool, id);
  }

  // Replace target character with ___
  const blankSentence = sentence.japanese.replace(target.character, ' ___ ');

  const distractors = shuffle(pool.filter(k => k.character !== target.character))
    .slice(0, 3)
    .map(k => k.character);
  const options = shuffle([target.character, ...distractors]);

  return {
    id,
    type: 'fill-blank',
    prompt: blankSentence,
    subPrompt: `Complete the sentence: "${sentence.english}"`,
    options,
    correctAnswer: target.character,
    explanation: `The missing Kanji is 「${target.character}」 (${target.meaning}) in: ${sentence.japanese}`,
    characterRef: target.character,
    category: 'kanji',
  };
}
