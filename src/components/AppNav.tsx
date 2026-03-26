'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';

const NAV_ITEMS = [
  { href: '/subjects',   emoji: '📚', label: 'Subjects'   },
  { href: '/lab',        emoji: '🧪', label: 'Lab'        },
  { href: '/assessment', emoji: '📝', label: 'Assessment' },
  { href: '/parent',     emoji: '👨‍👩‍👧', label: 'Parent'    },
];

export default function AppNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [labUnlocked, setLabUnlocked] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLabUnlocked(sessionStorage.getItem('kkz_lab_unlocked') === 'true');
  }, []);

  return (
    <>
      {/* ── Desktop top bar ─────────────────────────────────── */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-sm border-b-2 border-purple-100 shadow-sm sticky top-0 z-40">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <AppLogo size={44} />
          <span className="font-extrabold text-2xl text-purple-700 tracking-tight">
            KKZ Learning Hub
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-3">
          {NAV_ITEMS?.map((item) => {
            const isActive = mounted && pathname === item?.href;
            const isLab = item.href === '/lab';
            return (
              <Link
                key={item?.href}
                href={item?.href}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base transition-all duration-150
                  ${isActive
                    ? 'bg-orange-400 text-white shadow-md scale-105'
                    : 'text-purple-600 hover:bg-purple-50 hover:text-purple-800'
                  }`}
              >
                <span className="text-xl relative">
                  {item?.emoji}
                  {isLab && mounted && !labUnlocked && (
                    <span className="absolute -top-1 -right-1 text-xs leading-none">🔒</span>
                  )}
                </span>
                <span>{item?.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="w-36" />
      </header>

      {/* ── Mobile bottom tab bar ────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t-2 border-purple-100 shadow-[0_-4px_20px_rgba(167,139,250,0.2)]">
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {NAV_ITEMS?.map((item) => {
            const isActive = mounted && pathname === item?.href;
            const isLab = item.href === '/lab';
            return (
              <Link
                key={item?.href}
                href={item?.href}
                className={`nav-tab ${isActive ? 'active' : 'inactive'}`}
              >
                <span className="text-2xl leading-none relative">
                  {item?.emoji}
                  {isLab && mounted && !labUnlocked && (
                    <span className="absolute -top-1 -right-1 text-xs leading-none">🔒</span>
                  )}
                </span>
                <span className={`text-xs font-extrabold ${isActive ? 'text-white' : 'text-purple-500'}`}>
                  {item?.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
