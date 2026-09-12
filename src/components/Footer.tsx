'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-[#19080F] border-t border-[#6E1835]/40 text-[#B8A9AF] text-sm py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand column */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6E1835] border border-[#22D3EE]/40 flex items-center justify-center text-[#22D3EE] font-japanese font-bold text-base shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              う
            </div>
            <span className="text-base font-bold tracking-tight text-[#F8FAFC] font-japanese">
              うんこ<span className="text-[#22D3EE] font-sans ml-1 text-xs uppercase font-bold">Unko</span>
            </span>
          </div>
          <p className="text-xs text-[#8E7A83] max-w-sm leading-relaxed">
            Master Japanese one character at a time. A dedicated, dark-themed platform designed for structured, distraction-free learning of Hiragana, Katakana, and JLPT N5 Kanji.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#22D3EE]/80">
            <span className="inline-block w-2 h-2 rounded-full bg-[#4ADE80] animate-ping" />
            <span>Dual storage ready: Local Guest Mode & Firebase Cloud Sync</span>
          </div>
        </div>

        {/* Learning Paths */}
        <div>
          <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-3">
            Core Curriculum
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/hiragana" className="hover:text-[#22D3EE] transition-colors">
                Hiragana (ひらがな 46)
              </Link>
            </li>
            <li>
              <Link href="/katakana" className="hover:text-[#22D3EE] transition-colors">
                Katakana (カタカナ 46)
              </Link>
            </li>
            <li>
              <Link href="/kanji" className="hover:text-[#22D3EE] transition-colors">
                JLPT N5 Kanji (漢字)
              </Link>
            </li>
            <li>
              <Link href="/practice" className="hover:text-[#22D3EE] transition-colors">
                Interactive Practice Engine
              </Link>
            </li>
          </ul>
        </div>

        {/* Progress & Tools */}
        <div>
          <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider mb-3">
            Analytics & System
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/dashboard" className="hover:text-[#22D3EE] transition-colors">
                Personal Dashboard
              </Link>
            </li>
            <li>
              <Link href="/progress" className="hover:text-[#22D3EE] transition-colors">
                Mastery & Accuracy Stats
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-[#22D3EE] transition-colors">
                Achievements & Profile
              </Link>
            </li>
            <li>
              <Link href="/settings" className="hover:text-[#22D3EE] transition-colors">
                Audio & Preferences
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-[#3A1422]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8E7A83]">
        <p>© {new Date().getFullYear()} うんこ (Unko Japanese). Built with precision for Japanese language learners.</p>
        <div className="flex items-center gap-4">
          <span className="text-[#67E8F9]">Maroon × Cyan Dark Aesthetic</span>
          <span>•</span>
          <span className="font-japanese">一期一会 (Once in a lifetime)</span>
        </div>
      </div>
    </footer>
  );
}
