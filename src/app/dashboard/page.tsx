'use client';

import React from 'react';
import Link from 'next/link';
import { useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/StatCard';
import { MistakeCard } from '@/components/MistakeCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Zap, Flame, Target, CheckSquare, ArrowRight, BookOpen, RotateCcw } from 'lucide-react';

export default function DashboardPage() {
  const { stats, mistakes, learnedIds } = useProgress();
  const { user } = useAuth();

  // Accuracy calculation
  const accuracyPercentage =
    stats.totalQuestionsAnswered > 0
      ? Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100)
      : 0;

  // Masteries
  // Basic 46 Hiragana
  const hiraganaLearned = learnedIds.filter(id => id.startsWith('h-')).length;
  const hiraganaPercent = Math.min(100, Math.round((hiraganaLearned / 46) * 100));

  // Basic 46 Katakana
  const katakanaLearned = learnedIds.filter(id => id.startsWith('k-') && !id.startsWith('k-n5') && !id.startsWith('k-n4')).length;
  const katakanaPercent = Math.min(100, Math.round((katakanaLearned / 46) * 100));

  // 50 N5 Kanji
  const kanjiN5Learned = learnedIds.filter(id => id.startsWith('k-n5')).length;
  const kanjiN5Percent = Math.min(100, Math.round((kanjiN5Learned / 50) * 100));

  // 50 N4 Kanji
  const kanjiN4Learned = learnedIds.filter(id => id.startsWith('k-n4')).length;
  const kanjiN4Percent = Math.min(100, Math.round((kanjiN4Learned / 50) * 100));

  const mistakeList = Object.values(mistakes);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Personalized Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#6E1835]/50">
        <div>
          <div className="flex items-center gap-2 text-[#22D3EE] text-sm font-semibold mb-1">
            <span className="font-japanese text-base">こんにちは！</span>
            <span>Konnichiwa, {user && !user.isAnonymous ? user.displayName : 'Learner'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC]">
            Continue your Japanese journey.
          </h1>
          <p className="text-sm text-[#B8A9AF] mt-1">
            Consistent daily practice solidifies character recall faster than passive reading.
          </p>
        </div>

        <Link
          href="/practice"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#22D3EE] hover:bg-[#67E8F9] text-[#240D16] font-bold text-sm shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all shrink-0 self-start sm:self-auto"
        >
          <span>Quick Practice</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* STATISTICS CARDS (Requirement 5) */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold text-[#8E7A83] uppercase tracking-wider">
          Learning Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total XP"
            value={stats.xp.toLocaleString()}
            subtitle="Knowledge experience"
            icon={Zap}
            iconColor="text-[#22D3EE]"
          />
          <StatCard
            title="Current Streak"
            value={`${stats.currentStreak} ${stats.currentStreak === 1 ? 'Day' : 'Days'}`}
            subtitle={stats.longestStreak > stats.currentStreak ? `Best: ${stats.longestStreak} days` : 'Personal best!'}
            icon={Flame}
            iconColor="text-amber-400"
          />
          <StatCard
            title="Overall Accuracy"
            value={`${accuracyPercentage}%`}
            subtitle={`${stats.totalCorrectAnswers} of ${stats.totalQuestionsAnswered} correct`}
            icon={Target}
            iconColor="text-[#4ADE80]"
          />
          <StatCard
            title="Questions Completed"
            value={stats.totalQuestionsAnswered}
            subtitle="Practice questions"
            icon={CheckSquare}
            iconColor="text-[#67E8F9]"
          />
        </div>
      </section>

      {/* LEARNING PROGRESS & CONTINUE LESSON (Requirement 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Bars for Hiragana, Katakana, Kanji */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#351522] border border-[#6E1835] shadow-[0_4px_25px_rgba(0,0,0,0.3)] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Learning Progress</h3>
              <p className="text-xs text-[#8E7A83]">Mastery across the three core Japanese scripts</p>
            </div>
            <Link
              href="/progress"
              className="text-xs font-semibold text-[#22D3EE] hover:underline"
            >
              Detailed Analytics →
            </Link>
          </div>

          <div className="space-y-5">
            {/* Hiragana Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-japanese font-bold text-[#22D3EE] text-base">あ</span>
                  <span className="font-semibold text-[#F8FAFC]">Hiragana</span>
                  <span className="text-xs text-[#8E7A83]">({hiraganaLearned} / 46 basic)</span>
                </div>
                <span className="font-bold text-[#22D3EE]">{hiraganaPercent}%</span>
              </div>
              <ProgressBar current={hiraganaLearned} total={46} height="sm" />
            </div>

            {/* Katakana Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-japanese font-bold text-[#67E8F9] text-base">ア</span>
                  <span className="font-semibold text-[#F8FAFC]">Katakana</span>
                  <span className="text-xs text-[#8E7A83]">({katakanaLearned} / 46 basic)</span>
                </div>
                <span className="font-bold text-[#67E8F9]">{katakanaPercent}%</span>
              </div>
              <ProgressBar current={katakanaLearned} total={46} height="sm" />
            </div>

            {/* Kanji N5 Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-japanese font-bold text-[#FB7185] text-base">日</span>
                  <span className="font-semibold text-[#F8FAFC]">Kanji N5</span>
                  <span className="text-xs text-[#8E7A83]">({kanjiN5Learned} / 50 characters)</span>
                </div>
                <span className="font-bold text-[#F8FAFC]">{kanjiN5Percent}%</span>
              </div>
              <ProgressBar current={kanjiN5Learned} total={50} height="sm" />
            </div>

            {/* Kanji N4 Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-japanese font-bold text-amber-400 text-base">会</span>
                  <span className="font-semibold text-[#F8FAFC]">Kanji N4</span>
                  <span className="text-xs text-[#8E7A83]">({kanjiN4Learned} / 50 characters)</span>
                </div>
                <span className="font-bold text-amber-400">{kanjiN4Percent}%</span>
              </div>
              <ProgressBar current={kanjiN4Learned} total={50} height="sm" />
            </div>
          </div>
        </div>

        {/* Continue Learning Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#351522] to-[#240D16] border border-[#6E1835] shadow-[0_4px_25px_rgba(0,0,0,0.3)] flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6E1835]/70 text-[#22D3EE] text-xs font-semibold">
              <BookOpen size={14} />
              <span>Continue Learning</span>
            </div>
            <h3 className="text-xl font-bold text-[#F8FAFC]">
              Katakana — サ Row
            </h3>
            <p className="text-xs text-[#B8A9AF] leading-relaxed">
              Master the subtle visual differences between <span className="text-[#22D3EE] font-japanese font-bold">サ</span>, <span className="text-[#22D3EE] font-japanese font-bold">シ</span>, <span className="text-[#22D3EE] font-japanese font-bold">ス</span>, <span className="text-[#22D3EE] font-japanese font-bold">セ</span>, and <span className="text-[#22D3EE] font-japanese font-bold">ソ</span>.
            </p>
            <div className="pt-2">
              <div className="flex justify-between text-xs text-[#B8A9AF] mb-1">
                <span>Lesson status</span>
                <span className="text-[#22D3EE] font-bold">6 / 10 completed</span>
              </div>
              <ProgressBar current={6} total={10} height="sm" />
            </div>
          </div>

          <Link
            href="/practice?category=katakana"
            className="w-full py-3 px-4 rounded-xl bg-[#6E1835] hover:bg-[#8D2246] border border-[#22D3EE]/40 text-[#22D3EE] font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
          >
            <span>Continue Lesson</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* RECOMMENDED REVIEW (Requirement 5 & 13) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#8E7A83] uppercase tracking-wider">
            Targeted Revision
          </h2>
          {mistakeList.length > 0 && (
            <Link
              href="/practice?category=weak"
              className="text-xs font-semibold text-[#FB7185] hover:underline flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Review All Mistakes ({mistakeList.length})</span>
            </Link>
          )}
        </div>

        <MistakeCard mistakes={mistakeList} limit={6} />
      </section>

      {/* QUICK LAUNCH CURRICULUM LINKS */}
      <section className="p-8 rounded-3xl bg-[#240D16] border border-[#6E1835]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#F8FAFC]">Browse Full Character Dictionaries</h3>
          <p className="text-xs text-[#B8A9AF] mt-0.5">Explore stroke pronunciations, example vocabulary words, and kanji meanings.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/hiragana"
            className="px-4 py-2 rounded-xl bg-[#351522] hover:bg-[#3A1422] border border-[#6E1835] text-xs font-bold text-[#F8FAFC] hover:text-[#22D3EE] transition-colors"
          >
            Hiragana Grid
          </Link>
          <Link
            href="/katakana"
            className="px-4 py-2 rounded-xl bg-[#351522] hover:bg-[#3A1422] border border-[#6E1835] text-xs font-bold text-[#F8FAFC] hover:text-[#22D3EE] transition-colors"
          >
            Katakana Grid
          </Link>
          <Link
            href="/kanji"
            className="px-4 py-2 rounded-xl bg-[#351522] hover:bg-[#3A1422] border border-[#6E1835] text-xs font-bold text-[#F8FAFC] hover:text-[#22D3EE] transition-colors"
          >
            Kanji N5 Grid
          </Link>
        </div>
      </section>
    </div>
  );
}
