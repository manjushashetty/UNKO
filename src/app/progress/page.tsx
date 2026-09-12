'use client';

import React from 'react';
import Link from 'next/link';
import { useProgress } from '@/context/ProgressContext';
import { StatCard } from '@/components/StatCard';
import { ProgressBar } from '@/components/ProgressBar';
import {
  BarChart2,
  Zap,
  Flame,
  Target,
  CheckCircle2,
  Clock,
  History,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function ProgressPage() {
  const { stats, quizResults, learnedIds, mistakes } = useProgress();

  const accuracy =
    stats.totalQuestionsAnswered > 0
      ? Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100)
      : 0;

  // Script learned counts
  const hLearned = learnedIds.filter(id => id.startsWith('h-')).length;
  const kLearned = learnedIds.filter(id => id.startsWith('k-') && !id.startsWith('k-n5') && !id.startsWith('k-n4')).length;
  const kjN5Learned = learnedIds.filter(id => id.startsWith('k-n5')).length;
  const kjN4Learned = learnedIds.filter(id => id.startsWith('k-n4')).length;

  const totalLearned = hLearned + kLearned + kjN5Learned + kjN4Learned;
  const totalAvailable = 46 + 46 + 50 + 50; // 192 basic items

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#6E1835]/50">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#22D3EE] uppercase tracking-wider mb-1">
            <BarChart2 size={14} />
            <span>Learning Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC]">
            Progress & Mastery
          </h1>
          <p className="text-sm text-[#B8A9AF] mt-1 max-w-xl">
            Detailed tracking of all your practice sessions, streak momentum, and character mastery across Hiragana, Katakana, and JLPT N5/N4 Kanji.
          </p>
        </div>

        <Link
          href="/practice"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#22D3EE] hover:bg-[#67E8F9] text-[#240D16] font-bold text-xs shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all shrink-0 self-start sm:self-auto"
        >
          <Sparkles size={16} />
          <span>Launch Practice</span>
        </Link>
      </div>

      {/* CORE STATS TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Questions"
          value={stats.totalQuestionsAnswered}
          subtitle={`${stats.totalCorrectAnswers} answered correctly`}
          icon={Target}
          iconColor="text-[#22D3EE]"
        />
        <StatCard
          title="Overall Accuracy"
          value={`${accuracy}%`}
          subtitle={accuracy >= 80 ? 'Mastery Level' : 'Developing Recall'}
          icon={CheckCircle2}
          iconColor="text-[#4ADE80]"
        />
        <StatCard
          title="Streak Momentum"
          value={`${stats.currentStreak} Days`}
          subtitle={`Personal record: ${stats.longestStreak} days`}
          icon={Flame}
          iconColor="text-amber-400"
        />
        <StatCard
          title="Accumulated XP"
          value={stats.xp.toLocaleString()}
          subtitle="Experience points earned"
          icon={Zap}
          iconColor="text-[#67E8F9]"
        />
      </div>

      {/* SCRIPT PROGRESS BREAKDOWN (Requirement 15) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#351522] border border-[#6E1835] shadow-[0_4px_25px_rgba(0,0,0,0.3)] space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-[#6E1835]/40">
          <div>
            <h3 className="text-xl font-bold text-[#F8FAFC]">Curriculum Breakdown</h3>
            <p className="text-xs text-[#8E7A83]">Completion percentages by script and JLPT category</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#240D16] border border-[#6E1835] text-[#22D3EE]">
            {totalLearned} of {totalAvailable} characters marked as learned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Hiragana Progress Card */}
          <div className="p-5 rounded-2xl bg-[#240D16] border border-[#6E1835]/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#6E1835] text-[#22D3EE] font-japanese font-bold flex items-center justify-center text-lg shadow-inner">
                  あ
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8FAFC]">Hiragana</h4>
                  <p className="text-[11px] text-[#8E7A83]">46 Gojūon Basic</p>
                </div>
              </div>
              <span className="text-lg font-bold text-[#22D3EE]">
                {Math.round((hLearned / 46) * 100)}%
              </span>
            </div>

            <ProgressBar current={hLearned} total={46} height="sm" />

            <div className="flex items-center justify-between text-xs text-[#B8A9AF] pt-1">
              <span>{hLearned} / 46 Learned</span>
              <Link href="/hiragana" className="text-[#22D3EE] hover:underline">
                View All →
              </Link>
            </div>
          </div>

          {/* Katakana Progress Card */}
          <div className="p-5 rounded-2xl bg-[#240D16] border border-[#6E1835]/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#6E1835] text-[#67E8F9] font-japanese font-bold flex items-center justify-center text-lg shadow-inner">
                  ア
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8FAFC]">Katakana</h4>
                  <p className="text-[11px] text-[#8E7A83]">46 Loanword Basic</p>
                </div>
              </div>
              <span className="text-lg font-bold text-[#67E8F9]">
                {Math.round((kLearned / 46) * 100)}%
              </span>
            </div>

            <ProgressBar current={kLearned} total={46} height="sm" />

            <div className="flex items-center justify-between text-xs text-[#B8A9AF] pt-1">
              <span>{kLearned} / 46 Learned</span>
              <Link href="/katakana" className="text-[#67E8F9] hover:underline">
                View All →
              </Link>
            </div>
          </div>

          {/* Kanji N5 Progress Card */}
          <div className="p-5 rounded-2xl bg-[#240D16] border border-[#6E1835]/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#6E1835] text-[#FB7185] font-japanese font-bold flex items-center justify-center text-lg shadow-inner">
                  日
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8FAFC]">Kanji N5</h4>
                  <p className="text-[11px] text-[#8E7A83]">50 Core JLPT N5</p>
                </div>
              </div>
              <span className="text-lg font-bold text-[#FB7185]">
                {Math.round((kjN5Learned / 50) * 100)}%
              </span>
            </div>

            <ProgressBar current={kjN5Learned} total={50} height="sm" />

            <div className="flex items-center justify-between text-xs text-[#B8A9AF] pt-1">
              <span>{kjN5Learned} / 50 Learned</span>
              <Link href="/kanji" className="text-[#FB7185] hover:underline">
                View All →
              </Link>
            </div>
          </div>

          {/* Kanji N4 Progress Card */}
          <div className="p-5 rounded-2xl bg-[#240D16] border border-[#6E1835]/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#6E1835] text-amber-400 font-japanese font-bold flex items-center justify-center text-lg shadow-inner">
                  会
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8FAFC]">Kanji N4</h4>
                  <p className="text-[11px] text-[#8E7A83]">50 Essential JLPT N4</p>
                </div>
              </div>
              <span className="text-lg font-bold text-amber-400">
                {Math.round((kjN4Learned / 50) * 100)}%
              </span>
            </div>

            <ProgressBar current={kjN4Learned} total={50} height="sm" />

            <div className="flex items-center justify-between text-xs text-[#B8A9AF] pt-1">
              <span>{kjN4Learned} / 50 Learned</span>
              <Link href="/kanji" className="text-amber-400 hover:underline">
                View All →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRACTICE SESSION HISTORY */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#351522] border border-[#6E1835] shadow-[0_4px_25px_rgba(0,0,0,0.3)] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={18} className="text-[#22D3EE]" />
            <h3 className="text-lg font-bold text-[#F8FAFC]">Recent Practice Sessions</h3>
          </div>
          <span className="text-xs text-[#8E7A83]">
            Showing last {Math.min(10, quizResults.length)} sessions
          </span>
        </div>

        {quizResults.length === 0 ? (
          <div className="text-center py-12 bg-[#240D16] rounded-2xl border border-[#6E1835]/40 space-y-3">
            <Clock size={32} className="mx-auto text-[#8E7A83]" />
            <h4 className="text-sm font-bold text-[#F8FAFC]">No Practice Sessions Recorded Yet</h4>
            <p className="text-xs text-[#B8A9AF] max-w-sm mx-auto">
              Complete your first 10-question quiz to start charting your accuracy and speed.
            </p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6E1835] text-[#22D3EE] font-semibold text-xs hover:bg-[#8D2246] transition-colors"
            >
              <span>Start First Quiz</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#6E1835]/50 text-[#8E7A83] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Accuracy</th>
                  <th className="pb-3 font-semibold">XP Earned</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#6E1835]/30">
                {quizResults.slice(0, 10).map((q, idx) => (
                  <tr key={idx} className="hover:bg-[#240D16]/50 transition-colors">
                    <td className="py-3 font-semibold capitalize text-[#F8FAFC] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#22D3EE]" />
                      {q.category} {q.subCategory ? `(${q.subCategory})` : ''}
                    </td>
                    <td className="py-3 text-[#B8A9AF]">
                      {q.score} / {q.totalQuestions}
                    </td>
                    <td className="py-3">
                      <span
                        className={`font-bold ${
                          q.accuracy >= 80
                            ? 'text-[#4ADE80]'
                            : q.accuracy >= 50
                            ? 'text-[#22D3EE]'
                            : 'text-[#FB7185]'
                        }`}
                      >
                        {q.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 text-[#4ADE80] font-semibold">+{q.xpEarned} XP</td>
                    <td className="py-3 text-[#8E7A83]">{q.durationSeconds}s</td>
                    <td className="py-3 text-[#8E7A83]">
                      {new Date(q.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
