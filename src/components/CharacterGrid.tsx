'use client';

import React, { useState } from 'react';
import { CharacterItem, CharacterGroup } from '@/types';
import { CharacterCard } from './CharacterCard';
import { CharacterDetailModal } from './CharacterDetailModal';
import { HIRAGANA_ROWS } from '@/data/hiragana';
import { KATAKANA_ROWS } from '@/data/katakana';

interface CharacterGridProps {
  characters: CharacterItem[];
  category: 'hiragana' | 'katakana';
}

export function CharacterGrid({ characters, category }: CharacterGridProps) {
  const [selectedItem, setSelectedItem] = useState<CharacterItem | null>(null);
  const [activeTab, setActiveTab] = useState<CharacterGroup>('basic');
  const [activeRowFilter, setActiveRowFilter] = useState<string>('all');

  const rowsMeta = category === 'hiragana' ? HIRAGANA_ROWS : KATAKANA_ROWS;

  // Filter by group (basic, dakuten, handakuten, combination)
  const groupFiltered = characters.filter(c => c.group === activeTab);

  // Filter by row if in basic tab and not 'all'
  const finalFiltered =
    activeTab === 'basic' && activeRowFilter !== 'all'
      ? groupFiltered.filter(c => c.row === activeRowFilter)
      : groupFiltered;

  return (
    <div className="space-y-6">
      {/* Category Tabs: Basic (Gojuon), Dakuten, Handakuten, Combinations */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#6E1835]/50 pb-4">
        <div className="flex flex-wrap items-center gap-2 bg-[#240D16] p-1.5 rounded-xl border border-[#6E1835]/50">
          <button
            onClick={() => {
              setActiveTab('basic');
              setActiveRowFilter('all');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'basic'
                ? 'bg-[#6E1835] text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.2)] border border-[#22D3EE]/30'
                : 'text-[#B8A9AF] hover:text-[#F8FAFC]'
            }`}
          >
            Basic (46 Characters)
          </button>
          <button
            onClick={() => setActiveTab('dakuten')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'dakuten'
                ? 'bg-[#6E1835] text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.2)] border border-[#22D3EE]/30'
                : 'text-[#B8A9AF] hover:text-[#F8FAFC]'
            }`}
          >
            Dakuten (濁点)
          </button>
          <button
            onClick={() => setActiveTab('handakuten')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'handakuten'
                ? 'bg-[#6E1835] text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.2)] border border-[#22D3EE]/30'
                : 'text-[#B8A9AF] hover:text-[#F8FAFC]'
            }`}
          >
            Handakuten (半濁点)
          </button>
          <button
            onClick={() => setActiveTab('combination')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'combination'
                ? 'bg-[#6E1835] text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.2)] border border-[#22D3EE]/30'
                : 'text-[#B8A9AF] hover:text-[#F8FAFC]'
            }`}
          >
            Combinations (拗音)
          </button>
        </div>

        {/* Row pills if basic */}
        {activeTab === 'basic' && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveRowFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeRowFilter === 'all'
                  ? 'bg-[#22D3EE] text-[#240D16] font-bold shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                  : 'bg-[#351522] text-[#B8A9AF] hover:text-white'
              }`}
            >
              All Rows
            </button>
            {rowsMeta.map(r => (
              <button
                key={r.id}
                onClick={() => setActiveRowFilter(r.id)}
                className={`px-2.5 py-1 rounded-md transition-colors uppercase ${
                  activeRowFilter === r.id
                    ? 'bg-[#22D3EE] text-[#240D16] font-bold shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                    : 'bg-[#351522] text-[#B8A9AF] hover:text-white'
                }`}
              >
                {r.romaji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Characters */}
      {activeTab === 'basic' && activeRowFilter === 'all' ? (
        // Standard Japanese 5-column Row Grouping
        <div className="space-y-6">
          {rowsMeta.map(r => {
            const rowChars = groupFiltered.filter(c => c.row === r.id);
            if (rowChars.length === 0) return null;

            return (
              <div key={r.id} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#67E8F9] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#22D3EE]" />
                  <span>{r.label}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                  {rowChars.map(char => (
                    <CharacterCard
                      key={char.id}
                      item={char}
                      onSelect={setSelectedItem}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {finalFiltered.map(char => (
            <CharacterCard
              key={char.id}
              item={char}
              onSelect={setSelectedItem}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <CharacterDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
