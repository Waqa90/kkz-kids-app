'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getQuizResultsAsync, clearQuizResultsAsync, type QuizResult } from '@/lib/quizResults';
import { getFillInBlanksResultsAsync, clearFillInBlanksResultsAsync, type FillInBlanksResult } from '@/lib/fillInBlanksResults';
import { getWordMatchResultsAsync, clearWordMatchResultsAsync, type WordMatchResult } from '@/lib/wordMatchResults';
import { getRhymeMatchResultsAsync, clearRhymeMatchResultsAsync, type RhymeMatchResult } from '@/lib/rhymeMatchResults';
import { getOppositeWordsResultsAsync, clearOppositeWordsResultsAsync, type OppositeWordsResult } from '@/lib/oppositeWordsResults';
import { getNounVerbAdjectiveResultsAsync, clearNounVerbAdjectiveResultsAsync, type NounVerbAdjectiveResult } from '@/lib/nounVerbAdjectiveResults';
import { getMathsResultsAsync, clearMathsResultsAsync, type MathsResult } from '@/lib/mathsResults';
import { getSubjectResultsAsync, clearSubjectResultsAsync, type SubjectResult } from '@/lib/subjectResults';
import Link from 'next/link';
import AIRecommendations from './components/AIRecommendations';
import { type ActivityResult } from './components/AIRecommendations';
import ReportDownload, { type ReportRow } from './components/ReportDownload';
import SettingsPanel, { loadParentSettings } from './components/SettingsPanel';
import { STORIES } from '@/lib/stories';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DEFAULT_VISIBLE_ROWS = 5;
const AUTO_REFRESH_INTERVAL = 2 * 60 * 1000; // 2 minutes

type ActivityType = 'Questions' | 'Fill in the Blanks' | 'Word Match' | 'Rhyme Match' | 'Opposites' | 'Word Sort' | 'Maths' | 'Subject';

interface ActivityRow {
  id: string;
  storyTitle: string;
  childName?: string;
  subject: string;
  activity: ActivityType;
  score: number;
  total: number;
  attempts?: number;
  dateTime: string;
  level?: string;
  levelColor?: string;
}

function getStoryLevel(storyTitle: string): { level: string; levelColor: string } {
  const story = STORIES.find((s) => s.title === storyTitle);
  return story ? { level: story.level, levelColor: story.levelColor } : { level: '—', levelColor: 'bg-gray-100 text-gray-500' };
}

function quizToRow(r: QuizResult): ActivityRow {
  const { level, levelColor } = getStoryLevel(r.storyTitle);
  return { id: r.id, storyTitle: r.storyTitle, childName: r.childName, subject: 'English', activity: 'Questions', score: r.score, total: r.total, dateTime: r.dateTime, level, levelColor };
}

function fillToRow(r: FillInBlanksResult): ActivityRow {
  const { level, levelColor } = getStoryLevel(r.storyTitle);
  return { id: r.id, storyTitle: r.storyTitle, childName: r.childName, subject: 'English', activity: 'Fill in the Blanks', score: r.score, total: r.total, dateTime: r.dateTime, level, levelColor };
}

function wordMatchToRow(r: WordMatchResult): ActivityRow {
  const { level, levelColor } = getStoryLevel(r.storyTitle);
  return { id: r.id, storyTitle: r.storyTitle, childName: r.childName, subject: 'English', activity: 'Word Match', score: r.score, total: r.total, attempts: r.attempts, dateTime: r.dateTime, level, levelColor };
}

function rhymeMatchToRow(r: RhymeMatchResult): ActivityRow {
  const { level, levelColor } = getStoryLevel(r.storyTitle);
  return { id: r.id, storyTitle: r.storyTitle, childName: r.childName, subject: 'English', activity: 'Rhyme Match', score: r.score, total: r.total, attempts: r.attempts, dateTime: r.dateTime, level, levelColor };
}

function oppositeWordsToRow(r: OppositeWordsResult): ActivityRow {
  const { level, levelColor } = getStoryLevel(r.storyTitle);
  return { id: r.id, storyTitle: r.storyTitle, childName: r.childName, subject: 'English', activity: 'Opposites', score: r.score, total: r.total, attempts: r.attempts, dateTime: r.dateTime, level, levelColor };
}

