'use client';

import React, { useState } from 'react';
import { useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { Volume2, RotateCcw, Cloud, ShieldAlert, Sparkles, Sliders } from 'lucide-react';
import { playJapaneseAudio, soundFX } from '@/lib/audio';

export default function SettingsPage() {
  const { isFirebaseAvailable } = useAuth();
  const { resetAllData } = useProgress();
  const [testSuccess, setTestSuccess] = useState(false);

  const handleTestAudio = () => {
    playJapaneseAudio('はじめまして、うんこへようこそ！');
    soundFX.playCorrect();
    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all stored progress, streaks, and mistake records? This action cannot be undone.')) {
      resetAllData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-[#6E1835]/50">
        <div className="flex items-center gap-2 text-xs font-bold text-[#22D3EE] uppercase tracking-wider mb-1">
          <Sliders size={14} />
          <span>System & Experience</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC]">
          Preferences & Settings
        </h1>
        <p className="text-sm text-[#B8A9AF] mt-1">
          Customize speech synthesis, audio effects, and data persistence modes.
        </p>
      </div>

      <div className="space-y-6">
        {/* AUDIO SETTINGS */}
        <section className="p-6 rounded-3xl bg-[#351522] border border-[#6E1835] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#240D16] border border-[#6E1835] text-[#22D3EE] flex items-center justify-center">
              <Volume2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Japanese Audio Pronunciation</h3>
              <p className="text-xs text-[#8E7A83]">Built-in browser Speech Synthesis (ja-JP) & Web Audio Effects</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-[#B8A9AF] max-w-md">
              Test your browser&apos;s Japanese text-to-speech engine and sound synthesis. If you hear no sound, check your device output or volume settings.
            </p>
            <button
              onClick={handleTestAudio}
              className="px-5 py-2.5 rounded-xl bg-[#6E1835] hover:bg-[#8D2246] border border-[#22D3EE]/40 text-[#22D3EE] font-semibold text-xs flex items-center gap-2 transition-all shadow-[0_0_12px_rgba(34,211,238,0.2)] shrink-0"
            >
              <Volume2 size={15} />
              <span>{testSuccess ? 'Speaking...' : 'Test Japanese Voice'}</span>
            </button>
          </div>
        </section>

        {/* FIREBASE & CLOUD SYNC */}
        <section className="p-6 rounded-3xl bg-[#351522] border border-[#6E1835] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#240D16] border border-[#6E1835] text-[#22D3EE] flex items-center justify-center">
              <Cloud size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Cloud Synchronization</h3>
              <p className="text-xs text-[#8E7A83]">Firebase Authentication & Cloud Firestore</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#240D16] border border-[#6E1835]/60 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isFirebaseAvailable ? 'bg-[#4ADE80]' : 'bg-amber-400'}`} />
              <span className="font-semibold text-[#F8FAFC]">
                Status: {isFirebaseAvailable ? 'Firebase Cloud Connected' : 'Guest Mode Active (Offline Storage)'}
              </span>
            </div>
            <p className="text-[#B8A9AF] leading-relaxed">
              {isFirebaseAvailable
                ? 'Your learning data, quiz history, and streak are backed up to Firebase Firestore.'
                : 'All your character masteries, mistakes, XP, and streaks are safely persisted locally in your browser storage. You can configure Firebase environment variables (.env.local) anytime to enable cross-device cloud sync.'}
            </p>
          </div>
        </section>

        {/* DATA MANAGEMENT */}
        <section className="p-6 rounded-3xl bg-[#351522] border border-[#6E1835] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#240D16] border border-[#6E1835] text-[#FB7185] flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Data & Progress Reset</h3>
              <p className="text-xs text-[#8E7A83]">Clear local cache or start fresh</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-[#B8A9AF] max-w-md">
              Permanently reset your XP, streaks, completed quizzes, and character masteries back to zero.
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-[#240D16] hover:bg-[#3A1422] border border-[#FB7185]/40 text-[#FB7185] hover:text-white font-semibold text-xs flex items-center gap-2 transition-all shrink-0"
            >
              <RotateCcw size={15} />
              <span>Reset All Progress</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
