'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Compass, CheckCircle2, Zap, Flame, Trophy, Volume2 } from 'lucide-react';
import { playJapaneseAudio } from '@/lib/audio';

export default function HomePage() {
  const previewCharacters = [
    { char: 'あ', romaji: 'a', cat: 'Hiragana', meaning: 'Sound of morning' },
    { char: 'ア', romaji: 'a', cat: 'Katakana', meaning: 'Sound of ice cream' },
    { char: '日', romaji: 'nichi / hi', cat: 'Kanji N5', meaning: 'Day / Sun / Japan' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#6E1835]/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-[30rem] h-[30rem] bg-[#22D3EE]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[32rem] h-[32rem] bg-[#6E1835]/25 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Floating Kanji in background */}
      <div
        aria-hidden="true"
        className="select-none pointer-events-none absolute right-4 lg:right-16 top-24 font-japanese text-[12rem] lg:text-[18rem] font-black text-[#6E1835]/15 leading-none"
      >
        あ
      </div>
      <div
        aria-hidden="true"
        className="select-none pointer-events-none absolute left-8 top-[36rem] font-japanese text-[10rem] lg:text-[15rem] font-black text-[#22D3EE]/5 leading-none"
      >
        ア
      </div>
      <div
        aria-hidden="true"
        className="select-none pointer-events-none absolute right-12 bottom-32 font-japanese text-[12rem] lg:text-[16rem] font-black text-[#6E1835]/10 leading-none"
      >
        日
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 lg:pt-20 lg:pb-32 space-y-24">
        {/* HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto space-y-8">
          {/* Japanese Greeting Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#351522] border border-[#22D3EE]/40 text-[#22D3EE] text-sm font-medium shadow-[0_0_18px_rgba(34,211,238,0.2)] animate-pulse">
            <span className="font-japanese text-base font-bold">「こんにちは！」</span>
            <span className="text-xs text-[#B8A9AF] font-normal">• Konnichiwa</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.15]">
            Master Japanese,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#67E8F9] to-[#F8FAFC]">
              One Character
            </span>{' '}
            at a Time.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg lg:text-xl text-[#B8A9AF] max-w-2xl mx-auto font-normal leading-relaxed">
            Learn Hiragana, Katakana, and Kanji through interactive exercises, audio pronunciation, and personalized practice designed for lasting memory.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/practice"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#22D3EE] hover:bg-[#67E8F9] text-[#240D16] font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(34,211,238,0.35)] hover:shadow-[0_0_35px_rgba(34,211,238,0.5)] transition-all hover:-translate-y-0.5"
            >
              <span>Start Learning</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/learn"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#351522] hover:bg-[#3A1422] border border-[#6E1835] hover:border-[#22D3EE]/40 text-[#F8FAFC] font-semibold text-base flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <BookOpen size={18} className="text-[#22D3EE]" />
              <span>Explore Characters</span>
            </Link>
          </div>

          {/* Interactive Character Demonstration Cards */}
          <div className="pt-8">
            <p className="text-xs font-semibold text-[#8E7A83] uppercase tracking-widest mb-4">
              Tap any glyph to hear native pronunciation
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {previewCharacters.map((c, i) => (
                <div
                  key={i}
                  onClick={() => playJapaneseAudio(c.char)}
                  className="group relative p-6 rounded-2xl bg-[#351522]/90 border border-[#6E1835] hover:border-[#22D3EE] hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all cursor-pointer select-none text-center"
                >
                  <button
                    type="button"
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-[#8E7A83] group-hover:text-[#22D3EE] hover:bg-[#240D16] transition-colors"
                    aria-label={`Listen to ${c.char}`}
                  >
                    <Volume2 size={16} />
                  </button>
                  <div className="font-japanese text-6xl text-[#F8FAFC] font-bold my-1 group-hover:scale-110 transition-transform">
                    {c.char}
                  </div>
                  <div className="text-sm font-bold text-[#22D3EE] uppercase tracking-wider">
                    {c.romaji}
                  </div>
                  <div className="text-xs text-[#B8A9AF] mt-1">{c.meaning}</div>
                  <span className="inline-block mt-3 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#240D16] text-[#67E8F9] border border-[#6E1835]">
                    {c.cat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 CORE PILLARS SECTION */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-bold text-[#22D3EE] uppercase tracking-widest">
              Structured Curriculum
            </h2>
            <p className="text-3xl font-extrabold text-[#F8FAFC]">
              The Three Pillars of Written Japanese
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hiragana Card */}
            <div className="p-8 rounded-3xl bg-[#351522] border border-[#6E1835] hover:border-[#22D3EE]/50 shadow-[0_4px_25px_rgba(0,0,0,0.3)] transition-all group">
              <div className="flex items-center justify-between mb-4">
                <span className="font-japanese text-4xl font-bold text-[#22D3EE]">
                  あ
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#240D16] text-[#B8A9AF] border border-[#6E1835]">
                  46 Characters
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors">
                1. Hiragana (平仮名)
              </h3>
              <p className="text-sm text-[#B8A9AF] mt-2 leading-relaxed">
                The foundational phonetic script used for native Japanese words, grammar particles, and verb inflections.
              </p>
              <div className="mt-6 pt-4 border-t border-[#6E1835]/40 flex items-center justify-between text-xs">
                <span className="text-[#8E7A83]">Includes Dakuten & Yōon</span>
                <Link
                  href="/hiragana"
                  className="font-semibold text-[#22D3EE] hover:underline flex items-center gap-1"
                >
                  Learn Hiragana <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Katakana Card */}
            <div className="p-8 rounded-3xl bg-[#351522] border border-[#6E1835] hover:border-[#22D3EE]/50 shadow-[0_4px_25px_rgba(0,0,0,0.3)] transition-all group">
              <div className="flex items-center justify-between mb-4">
                <span className="font-japanese text-4xl font-bold text-[#22D3EE]">
                  ア
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#240D16] text-[#B8A9AF] border border-[#6E1835]">
                  46 Characters
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors">
                2. Katakana (片仮名)
              </h3>
              <p className="text-sm text-[#B8A9AF] mt-2 leading-relaxed">
                Angular, crisp script essential for foreign loanwords, technical terms, company names, and sound effects.
              </p>
              <div className="mt-6 pt-4 border-t border-[#6E1835]/40 flex items-center justify-between text-xs">
                <span className="text-[#8E7A83]">Real loanword vocabulary</span>
                <Link
                  href="/katakana"
                  className="font-semibold text-[#22D3EE] hover:underline flex items-center gap-1"
                >
                  Learn Katakana <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Kanji Card */}
            <div className="p-8 rounded-3xl bg-[#351522] border border-[#6E1835] hover:border-[#22D3EE]/50 shadow-[0_4px_25px_rgba(0,0,0,0.3)] transition-all group">
              <div className="flex items-center justify-between mb-4">
                <span className="font-japanese text-4xl font-bold text-[#22D3EE]">
                  日
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#240D16] text-[#B8A9AF] border border-[#6E1835]">
                  JLPT N5
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors">
                3. Kanji (漢字)
              </h3>
              <p className="text-sm text-[#B8A9AF] mt-2 leading-relaxed">
                Logographic characters that represent concepts, root words, and meanings with On&apos;yomi and Kun&apos;yomi readings.
              </p>
              <div className="mt-6 pt-4 border-t border-[#6E1835]/40 flex items-center justify-between text-xs">
                <span className="text-[#8E7A83]">Search & Sentences</span>
                <Link
                  href="/kanji"
                  className="font-semibold text-[#22D3EE] hover:underline flex items-center gap-1"
                >
                  Explore Kanji <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* WHY NIHONGOFLOW FEATURES */}
        <section className="p-8 sm:p-12 rounded-3xl bg-[#351522]/80 border border-[#6E1835] space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-xs font-bold text-[#22D3EE] uppercase tracking-widest">
              Intelligent Learning Flow
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              Engineered for Retention, Not Endless Drills
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#240D16] border border-[#6E1835] text-[#22D3EE] flex items-center justify-center shadow-inner">
                <Compass size={20} />
              </div>
              <h4 className="text-base font-bold text-[#F8FAFC]">5 Question Types</h4>
              <p className="text-xs text-[#B8A9AF] leading-relaxed">
                Practice romaji-to-char, char-to-romaji, kanji-to-reading, meanings, and contextual sentence fill-ins.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#240D16] border border-[#6E1835] text-[#FB7185] flex items-center justify-center shadow-inner">
                <Flame size={20} />
              </div>
              <h4 className="text-base font-bold text-[#F8FAFC]">Mistake Tracking</h4>
              <p className="text-xs text-[#B8A9AF] leading-relaxed">
                Never lose track of tricky look-alike characters like さ/ち or シ/ツ. Drill weak characters directly.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#240D16] border border-[#6E1835] text-[#4ADE80] flex items-center justify-center shadow-inner">
                <Zap size={20} />
              </div>
              <h4 className="text-base font-bold text-[#F8FAFC]">Lightweight Gamification</h4>
              <p className="text-xs text-[#B8A9AF] leading-relaxed">
                Earn XP (+10 per question, +20 per quiz), build streaks, and unlock milestones without childish distractions.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#240D16] border border-[#6E1835] text-[#67E8F9] flex items-center justify-center shadow-inner">
                <Trophy size={20} />
              </div>
              <h4 className="text-base font-bold text-[#F8FAFC]">Zero Friction Mode</h4>
              <p className="text-xs text-[#B8A9AF] leading-relaxed">
                Guest mode works out of the box with offline storage, seamlessly connecting to Firebase whenever configured.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="text-center py-8 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC]">
            Ready to Read Japanese Confidently?
          </h2>
          <p className="text-sm text-[#B8A9AF] max-w-md mx-auto">
            Join the journey today. Start with the five basic vowels あ い う え お.
          </p>
          <div className="pt-2">
            <Link
              href="/hiragana"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#6E1835] hover:bg-[#8D2246] border border-[#22D3EE]/50 text-[#22D3EE] font-bold text-sm shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all"
            >
              <span>Begin With Hiragana</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
