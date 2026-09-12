'use client';

import React from 'react';
import { Achievement } from '@/types';
import { Award, Zap, Flame, BookOpen, Crown, Compass, Shield, Layers, CheckCircle2, Sparkles } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const isUnlocked = Boolean(achievement.unlockedAt);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return Sparkles;
      case 'Zap':
        return Zap;
      case 'Flame':
        return Flame;
      case 'BookOpen':
        return BookOpen;
      case 'Crown':
        return Crown;
      case 'Compass':
        return Compass;
      case 'Shield':
        return Shield;
      case 'Layers':
        return Layers;
      case 'CheckCircle2':
        return CheckCircle2;
      default:
        return Award;
    }
  };

  const Icon = getIcon(achievement.icon);

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        isUnlocked
          ? 'bg-[#351522] border-[#22D3EE]/50 shadow-[0_0_15px_rgba(34,211,238,0.15)]'
          : 'bg-[#240D16]/60 border-[#6E1835]/40 opacity-75'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            isUnlocked
              ? 'bg-[#6E1835] text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.3)]'
              : 'bg-[#351522] text-[#8E7A83]'
          }`}
        >
          <Icon size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[#F8FAFC] truncate">
              {achievement.title}
            </h4>
            {isUnlocked ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4ADE80]/20 text-[#4ADE80] shrink-0">
                Unlocked
              </span>
            ) : (
              <span className="text-[10px] text-[#8E7A83] shrink-0">
                {achievement.currentValue} / {achievement.threshold}
              </span>
            )}
          </div>
          <p className="text-xs text-[#B8A9AF] mt-0.5 line-clamp-2">
            {achievement.description}
          </p>

          {/* Progress bar if not unlocked */}
          {!isUnlocked && (
            <div className="mt-2 w-full h-1.5 rounded-full bg-[#351522] overflow-hidden">
              <div
                className="h-full bg-[#22D3EE]/60 rounded-full transition-all duration-300"
                style={{ width: `${achievement.progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
