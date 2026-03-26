'use client';

import React, { useState, useEffect } from 'react';
import { buildLeaderboard, type LeaderboardEntry } from '@/lib/leaderboard';
import { SUBJECT_META } from '@/lib/childProfile';

const MEDALS = ['🥇', '🥈', '🥉'];
const MEDAL_BG = ['bg-yellow-50 border-yellow-200', 'bg-gray-50 border-gray-200', 'bg-orange-50 border-orange-200'];

interface BreakdownModalProps {
  entry: LeaderboardEntry;
  onClose: () => void;
}

function BreakdownModal({ entry, onClose }: BreakdownModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border-2 border-purple-100 p-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200 bg-purple-50 flex items-center justify-center">
              {entry.photoUrl ? <img src={entry.photoUrl} alt={entry.displayName} className="w-full h-full object-cover" /> : <span className="text-2xl">{entry.emoji}</span>}
            </div>
            <h3 className="font-extrabold text-purple-800 text-lg">{entry.displayName}&apos;s Stats 📊</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold flex items-center justify-center">×</button>
        </div>
        <div className="flex gap-4 text-center">
          <div className="flex-1 bg-purple-50 rounded-2xl p-3">
            <p className="text-2xl font-extrabold text-purple-700">{entry.totalStars}</p>
            <p className="text-xs text-purple-500 font-bold">Total Stars</p>
          </div>
          <div className="flex-1 bg-orange-50 rounded-2xl p-3">
            <p className="text-2xl font-extrabold text-orange-600">{entry.currentStreak}</p>
            <p className="text-xs text-orange-500 font-bold">Day Streak</p>
          </div>
          <div className="flex-1 bg-green-50 rounded-2xl p-3">
            <p className="text-2xl font-extrabold text-green-600">{entry.perfectScores}</p>
            <p className="text-xs text-green-500 font-bold">Perfect</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {Object.entries(entry.subjectBreakdown).map(([subj, data]) => {
            const meta = SUBJECT_META[subj as keyof typeof SUBJECT_META];
            return (
              <div key={subj} className="flex items-center gap-2">
                <span className="text-lg">{meta?.emoji ?? '📚'}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-purple-700">{meta?.label ?? subj}</span>
                    <span className="text-xs text-purple-500">{data.activities} sessions · avg {data.avgScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" style={{ width: `${data.avgScore}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
          {Object.keys(entry.subjectBreakdown).length === 0 && (
            <p className="text-center text-sm text-purple-400 font-medium py-2">No activities yet this week!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [selected, setSelected] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    const load = () => setEntries(buildLeaderboard());
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  if (entries.length === 0) return null;

  return (
    <>
      <div className="w-full max-w-2xl mx-auto mt-8 px-4">
        <h2 className="text-xl font-extrabold text-purple-800 text-center mb-4">🏆 This Week&apos;s Stars</h2>

        {/* Desktop: podium layout */}
        <div className="hidden sm:flex items-end justify-center gap-4">
          {entries.length >= 2 && (
            <div className="flex flex-col items-center gap-2 mb-0">
              <EntryCard entry={entries[1]} onTap={() => setSelected(entries[1])} size="sm" />
              <div className="w-24 h-12 bg-gray-200 rounded-t-xl flex items-center justify-center text-gray-500 font-extrabold text-lg">2nd</div>
            </div>
          )}
          {entries.length >= 1 && (
            <div className="flex flex-col items-center gap-2 mb-0">
              <EntryCard entry={entries[0]} onTap={() => setSelected(entries[0])} size="lg" animate />
              <div className="w-24 h-20 bg-yellow-200 rounded-t-xl flex items-center justify-center text-yellow-700 font-extrabold text-lg">1st</div>
            </div>
          )}
          {entries.length >= 3 && (
            <div className="flex flex-col items-center gap-2 mb-0">
              <EntryCard entry={entries[2]} onTap={() => setSelected(entries[2])} size="sm" />
              <div className="w-24 h-8 bg-orange-200 rounded-t-xl flex items-center justify-center text-orange-600 font-extrabold text-lg">3rd</div>
            </div>
          )}
        </div>

        {/* Mobile: vertical list */}
        <div className="sm:hidden flex flex-col gap-3">
          {entries.map((entry) => (
            <button key={entry.childName} onClick={() => setSelected(entry)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${MEDAL_BG[entry.rank - 1]} transition-all active:scale-[0.98] text-left w-full`}>
              <span className="text-3xl">{MEDALS[entry.rank - 1]}</span>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow flex items-center justify-center bg-purple-50 flex-shrink-0">
                {entry.photoUrl ? <img src={entry.photoUrl} alt={entry.displayName} className="w-full h-full object-cover" /> : <span className="text-2xl">{entry.emoji}</span>}
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-purple-800">{entry.displayName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-yellow-500 text-sm font-bold">{'⭐'.repeat(Math.min(entry.weeklyStars, 5))}{entry.weeklyStars > 5 ? ` +${entry.weeklyStars - 5}` : ''}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-orange-500">🔥 {entry.currentStreak}d</p>
                <p className="text-xs text-purple-400">{entry.weeklyStars} stars</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      {selected && <BreakdownModal entry={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

interface EntryCardProps {
  entry: LeaderboardEntry;
  onTap: () => void;
  size: 'sm' | 'lg';
  animate?: boolean;
}

function EntryCard({ entry, onTap, size, animate }: EntryCardProps) {
  const avatarSize = size === 'lg' ? 'w-20 h-20' : 'w-16 h-16';
  return (
    <button onClick={onTap}
      className={`flex flex-col items-center gap-1 p-3 rounded-3xl border-2 ${MEDAL_BG[entry.rank - 1]} transition-all active:scale-95 hover:shadow-lg ${animate ? 'animate-bounce-slow' : ''}`}>
      <span className="text-2xl">{MEDALS[entry.rank - 1]}</span>
      <div className={`${avatarSize} rounded-full overflow-hidden border-4 border-white shadow-md flex items-center justify-center bg-purple-50`}>
        {entry.photoUrl ? <img src={entry.photoUrl} alt={entry.displayName} className="w-full h-full object-cover" /> : <span className={size === 'lg' ? 'text-4xl' : 'text-3xl'}>{entry.emoji}</span>}
      </div>
      <p className={`font-extrabold ${size === 'lg' ? 'text-base' : 'text-sm'} text-purple-800`}>{entry.displayName}</p>
      <p className="text-yellow-500 text-sm font-bold">
        {'⭐'.repeat(Math.min(entry.weeklyStars, 5))}{entry.weeklyStars > 5 ? `+${entry.weeklyStars - 5}` : ''}
      </p>
      <p className="text-xs font-bold text-orange-500">🔥 {entry.currentStreak} day{entry.currentStreak !== 1 ? 's' : ''}</p>
    </button>
  );
}
