'use client';

import React, { useState } from 'react';
import { useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { AchievementCard } from '@/components/AchievementCard';
import { StatCard } from '@/components/StatCard';
import { AuthModal } from '@/components/AuthModal';
import {
  User,
  Zap,
  Flame,
  Target,
  Award,
  BookOpen,
  Calendar,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logOut } = useAuth();
  const { stats, achievements, learnedIds } = useProgress();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const accuracy =
    stats.totalQuestionsAnswered > 0
      ? Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100)
      : 0;

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header Hero */}
      <div className="p-8 rounded-3xl bg-[#351522] border border-[#6E1835] shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6E1835] to-[#240D16] border-2 border-[#22D3EE]/50 flex items-center justify-center text-[#22D3EE] font-bold text-3xl shadow-[0_0_20px_rgba(34,211,238,0.25)]">
            {user && !user.isAnonymous ? user.displayName?.charAt(0).toUpperCase() : <User size={36} />}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
                {user && !user.isAnonymous ? user.displayName : 'Guest Scholar'}
              </h1>
              {user && !user.isAnonymous && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/40">
                  Firebase Sync
                </span>
              )}
            </div>
            <p className="text-xs text-[#B8A9AF] font-mono">{user?.email || 'learner@nihongoflow.local'}</p>
            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-[#8E7A83] pt-1">
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                <span>Joined {new Date(user?.joinedDate || Date.now()).toLocaleDateString()}</span>
              </span>
              <span>•</span>
              <span className="text-[#22D3EE] font-medium">Rank: Student Apprentice</span>
            </div>
          </div>
        </div>

        {/* Auth CTA */}
        <div className="flex items-center gap-3">
          {user && !user.isAnonymous ? (
            <button
              onClick={() => logOut()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#240D16] border border-[#6E1835] hover:border-[#FB7185] text-xs font-semibold text-[#FB7185] transition-colors"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22D3EE] hover:bg-[#67E8F9] text-[#240D16] text-xs font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
            >
              <Sparkles size={15} />
              <span>Connect Account</span>
            </button>
          )}
        </div>
      </div>

      {/* CORE STATS TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Experience"
          value={stats.xp.toLocaleString()}
          subtitle="XP earned across all modes"
          icon={Zap}
          iconColor="text-[#22D3EE]"
        />
        <StatCard
          title="Current Streak"
          value={`${stats.currentStreak} Days`}
          subtitle={`Longest: ${stats.longestStreak} days`}
          icon={Flame}
          iconColor="text-amber-400"
        />
        <StatCard
          title="Accuracy"
          value={`${accuracy}%`}
          subtitle={`${stats.totalCorrectAnswers} of ${stats.totalQuestionsAnswered} correct`}
          icon={Target}
          iconColor="text-[#4ADE80]"
        />
        <StatCard
          title="Characters Learned"
          value={learnedIds.length}
          subtitle="Total saved to memory"
          icon={BookOpen}
          iconColor="text-[#67E8F9]"
        />
      </div>

      {/* ACHIEVEMENTS GALLERY (Requirement 14 & 16) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-[#6E1835]/50">
          <div>
            <div className="flex items-center gap-2">
              <Award size={20} className="text-[#22D3EE]" />
              <h2 className="text-xl font-bold text-[#F8FAFC]">Achievements Gallery</h2>
            </div>
            <p className="text-xs text-[#8E7A83]">Milestones celebrating your dedication to Japanese</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#351522] border border-[#22D3EE]/40 text-[#22D3EE]">
            {unlockedCount} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(ach => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
      </section>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
