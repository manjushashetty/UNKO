'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PracticeEngine } from '@/components/PracticeEngine';
import { ScriptCategory } from '@/types';
import { Compass, Sparkles, BookOpen, Layers, RotateCcw } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';

function PracticeContent() {
  const searchParams = useSearchParams();
  const initialCat = (searchParams.get('category') as ScriptCategory | 'mixed' | 'weak' | 'kanji-n4') || 'hiragana';
  const initialLevel = searchParams.get('level') || (initialCat === 'kanji-n4' ? 'N4' : undefined);
  const targetChar = searchParams.get('char') || undefined;

  const { mistakes } = useProgress();
  const mistakeCount = Object.keys(mistakes).length;

  const [selectedCategory, setSelectedCategory] = useState<ScriptCategory | 'mixed' | 'weak' | 'kanji-n4'>(initialCat);
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(initialLevel);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(Boolean(targetChar || searchParams.get('category')));

  // Update category when query param changes
  useEffect(() => {
    const cat = searchParams.get('category');
    const lvl = searchParams.get('level');
    if (cat) {
      setSelectedCategory(cat as ScriptCategory | 'mixed' | 'weak' | 'kanji-n4');
      setSelectedLevel(lvl || (cat === 'kanji-n4' ? 'N4' : undefined));
      setIsSessionActive(true);
    }
  }, [searchParams]);

  const categories = [
    {
      id: 'hiragana',
      title: 'Hiragana Drill',
      japanese: 'ひらがな',
      description: 'Test romaji readings and character recognition for the 46 standard syllables.',
      icon: BookOpen,
      color: 'text-[#22D3EE]',
      level: undefined,
      badge: undefined,
    },
    {
      id: 'katakana',
      title: 'Katakana Drill',
      japanese: 'カタカナ',
      description: 'Practice the loanword script and sharpen recognition between similar strokes.',
      icon: Compass,
      color: 'text-[#67E8F9]',
      level: undefined,
      badge: undefined,
    },
    {
      id: 'kanji',
      title: 'Kanji N5 Challenge',
      japanese: '漢字 N5',
      description: 'Identify meanings, On/Kun readings, and contextual sentences with missing kanji.',
      icon: Layers,
      color: 'text-[#FB7185]',
      level: 'N5',
      badge: '50 Kanji',
    },
    {
      id: 'kanji-n4',
      title: 'Kanji N4 Challenge',
      japanese: '漢字 N4',
      description: 'Test intermediate readings, compound vocabulary, and fill-ins for 50 JLPT N4 kanji.',
      icon: Layers,
      color: 'text-amber-400',
      level: 'N4',
      badge: '50 Kanji',
    },
    {
      id: 'mixed',
      title: 'Grand Review (Mixed)',
      japanese: '総合演習',
      description: 'A balanced blend of Hiragana, Katakana, and Kanji to test real fluency.',
      icon: Sparkles,
      color: 'text-[#4ADE80]',
      level: undefined,
      badge: undefined,
    },
    {
      id: 'weak',
      title: 'Review Weak Characters',
      japanese: '弱点克服',
      description: `Target the specific characters you frequently miss (${mistakeCount} currently logged).`,
      icon: RotateCcw,
      color: 'text-amber-400',
      level: undefined,
      badge: mistakeCount > 0 ? `${mistakeCount} weak` : undefined,
    },
  ];

  if (isSessionActive) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PracticeEngine
          initialCategory={selectedCategory}
          targetLevel={selectedLevel}
          targetCharacter={targetChar}
          onExit={() => setIsSessionActive(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#351522] border border-[#6E1835] text-xs font-semibold text-[#22D3EE]">
          <Compass size={14} />
          <span>Adaptive Practice Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F8FAFC]">
          Interactive Practice Hub
        </h1>
        <p className="text-sm text-[#B8A9AF] max-w-xl mx-auto">
          Choose a focus category below to launch a 10-question adaptive quiz with immediate feedback, explanations, and XP rewards.
        </p>
      </div>

      {/* Category Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as any);
                setSelectedLevel(cat.level);
                setIsSessionActive(true);
              }}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-200 border select-none group flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#351522] border-[#22D3EE] shadow-[0_0_25px_rgba(34,211,238,0.2)]'
                  : 'bg-[#351522]/80 border-[#6E1835] hover:border-[#22D3EE]/50 hover:bg-[#351522]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#240D16] border border-[#6E1835] flex items-center justify-center shadow-inner">
                      <Icon size={20} className={cat.color} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors">
                        {cat.title}
                      </h3>
                      <span className="font-japanese text-xs text-[#8E7A83]">
                        {cat.japanese}
                      </span>
                    </div>
                  </div>

                  {cat.badge && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {cat.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#B8A9AF] leading-relaxed mt-1">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#6E1835]/40 flex items-center justify-between text-xs">
                <span className="text-[#8E7A83]">10 Rapid Questions • +20 XP</span>
                <span className="font-bold text-[#22D3EE] group-hover:translate-x-1 transition-transform">
                  Launch Quiz →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gamification reminder banner */}
      <div className="p-4 rounded-2xl bg-[#240D16] border border-[#6E1835]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#B8A9AF]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
          <span>Each correct answer yields <strong>+10 XP</strong> and every finished session awards <strong>+20 XP bonus</strong>.</span>
        </div>
        <span className="text-[#67E8F9] font-medium">Daily practice extends your streak!</span>
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-[#B8A9AF]">
          Loading Practice Engine...
        </div>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}
