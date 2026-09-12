'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Volume2, CheckCircle2, Compass, Layers } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { playJapaneseAudio } from '@/lib/audio';

export default function LearnPage() {
  const { learnedIds } = useProgress();

  const hCount = learnedIds.filter(id => id.startsWith('h-')).length;
  const kCount = learnedIds.filter(id => id.startsWith('k-') && !id.startsWith('k-n5') && !id.startsWith('k-n4')).length;
  const kjN5Count = learnedIds.filter(id => id.startsWith('k-n5')).length;
  const kjN4Count = learnedIds.filter(id => id.startsWith('k-n4')).length;
  const kjCount = kjN5Count + kjN4Count;

  const sampleAudios = [
    { label: 'Hiragana Vowels', text: 'あいうえお' },
    { label: 'Katakana Greeting', text: 'ハロー' },
    { label: 'Kanji "Japan"', text: '日本' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#22D3EE] uppercase tracking-widest">
          Curriculum Overview
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F8FAFC]">
          Choose Your Learning Path
        </h1>
        <p className="text-sm sm:text-base text-[#B8A9AF]">
          Japanese uses three writing systems simultaneously. We recommend starting with Hiragana, moving to Katakana, and building your first 100 essential JLPT N5 &amp; N4 Kanji.
        </p>
      </div>

      {/* Audio pronunciation tester bar */}
      <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-[#351522] border border-[#6E1835] flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-[#8E7A83] font-medium">Quick Audio Check:</span>
        <div className="flex items-center gap-2">
          {sampleAudios.map((s, idx) => (
            <button
              key={idx}
              onClick={() => playJapaneseAudio(s.text)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#240D16] border border-[#6E1835] hover:border-[#22D3EE] text-[#F8FAFC] hover:text-[#22D3EE] transition-colors"
            >
              <Volume2 size={13} />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* THREE PATH CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 1. Hiragana */}
        <div className="flex flex-col justify-between p-8 rounded-3xl bg-[#351522] border border-[#6E1835] hover:border-[#22D3EE]/50 shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-japanese text-5xl font-bold text-[#22D3EE] group-hover:scale-110 transition-transform">
                あ
              </span>
              <div className="text-right">
                <span className="text-xs font-bold text-[#4ADE80] block">
                  {hCount} / 46 Learned
                </span>
                <span className="text-[10px] text-[#8E7A83] uppercase">Beginner Step 1</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors">
              Hiragana (ひらがな)
            </h2>
            <p className="text-xs text-[#B8A9AF] leading-relaxed">
              Every Japanese child learns Hiragana first. It is phonetic, with 46 basic characters representing syllables, plus dakuten (が) and combinations (きゃ).
            </p>

            <ul className="space-y-2 text-xs text-[#B8A9AF] pt-2 border-t border-[#6E1835]/40">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#22D3EE] shrink-0" />
                <span>46 Base characters + 25 Dakuten/Handakuten</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#22D3EE] shrink-0" />
                <span>33 Combination sounds (Yōon)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#22D3EE] shrink-0" />
                <span>Audio pronunciation for each syllable</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-[#6E1835]/40 flex items-center gap-3">
            <Link
              href="/hiragana"
              className="flex-1 py-3 px-4 rounded-xl bg-[#22D3EE] hover:bg-[#67E8F9] text-[#240D16] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
            >
              <span>Explore Grid</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/practice?category=hiragana"
              className="p-3 rounded-xl bg-[#240D16] border border-[#6E1835] hover:border-[#22D3EE] text-[#22D3EE] hover:bg-[#3A1422] transition-colors"
              title="Practice Hiragana Quiz"
            >
              <Compass size={18} />
            </Link>
          </div>
        </div>

        {/* 2. Katakana */}
        <div className="flex flex-col justify-between p-8 rounded-3xl bg-[#351522] border border-[#6E1835] hover:border-[#22D3EE]/50 shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-japanese text-5xl font-bold text-[#67E8F9] group-hover:scale-110 transition-transform">
                ア
              </span>
              <div className="text-right">
                <span className="text-xs font-bold text-[#4ADE80] block">
                  {kCount} / 46 Learned
                </span>
                <span className="text-[10px] text-[#8E7A83] uppercase">Beginner Step 2</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#F8FAFC] group-hover:text-[#67E8F9] transition-colors">
              Katakana (カタカナ)
            </h2>
            <p className="text-xs text-[#B8A9AF] leading-relaxed">
              Used primarily for modern foreign loanwords, restaurants, menus, scientific terms, and names. Knowing Katakana lets you immediately read hundreds of everyday English words in Japan!
            </p>

            <ul className="space-y-2 text-xs text-[#B8A9AF] pt-2 border-t border-[#6E1835]/40">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#67E8F9] shrink-0" />
                <span>46 Base characters + Loanword vocabulary</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#67E8F9] shrink-0" />
                <span>Tricky pairs (シ vs ツ, ソ vs ン)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#67E8F9] shrink-0" />
                <span>Audio examples: コーヒー, テレビ, etc.</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-[#6E1835]/40 flex items-center gap-3">
            <Link
              href="/katakana"
              className="flex-1 py-3 px-4 rounded-xl bg-[#67E8F9] hover:bg-[#22D3EE] text-[#240D16] font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(103,232,249,0.3)] transition-all"
            >
              <span>Explore Grid</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/practice?category=katakana"
              className="p-3 rounded-xl bg-[#240D16] border border-[#6E1835] hover:border-[#67E8F9] text-[#67E8F9] hover:bg-[#3A1422] transition-colors"
              title="Practice Katakana Quiz"
            >
              <Compass size={18} />
            </Link>
          </div>
        </div>

        {/* 3. Kanji N5 & N4 */}
        <div className="flex flex-col justify-between p-8 rounded-3xl bg-[#351522] border border-[#6E1835] hover:border-[#22D3EE]/50 shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-japanese text-5xl font-bold text-[#FB7185] group-hover:scale-110 transition-transform">
                日・会
              </span>
              <div className="text-right">
                <span className="text-xs font-bold text-[#4ADE80] block">
                  {kjCount} / 100 Learned
                </span>
                <span className="text-[10px] text-[#8E7A83] uppercase">JLPT N5 &amp; N4 Core</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#F8FAFC] group-hover:text-[#FB7185] transition-colors">
              Kanji (漢字 N5 &amp; N4)
            </h2>
            <p className="text-xs text-[#B8A9AF] leading-relaxed">
              Chinese characters imported to represent concepts and roots. 100 essential logographs covering beginner foundations (N5) and elementary daily activities (N4).
            </p>

            <ul className="space-y-2 text-xs text-[#B8A9AF] pt-2 border-t border-[#6E1835]/40">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#FB7185] shrink-0" />
                <span>N5: 50 Core characters (Numbers, Time, Nature)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#FB7185] shrink-0" />
                <span>N4: 50 Elementary characters (Society, Verbs, Directions)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#FB7185] shrink-0" />
                <span>On&apos;yomi, Kun&apos;yomi, compound words &amp; audio</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-[#6E1835]/40 flex flex-wrap items-center gap-2">
            <Link
              href="/kanji"
              className="flex-1 py-3 px-3 rounded-xl bg-[#6E1835] hover:bg-[#8D2246] border border-[#22D3EE]/40 text-[#22D3EE] font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
            >
              <span>Explore Kanji ({kjN5Count + kjN4Count}/100)</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/practice?category=kanji&level=N4"
              className="p-3 rounded-xl bg-[#240D16] border border-amber-400/50 hover:border-amber-400 text-amber-300 hover:bg-[#3A1422] transition-colors"
              title="Practice N4 Kanji Quiz"
            >
              <Compass size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK TIP BANNER */}
      <div className="p-6 rounded-2xl bg-[#240D16] border border-[#6E1835] flex items-center gap-4">
        <div className="p-3 rounded-xl bg-[#351522] text-[#22D3EE] shrink-0">
          <Layers size={24} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#F8FAFC]">Recommended Learning Sequence</h4>
          <p className="text-xs text-[#B8A9AF] mt-0.5">
            1. Master the 46 basic Hiragana → 2. Practice with Hiragana Quiz → 3. Move to Katakana loan words → 4. Progress through JLPT N5 &amp; N4 Kanji.
          </p>
        </div>
      </div>
    </div>
  );
}
