'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgress } from '@/context/ProgressContext';
import { useAuth } from '@/context/AuthContext';
import { XPBadge } from './XPBadge';
import { StreakBadge } from './StreakBadge';
import { AuthModal } from './AuthModal';
import { Menu, X, User, BookOpen, Compass, Layers, BarChart2, Home, Settings } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { stats } = useProgress();
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/learn', label: 'Learn', icon: BookOpen },
    { href: '/practice', label: 'Practice', icon: Compass },
    { href: '/kanji', label: 'Kanji', icon: Layers },
    { href: '/progress', label: 'Progress', icon: BarChart2 },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#240D16]/90 backdrop-blur-md border-b border-[#6E1835]/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6E1835] to-[#3A1422] border border-[#22D3EE]/30 flex items-center justify-center text-[#22D3EE] font-japanese font-bold text-xl shadow-[0_0_15px_rgba(34,211,238,0.2)] group-hover:border-[#22D3EE] transition-all">
              う
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#F8FAFC] font-japanese flex items-center gap-1">
                うんこ<span className="text-[#22D3EE] text-sm font-sans uppercase font-bold tracking-wider ml-1">Unko</span>
              </span>
              <span className="text-[10px] text-[#B8A9AF] font-japanese tracking-widest -mt-1">
                日本語学習プラットフォーム
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#351522]/80 p-1.5 rounded-full border border-[#6E1835]/40 shadow-inner">
            {navLinks.map(link => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#6E1835] text-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.2)] border border-[#22D3EE]/30'
                      : 'text-[#B8A9AF] hover:text-[#F8FAFC] hover:bg-[#3A1422]/60'
                  }`}
                >
                  <Icon size={15} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Area: Streak, XP, Profile */}
          <div className="hidden sm:flex items-center gap-3">
            <StreakBadge streak={stats.currentStreak} size="sm" />
            <XPBadge xp={stats.xp} size="sm" />

            <Link
              href="/settings"
              className={`p-2 rounded-xl border transition-all ${
                pathname === '/settings'
                  ? 'bg-[#6E1835] text-[#22D3EE] border-[#22D3EE]/40'
                  : 'bg-[#351522] text-[#B8A9AF] hover:text-[#F8FAFC] border-[#6E1835]/50 hover:border-[#22D3EE]/40'
              }`}
              title="Settings"
            >
              <Settings size={18} />
            </Link>

            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#351522] hover:bg-[#3A1422] border border-[#6E1835] hover:border-[#22D3EE]/40 text-[#F8FAFC] text-sm font-medium transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-[#6E1835] flex items-center justify-center text-xs text-[#22D3EE] font-bold">
                {user && !user.isAnonymous ? user.displayName?.charAt(0).toUpperCase() : <User size={14} />}
              </div>
              <span className="hidden lg:inline text-xs text-[#B8A9AF]">
                {user && !user.isAnonymous ? user.displayName?.split(' ')[0] : 'Guest'}
              </span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <XPBadge xp={stats.xp} size="sm" showLabel={false} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#351522] border border-[#6E1835] text-[#F8FAFC] hover:text-[#22D3EE] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-[#6E1835]/50 bg-[#240D16]/98 px-4 py-4 space-y-3 animate-in slide-in-from-top-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#6E1835]/40">
              <StreakBadge streak={stats.currentStreak} size="sm" />
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#351522] border border-[#6E1835] text-xs text-[#22D3EE]"
              >
                <User size={14} />
                <span>{user && !user.isAnonymous ? user.displayName : 'Guest Profile'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navLinks.map(link => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-[#6E1835] text-[#22D3EE] border border-[#22D3EE]/40 font-semibold'
                        : 'bg-[#351522] text-[#B8A9AF] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === '/settings'
                    ? 'bg-[#6E1835] text-[#22D3EE] border border-[#22D3EE]/40 font-semibold'
                    : 'bg-[#351522] text-[#B8A9AF] hover:text-[#F8FAFC]'
                }`}
              >
                <Settings size={16} />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
