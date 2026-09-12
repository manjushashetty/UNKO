'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { KANJI_N5, KANJI_CATEGORIES } from '@/data/kanji-n5';
import { KANJI_N4, KANJI_N4_CATEGORIES } from '@/data/kanji-n4';
import { KanjiCard } from '@/components/KanjiCard';
import { KanjiDetailModal } from '@/components/KanjiDetailModal';
import { SearchBar } from '@/components/SearchBar';
import { FilterDropdown } from '@/components/FilterDropdown';
import { KanjiItem } from '@/types';
import { useProgress } from '@/context/ProgressContext';
import { Compass, CheckCircle2 } from 'lucide-react';

export default function KanjiPage() {
  const { learnedIds } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJlpt, setSelectedJlpt] = useState('N5');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem | null>(null);

  const jlptLevels = [
    { id: 'N5', label: 'JLPT N5 (Active - 50)' },
    { id: 'N4', label: 'JLPT N4 (Active - 50)' },
    { id: 'N3', label: 'JLPT N3 (Coming soon)' },
    { id: 'N2', label: 'JLPT N2 (Coming soon)' },
    { id: 'N1', label: 'JLPT N1 (Coming soon)' },
  ];

  const currentDataset = useMemo(() => {
    if (selectedJlpt === 'N5') return KANJI_N5;
    if (selectedJlpt === 'N4') return KANJI_N4;
    return [];
  }, [selectedJlpt]);

  const currentCategories = selectedJlpt === 'N4' ? KANJI_N4_CATEGORIES : KANJI_CATEGORIES;

  // Filter and search logic
  const filteredKanji = useMemo(() => {
    if (currentDataset.length === 0) {
      return [];
    }

    return currentDataset.filter(k => {
      // Category filter
      if (selectedCategory !== 'all' && k.category !== selectedCategory) {
        return false;
      }

      // Search query (character, meaning, on'yomi, kun'yomi, examples)
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchChar = k.character.includes(q);
      const matchMeaning = k.meaning.toLowerCase().includes(q);
      const matchOn = k.onyomi.some(on => on.toLowerCase().includes(q));
      const matchKun = k.kunyomi.some(kun => kun.toLowerCase().includes(q));
      const matchEx = k.examples.some(
        ex => ex.word.includes(q) || ex.reading.includes(q) || ex.meaning.toLowerCase().includes(q)
      );

      return matchChar || matchMeaning || matchOn || matchKun || matchEx;
    });
  }, [currentDataset, searchQuery, selectedCategory]);

  const learnedCount = learnedIds.filter(id =>
    id.startsWith(selectedJlpt === 'N4' ? 'k-n4' : 'k-n5')
  ).length;

  const headerDetails = {
    N5: {
      title: 'JLPT N5 Kanji Explorer',
      description: 'Explore 50 core beginner Kanji characters. Learn their On\'yomi and Kun\'yomi readings, high-frequency vocabulary compounds, and sample contextual sentences.',
    },
    N4: {
      title: 'JLPT N4 Kanji Explorer',
      description: 'Explore 50 essential elementary Kanji characters (society, daily activities, travel, and schedule). Master practical readings and high-frequency compounds.',
    },
  }[selectedJlpt as 'N5' | 'N4'] || {
    title: `JLPT ${selectedJlpt} Kanji Explorer`,
    description: `Level ${selectedJlpt} characters will be available in future curriculum updates.`,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#6E1835]/50">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#22D3EE] uppercase tracking-wider mb-1">
            <span>Essential Logographs</span>
            <span>•</span>
            <span className="font-japanese">漢字 {selectedJlpt}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC]">
            {headerDetails.title}
          </h1>
          <p className="text-sm text-[#B8A9AF] mt-1 max-w-xl">
            {headerDetails.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#351522] border border-[#6E1835] text-xs font-semibold">
            <CheckCircle2 size={16} className="text-[#4ADE80]" />
            <span className="text-[#F8FAFC]">{learnedCount} / {currentDataset.length} Learned</span>
          </div>

          <Link
            href={`/practice?category=kanji&level=${selectedJlpt}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22D3EE] hover:bg-[#67E8F9] text-[#240D16] font-bold text-xs shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
          >
            <Compass size={16} />
            <span>Practice {selectedJlpt} Kanji</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#240D16] p-4 rounded-2xl border border-[#6E1835]/60">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by kanji, meaning, or reading (e.g. 会, meet, かい)..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown
            label="Level"
            options={jlptLevels}
            selectedId={selectedJlpt}
            onSelect={(level) => {
              setSelectedJlpt(level);
              setSelectedCategory('all');
            }}
          />
          <FilterDropdown
            label="Theme"
            options={currentCategories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>

      {/* Kanji Cards Grid */}
      {currentDataset.length === 0 ? (
        <div className="text-center py-16 bg-[#351522]/40 rounded-3xl border border-[#6E1835]/50 space-y-3">
          <h3 className="text-xl font-bold text-[#F8FAFC]">Level {selectedJlpt} is in Preparation</h3>
          <p className="text-xs text-[#B8A9AF] max-w-sm mx-auto">
            N5 and N4 are currently fully unlocked. Levels N3 through N1 will unlock in future curriculum updates.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedJlpt('N5');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#6E1835] text-[#22D3EE] text-xs font-semibold hover:bg-[#8D2246] transition-colors"
            >
              Return to JLPT N5
            </button>
            <button
              onClick={() => {
                setSelectedJlpt('N4');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#351522] border border-[#22D3EE]/50 text-[#22D3EE] text-xs font-semibold hover:bg-[#6E1835] transition-colors"
            >
              Go to JLPT N4
            </button>
          </div>
        </div>
      ) : filteredKanji.length === 0 ? (
        <div className="text-center py-16 bg-[#351522]/40 rounded-3xl border border-[#6E1835]/50 space-y-3">
          <h3 className="text-lg font-bold text-[#F8FAFC]">No Kanji Match Your Search</h3>
          <p className="text-xs text-[#B8A9AF]">
            Try searching for &quot;meet&quot;, &quot;company&quot;, &quot;会&quot;, or &quot;かい&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#6E1835] text-[#22D3EE] text-xs font-semibold hover:bg-[#8D2246] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {filteredKanji.map(kanji => (
            <KanjiCard
              key={kanji.id}
              kanji={kanji}
              onSelect={setSelectedKanji}
            />
          ))}
        </div>
      )}

      {/* Kanji Detail Modal */}
      <KanjiDetailModal
        kanji={selectedKanji}
        onClose={() => setSelectedKanji(null)}
      />
    </div>
  );
}