function nounVerbAdjectiveToRow(r: NounVerbAdjectiveResult): ActivityRow {
  const { level, levelColor } = getStoryLevel(r.storyTitle);
  return { id: r.id, storyTitle: r.storyTitle, childName: r.childName, subject: 'English', activity: 'Word Sort', score: r.score, total: r.total, attempts: r.attempts, dateTime: r.dateTime, level, levelColor };
}

function mathsToRow(r: MathsResult): ActivityRow {
  return { id: r.id, storyTitle: r.mathsSetTitle, childName: r.childName, subject: 'Maths', activity: 'Maths', score: r.score, total: r.total, dateTime: r.dateTime, level: `Class ${r.class}`, levelColor: 'bg-green-100 text-green-700' };
}

function subjectToRow(r: SubjectResult): ActivityRow {
  return { id: r.id, storyTitle: r.activityTitle, childName: r.childName, subject: r.subject.charAt(0).toUpperCase() + r.subject.slice(1).replace('-', ' '), activity: 'Subject', score: r.score, total: r.total, dateTime: r.dateTime, level: `${r.subject} C${r.class}`, levelColor: 'bg-blue-100 text-blue-700' };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateTime(iso: string): string {
  try {
    let d = new Date(iso);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function getScoreColor(score: number, total: number): string {
  const pct = total > 0 ? score / total : 0;
  if (pct >= 0.8) return 'text-green-700 bg-green-100';
  if (pct >= 0.5) return 'text-yellow-700 bg-yellow-100';
  return 'text-red-700 bg-red-100';
}

function getActivityBadgeColor(activity: ActivityType): string {
  switch (activity) {
    case 'Questions': return 'bg-purple-100 text-purple-700';
    case 'Fill in the Blanks': return 'bg-teal-100 text-teal-700';
    case 'Word Match': return 'bg-violet-100 text-violet-700';
    case 'Rhyme Match': return 'bg-pink-100 text-pink-700';
    case 'Opposites': return 'bg-amber-100 text-amber-700';
    case 'Word Sort': return 'bg-indigo-100 text-indigo-700';
    default: return 'bg-gray-100 text-gray-600';
  }
}

// ── Chart helpers ─────────────────────────────────────────────────────────────

const CHILD_COLORS: Record<string, string> = {
  Kitty: '#a855f7',
  Karawa: '#f97316',
  Zech: '#22c55e',
  Unknown: '#94a3b8',
};

interface ChartDataPoint {
  date: string;
  [childName: string]: number | string;
}

function buildChartData(rows: ActivityRow[]): { data: ChartDataPoint[]; children: string[] } {
  const childSet = new Set<string>();
  const dateMap: Record<string, Record<string, number>> = {};

  rows.forEach((r) => {
    const child = r.childName || 'Unknown';
    childSet.add(child);
    const dateKey = new Date(r.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!dateMap[dateKey]) dateMap[dateKey] = {};
    const points = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
    dateMap[dateKey][child] = (dateMap[dateKey][child] || 0) + points;
  });

  // Build full March scaffold (Mar 1 – Mar 31)
  const marchDays: string[] = [];
  for (let d = 1; d <= 31; d++) {
    const date = new Date(2026, 2, d); // month index 2 = March
    marchDays.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }

  const data: ChartDataPoint[] = marchDays.map((date) => ({
    date,
    ...(dateMap[date] || {}),
  }));

  // If no rows at all, still return the scaffold with no children
  const children = rows.length === 0 ? [] : Array.from(childSet);

  return { data, children };
}

// ── Period stats helpers ──────────────────────────────────────────────────────

interface PeriodStat {
  child: string;
  attempts: number;
  avgScore: number;
  perfectScores: number;
}

function buildPeriodStats(rows: ActivityRow[], days: number): PeriodStat[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const filtered = rows.filter((r) => new Date(r.dateTime) >= cutoff);
  const childMap: Record<string, { total: number; scoreSum: number; perfect: number }> = {};

  filtered.forEach((r) => {
    const child = r.childName || 'Unknown';
    if (!childMap[child]) childMap[child] = { total: 0, scoreSum: 0, perfect: 0 };
    childMap[child].total += 1;
    const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
    childMap[child].scoreSum += pct;
    if (pct === 100) childMap[child].perfect += 1;
  });

  return Object.entries(childMap).map(([child, s]) => ({
    child,
    attempts: s.total,
    avgScore: s.total > 0 ? Math.round(s.scoreSum / s.total) : 0,
    perfectScores: s.perfect,
  }));
}

// ── Filter state ──────────────────────────────────────────────────────────────

interface TableFilters {
  child: string;
  activity: string;
  level: string;
  subject: string;
}

const DEFAULT_FILTERS: TableFilters = { child: '', activity: '', level: '', subject: '' };

// ── Component ─────────────────────────────────────────────────────────────────

export default function ParentPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(() => loadParentSettings());

  // Filter & view state
  const [filters, setFilters] = useState<TableFilters>(DEFAULT_FILTERS);
  const [showAll, setShowAll] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Dynamic child photos and emojis from settings
  const CHILD_PHOTOS: Record<string, string> = React.useMemo(() => {
    const photos: Record<string, string> = {};
    Object.entries(currentSettings.children).forEach(([key, child]) => {
      if (child.photoUrl) photos[key] = child.photoUrl;
    });
    return photos;
  }, [currentSettings]);

  const CHILD_EMOJIS: Record<string, string> = React.useMemo(() => {
    const emojis: Record<string, string> = {};
    Object.entries(currentSettings.children).forEach(([key, child]) => {
      emojis[key] = child.emoji;
    });
    return emojis;
  }, [currentSettings]);

  const CHILD_NAMES_DISPLAY: Record<string, string> = React.useMemo(() => {
    const names: Record<string, string> = {};
    Object.entries(currentSettings.children).forEach(([key, child]) => {
      names[key] = child.name;
    });
    return names;
  }, [currentSettings]);

  const allActivityResults: ActivityResult[] = rows
    .filter((r) => r.childName)
    .map((r) => ({
      id: r.id,
      storyTitle: r.storyTitle,
      childName: r.childName,
      activity: r.activity,
      score: r.score,
      total: r.total,
      attempts: r.attempts,
      dateTime: r.dateTime,
    }));

  const allReportRows: ReportRow[] = rows.map((r) => ({
    id: r.id,
    storyTitle: r.storyTitle,
    childName: r.childName,
    subject: r.subject,
    activity: r.activity,
    score: r.score,
    total: r.total,
    dateTime: r.dateTime,
    level: r.level,
  }));

  const loadResults = useCallback(async () => {
    setLoadingResults(true);
    try {
      const [quiz, fill, wordMatch, rhymeMatch, opposites, wordSort, mathsData, subjectData] = await Promise.all([
        getQuizResultsAsync(),
        getFillInBlanksResultsAsync(),
        getWordMatchResultsAsync(),
        getRhymeMatchResultsAsync(),
        getOppositeWordsResultsAsync(),
        getNounVerbAdjectiveResultsAsync(),
        getMathsResultsAsync(),
        getSubjectResultsAsync(),
      ]);
      const merged: ActivityRow[] = [
        ...quiz.map(quizToRow),
        ...fill.map(fillToRow),
        ...wordMatch.map(wordMatchToRow),
        ...rhymeMatch.map(rhymeMatchToRow),
        ...opposites.map(oppositeWordsToRow),
        ...wordSort.map(nounVerbAdjectiveToRow),
        ...mathsData.map(mathsToRow),
        ...subjectData.map(subjectToRow),
      ].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
      setRows(merged);
      setLastRefreshed(new Date());
    } finally {
      setLoadingResults(false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      loadResults();
      const interval = setInterval(() => {
        loadResults();
      }, AUTO_REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [loggedIn, loadResults]);

  // Derive unique filter options from rows
  const childOptions = Array.from(new Set(rows.map((r) => r.childName).filter(Boolean))) as string[];
  const activityOptions = Array.from(new Set(rows.map((r) => r.activity)));
  const levelOptions = Array.from(new Set(rows.map((r) => r.level).filter((l) => l && l !== '—'))) as string[];

  // Apply filters
  const filteredRows = rows.filter((r) => {
    if (filters.child && r.childName !== filters.child) return false;
    if (filters.subject && r.subject !== filters.subject) return false;
    if (filters.activity && r.activity !== filters.activity) return false;
    if (filters.level && r.level !== filters.level) return false;
    return true;
  });

  const hasActiveFilters = filters.child !== '' || filters.activity !== '' || filters.level !== '' || filters.subject !== '';
  const displayedRows = showAll ? filteredRows : filteredRows.slice(0, DEFAULT_VISIBLE_ROWS);
  const hasMore = filteredRows.length > DEFAULT_VISIBLE_ROWS;

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setShowAll(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = loadParentSettings();
    if (username === saved.username && password === saved.pin) {
      setLoggedIn(true);
      setError('');
    } else {
      setError('Incorrect username or PIN.');
    }
  };

  const handleClear = async () => {
    await Promise.all([clearQuizResultsAsync(), clearFillInBlanksResultsAsync(), clearWordMatchResultsAsync(), clearRhymeMatchResultsAsync(), clearOppositeWordsResultsAsync(), clearNounVerbAdjectiveResultsAsync()]);
    await clearMathsResultsAsync();
    await clearSubjectResultsAsync();
    setRows([]);
    setShowClearConfirm(false);
  };

  // Reload settings when they change (from SettingsPanel saves)
  const refreshSettings = useCallback(() => {
    setCurrentSettings(loadParentSettings());
  }, []);

  useEffect(() => {
    window.addEventListener('kitty_settings_changed', refreshSettings);
    return () => window.removeEventListener('kitty_settings_changed', refreshSettings);
  }, [refreshSettings]);

  // ── Login Screen ──────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4 pb-24 md:pb-8">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border-2 border-purple-100 p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">👨‍👩‍👧</div>
            <h1 className="text-2xl font-extrabold text-purple-800">Parent Area</h1>
            <p className="text-sm text-purple-500 mt-1">Sign in to track your child's learning journey</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-purple-700 mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 text-purple-900 font-semibold text-base focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-purple-700 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 text-purple-900 font-semibold text-base focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {error && (
              <div className="px-4 py-2 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 text-sm font-semibold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-extrabold text-lg rounded-2xl transition-all active:scale-95 shadow-md mt-1"
            >
              Sign In
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link href="/story-reading" className="text-sm text-purple-400 hover:text-purple-600 font-semibold">
              ← Back to Stories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Progress Dashboard ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-6 pb-28 md:pb-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-purple-800">
              📊 KKZ's Progress
            </h1>
            <p className="text-sm text-purple-500 mt-0.5">Activity results &amp; reading history</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              title="Settings"
              className="w-9 h-9 flex items-center justify-center rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-600 transition-colors border-2 border-purple-200"
              aria-label="Open settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/></svg>
            </button>
            <button
              onClick={() => setLoggedIn(false)}
              className="px-4 py-2 text-sm font-bold text-purple-600 border-2 border-purple-200 rounded-2xl hover:bg-purple-50 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wide">📊 Overall Stats</span>
            <div className="flex items-center gap-2">
              {lastRefreshed && (
                <span className="text-[10px] text-purple-400 font-medium whitespace-nowrap">
                  Updated {lastRefreshed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <span className="text-[10px] text-purple-300 font-medium whitespace-nowrap">🔄 auto 2 min</span>
              <button
                onClick={loadResults}
                title="Refresh now"
                className="px-2 py-1 text-xs font-bold text-purple-500 border border-purple-200 rounded-xl hover:bg-purple-50 transition-all"
              >
                🔄
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-purple-50 rounded-2xl border-2 border-purple-100 p-4 text-center">
              <div className="text-3xl font-extrabold text-purple-700">{rows.length}</div>
              <div className="text-xs font-bold text-purple-400 mt-0.5">Attempts</div>
            </div>
            <div className="bg-purple-50 rounded-2xl border-2 border-purple-100 p-4 text-center">
              <div className="text-3xl font-extrabold text-green-600">
                {rows.length > 0
                  ? Math.round(
                      (rows.reduce((sum, r) => sum + (r.total > 0 ? r.score / r.total : 0), 0) /
                        rows.length) *
                        100
                    )
                  : 0}
                %
              </div>
              <div className="text-xs font-bold text-purple-400 mt-0.5">Avg Score</div>
            </div>
            <div className="bg-purple-50 rounded-2xl border-2 border-purple-100 p-4 text-center">
              <div className="text-3xl font-extrabold text-orange-500">
                {rows.filter((r) => r.total > 0 && r.score === r.total).length}
              </div>
              <div className="text-xs font-bold text-purple-400 mt-0.5">Perfect</div>
            </div>
          </div>
        </div>

        {/* ── Activity Progress Bar Chart ── */}
        {rows.length > 0 && (() => {
          const { data, children: chartChildren } = buildChartData(rows);
          const weeklyStats = buildPeriodStats(rows, 7);
          const monthlyStats = buildPeriodStats(rows, 30);
          return (
            <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-sm p-5 mb-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-extrabold text-purple-800">📈 Daily Activity Progress</h2>
                <div className="flex items-center gap-2">
                  {lastRefreshed && (
                    <span className="text-[10px] text-purple-400 font-medium whitespace-nowrap">
                      Updated {lastRefreshed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  <span className="text-[10px] text-purple-300 font-medium whitespace-nowrap">🔄 auto 2 min</span>
                  <button
                    onClick={loadResults}
                    title="Refresh now"
                    className="px-2 py-1 text-xs font-bold text-purple-500 border border-purple-200 rounded-xl hover:bg-purple-50 transition-all"
                  >
                    🔄
                  </button>
                </div>
              </div>
              <p className="text-xs text-purple-400 mb-4">Progress points per day by child (each bar = total score % earned that day)</p>

              {/* ── Weekly / Monthly summary cards ── */}
              {[{ label: 'This Week', stats: weeklyStats }, { label: 'This Month', stats: monthlyStats }].map(({ label, stats }) => (
                <div key={label} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wide">{label === 'This Week' ? '📅' : '🗓'} {label}</span>
                    <div className="flex-1 h-px bg-purple-100" />
                  </div>
                  {stats.length === 0 ? (
                    <p className="text-xs text-purple-300 italic pl-1">No activity in this period</p>
                  ) : (
                    <div className="overflow-x-auto -mx-1 px-1">
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
                      {stats.map(({ child, attempts, avgScore, perfectScores }) => (
                        <div
                          key={child}
                          className="rounded-2xl border-2 p-3 text-center"
                          style={{ borderColor: CHILD_COLORS[child] ? `${CHILD_COLORS[child]}40` : '#e9d5ff', background: CHILD_COLORS[child] ? `${CHILD_COLORS[child]}0d` : '#faf5ff' }}
                        >
                          <div className="flex flex-col items-center mb-2">
                            {CHILD_PHOTOS[child] ? (
                              <img
                                src={CHILD_PHOTOS[child]}
                                alt={child}
                                className="w-8 h-8 rounded-full object-cover border-2 mb-1"
                                style={{ borderColor: CHILD_COLORS[child] || '#7c3aed' }}
                              />
                            ) : (
                              <span className="text-lg mb-1">{CHILD_EMOJIS[child] || '👤'}</span>
                            )}
                            <span className="text-sm font-extrabold" style={{ color: CHILD_COLORS[child] || '#7c3aed' }}>{child}</span>
                          </div>
                          <div className="flex justify-around gap-1">
                            <div>
                              <div className="text-lg font-extrabold text-purple-800">{attempts}</div>
                              <div className="text-[10px] font-bold text-purple-400 leading-tight">Attempts</div>
                            </div>
                            <div className="w-px bg-purple-100" />
                            <div>
                              <div className="text-lg font-extrabold text-green-600">{avgScore}%</div>
                              <div className="text-[10px] font-bold text-purple-400 leading-tight">Avg Score</div>
                            </div>
                            <div className="w-px bg-purple-100" />
                            <div>
                              <div className="text-lg font-extrabold text-orange-500">{perfectScores}</div>
                              <div className="text-[10px] font-bold text-purple-400 leading-tight">Perfect</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    </div>
                  )}
                </div>
              ))}

              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 4 }} barCategoryGap="10%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: '#7c3aed', fontWeight: 600 }}
                    axisLine={{ stroke: '#e9d5ff' }}
                    tickLine={false}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#7c3aed', fontWeight: 600 }}
                    axisLine={{ stroke: '#e9d5ff' }}
                    tickLine={false}
                    tickFormatter={(v) => `${v}pts`}
                    domain={[0, 'auto']}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '2px solid #e9d5ff', fontSize: 12, fontWeight: 600 }}
                    formatter={(value: number, name: string) => [`${value} pts`, name]}
                    labelStyle={{ color: '#6d28d9', fontWeight: 700 }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: 8 }}
                    formatter={(value) => (
                      <span style={{ color: CHILD_COLORS[value] || '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {CHILD_PHOTOS[value] ? (
                          <img
                            src={CHILD_PHOTOS[value]}
                            alt={value}
                            style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'cover', display: 'inline-block', verticalAlign: 'middle' }}
                          />
                        ) : (
                          CHILD_EMOJIS[value] || ''
                        )}
                        {' '}{value}
                      </span>
                    )}
                  />
                  {chartChildren.map((child) => (
                    <Bar
                      key={child}
                      dataKey={child}
                      fill={CHILD_COLORS[child] || '#94a3b8'}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={12}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })()}

        {/* Progress Reports */}
        <ReportDownload rows={allReportRows} settings={currentSettings} />

        {/* AI Recommendations */}
        <AIRecommendations results={allActivityResults} />

        {/* Results table */}
        {loadingResults ? (
          <div className="bg-white rounded-3xl border-2 border-purple-100 p-10 text-center shadow-sm">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 rounded-full border-4 border-purple-300 border-t-purple-600 animate-spin" />
            </div>
            <p className="text-purple-500 font-semibold">Loading results…</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-purple-100 p-10 text-center shadow-sm">
            <div className="text-5xl mb-3">📚</div>
            <p className="text-lg font-bold text-purple-700">No activity results yet!</p>
            <p className="text-sm text-purple-400 mt-1">
              Kitty's results will appear here after she completes activities.
            </p>
            <Link
              href="/story-reading"
              className="inline-block mt-4 px-5 py-2 bg-purple-500 text-white font-bold rounded-2xl hover:bg-purple-600 transition-all text-sm"
            >
              Go to Stories →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-sm overflow-hidden">

            {/* ── Filter bar ── */}
            <div className="px-4 pt-4 pb-3 border-b border-purple-100">
              <div className="flex flex-wrap items-center gap-2">
                {/* Child filter */}
                <select
                  value={filters.child}
                  onChange={(e) => { setFilters((f) => ({ ...f, child: e.target.value })); setShowAll(false); }}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-purple-200 text-purple-700 bg-purple-50 focus:outline-none focus:border-purple-400 transition-colors"
                >
                  <option value="">All Children</option>
                  {childOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* Activity filter */}
                <select
                  value={filters.activity}
                  onChange={(e) => { setFilters((f) => ({ ...f, activity: e.target.value })); setShowAll(false); }}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-purple-200 text-purple-700 bg-purple-50 focus:outline-none focus:border-purple-400 transition-colors"
                >
                  <option value="">All Activities</option>
                  {activityOptions.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>

                {/* Subject filter */}
                <select value={filters.subject} onChange={(e) => { setFilters((f) => ({ ...f, subject: e.target.value })); setShowAll(false); }}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-purple-200 text-purple-700 bg-purple-50 focus:outline-none focus:border-purple-400 transition-colors">
                  <option value="">All Subjects</option>
                  {Array.from(new Set(rows.map(r => r.subject))).sort().map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                {/* Level filter */}
                <select
                  value={filters.level}
                  onChange={(e) => { setFilters((f) => ({ ...f, level: e.target.value })); setShowAll(false); }}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-purple-200 text-purple-700 bg-purple-50 focus:outline-none focus:border-purple-400 transition-colors"
                >
                  <option value="">All Levels</option>
                  {levelOptions.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>

                {/* Reset button */}
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-purple-500 hover:bg-purple-600 rounded-xl transition-all active:scale-95 flex items-center gap-1"
                  >
                    ↺ Reset
                  </button>
                )}

                {/* Refresh info */}
                <div className="ml-auto flex items-center gap-2">
                  {lastRefreshed && (
                    <span className="text-[10px] text-purple-400 font-medium whitespace-nowrap">
                      Updated {lastRefreshed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  <button
                    onClick={loadResults}
                    title="Refresh now"
                    className="px-2 py-1.5 text-xs font-bold text-purple-500 border border-purple-200 rounded-xl hover:bg-purple-50 transition-all"
                  >
                    🔄
                  </button>
                </div>
              </div>

              {/* Result count */}
              <p className="text-[10px] text-purple-400 font-medium mt-2">
                Showing {displayedRows.length} of {filteredRows.length} log{filteredRows.length !== 1 ? 's' : ''}
                {hasActiveFilters ? ' (filtered)' : ' · latest 5 by default'}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[580px] text-sm">
                <thead>
                  <tr className="bg-purple-50 border-b-2 border-purple-100">
                    <th className="text-center px-4 py-3 font-extrabold text-purple-700 text-xs uppercase tracking-wide">
                      Child
                    </th>
                    <th className="text-center px-4 py-3 font-extrabold text-purple-700 text-xs uppercase tracking-wide">
                      Subject
                    </th>
                    <th className="text-left px-4 py-3 font-extrabold text-purple-700 text-xs uppercase tracking-wide">
                      Activity / Story
                    </th>
                    <th className="text-center px-4 py-3 font-extrabold text-purple-700 text-xs uppercase tracking-wide">
                      Score
                    </th>
                    <th className="text-center px-4 py-3 font-extrabold text-purple-700 text-xs uppercase tracking-wide">
                      Subject / Level
                    </th>
                    <th className="text-right px-4 py-3 font-extrabold text-purple-700 text-xs uppercase tracking-wide">
                      Date &amp; Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-purple-400 font-semibold text-sm">
                        No results match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    displayedRows.map((r, idx) => (
                      <tr
                        key={r.id}
                        className={`border-b border-purple-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'}`}
                      >
                        <td className="px-4 py-3 text-center">
                          {r.childName ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full font-bold text-xs bg-indigo-100 text-indigo-700 whitespace-nowrap">
                              {CHILD_PHOTOS[r.childName] ? (
                                <img
                                  src={CHILD_PHOTOS[r.childName]}
                                  alt={r.childName}
                                  className="w-4 h-4 rounded-full object-cover"
                                />
                              ) : (
                                <span>{CHILD_EMOJIS[r.childName] || '👤'}</span>
                              )}
                              {r.childName}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block px-2 py-1 rounded-full font-bold text-xs whitespace-nowrap bg-purple-100 text-purple-700">
                            {r.subject}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-purple-900 max-w-[160px]">
                          <div className="truncate text-xs font-semibold text-purple-900">{r.storyTitle}</div>
                          <span
                            className={`inline-block mt-0.5 px-2 py-0.5 rounded-full font-bold text-[10px] whitespace-nowrap ${getActivityBadgeColor(r.activity)}`}
                          >
                            {r.activity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full font-extrabold text-xs ${getScoreColor(r.score, r.total)}`}
                          >
                            {r.score}/{r.total}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-1 rounded-full font-bold text-xs whitespace-nowrap ${r.levelColor ?? 'bg-gray-100 text-gray-500'}`}>
                            {r.level ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-purple-500 font-medium whitespace-nowrap">
                          {formatDateTime(r.dateTime)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* View All / Show Less + Clear button */}
            <div className="px-4 py-3 border-t border-purple-100 flex items-center justify-between gap-2 flex-wrap">
              {/* View All / Show Less */}
              <div>
                {hasMore && !showAll && (
                  <button
                    onClick={() => setShowAll(true)}
                    className="px-3 py-1.5 text-xs font-bold text-purple-600 border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-all"
                  >
                    View All ({filteredRows.length}) →
                  </button>
                )}
                {showAll && filteredRows.length > DEFAULT_VISIBLE_ROWS && (
                  <button
                    onClick={() => setShowAll(false)}
                    className="px-3 py-1.5 text-xs font-bold text-purple-600 border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-all"
                  >
                    ← Show Latest 5
                  </button>
                )}
              </div>

              {/* Clear history */}
              {showClearConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-600 font-semibold">Clear all results?</span>
                  <button
                    onClick={handleClear}
                    className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-all"
                  >
                    Yes, Clear
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-3 py-1.5 text-xs font-bold text-red-400 border border-red-200 rounded-xl hover:bg-red-50 transition-all"
                >
                  🗑 Clear History
                </button>
              )}
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} onSave={refreshSettings} />
        )}
      </div>
    </div>
  );
}
