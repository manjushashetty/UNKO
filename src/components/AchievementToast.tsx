'use client';

import React, { useEffect } from 'react';
import { useProgress } from '@/context/ProgressContext';
import { Award, X, Sparkles } from 'lucide-react';

export function AchievementToast() {
  const { recentlyUnlocked, dismissAchievement } = useProgress();

  useEffect(() => {
    if (recentlyUnlocked) {
      const timer = setTimeout(() => {
        dismissAchievement();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [recentlyUnlocked, dismissAchievement]);

  if (!recentlyUnlocked) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#351522] border border-[#22D3EE] rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.3)] p-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-[#22D3EE]/20 text-[#22D3EE] shrink-0 animate-bounce">
          <Award size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#22D3EE] uppercase tracking-wider">
            <Sparkles size={12} />
            Achievement Unlocked!
          </div>
          <h4 className="text-base font-bold text-[#F8FAFC] mt-0.5">{recentlyUnlocked.title}</h4>
          <p className="text-xs text-[#B8A9AF] mt-1">{recentlyUnlocked.description}</p>
        </div>
        <button
          onClick={dismissAchievement}
          className="text-[#8E7A83] hover:text-[#F8FAFC] p-1 rounded-lg transition-colors"
          aria-label="Dismiss achievement"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
