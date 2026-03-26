// Leaderboard — aggregates results from all stores

import { getQuizResults, getQuizResultsAsync } from '@/lib/quizResults';
import { getMathsResults, getMathsResultsAsync } from '@/lib/mathsResults';
import { getSubjectResults, getSubjectResultsAsync } from '@/lib/subjectResults';
import { loadParentSettings } from '@/app/parent/components/SettingsPanel';
import { CHILD_NAMES } from '@/lib/childProfile';

export interface LeaderboardEntry {
  childName: string;
  displayName: string;
  emoji: string;
  photoUrl: string | null;
  totalStars: number;
  weeklyStars: number;
  totalActivities: number;
  perfectScores: number;
  currentStreak: number;
  longestStreak: number;
  lastActive: string | null;
  subjectBreakdown: Record<string, { activities: number; avgScore: number }>;
  rank: 1 | 2 | 3;
}

/** Stars for practice activities (Subjects tab) */
function starsForPractice(score: number, total: number): number {
  if (total === 0) return 0;
  const pct = score / total;
  if (pct >= 1.0) return 3;   // 100% = 3 stars
  if (pct >= 0.8) return 2;   // 80%+ = 2 stars
  if (pct >= 0.6) return 1;   // 60%+ = 1 star
  return 0;                    // Below 60% = 0 stars
}

/** Stars for assessment exams (Assessment tab) — higher reward */
function starsForAssessment(score: number, total: number): number {
  if (total === 0) return 0;
  const pct = score / total;
  if (pct >= 1.0) return 5;   // 100% = 5 stars
  if (pct >= 0.8) return 4;   // 80%+ = 4 stars
  if (pct >= 0.6) return 3;   // 60%+ = 3 stars
  if (pct >= 0.4) return 1;   // 40%+ = 1 star
  return 0;                    // Below 40% = 0 stars
}

/** Backward-compatible alias used for generic results */
function starsForResult(score: number, total: number): number {
  return starsForPractice(score, total);
}

/** Bonus stars for consecutive-day streaks */
function streakBonusStars(currentStreak: number): number {
  if (currentStreak >= 7) return 3;   // Full week = +3
  if (currentStreak >= 5) return 2;   // 5 days = +2
  if (currentStreak >= 3) return 1;   // 3 days = +1
  return 0;
}

function isThisWeek(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return d >= weekAgo && d <= now;
}

function computeStreak(dates: string[]): { current: number; longest: number } {
  if (dates.length === 0) return { current: 0, longest: 0 };
  const daySet = new Set(dates.map((d) => new Date(d).toDateString()));
  const dayArray = Array.from(daySet).map((d) => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
  let current = 0;
  let longest = 0;
  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - 86400000);
  const mostRecent = dayArray[0];
  mostRecent.setHours(0, 0, 0, 0);
  if (mostRecent.getTime() === today.getTime() || mostRecent.getTime() === yesterday.getTime()) {
    current = 1;
    for (let i = 1; i < dayArray.length; i++) {
      const prev = new Date(dayArray[i - 1].getTime() - 86400000);
      prev.setHours(0, 0, 0, 0);
      dayArray[i].setHours(0, 0, 0, 0);
      if (dayArray[i].getTime() === prev.getTime()) { current++; streak++; }
      else break;
    }
  }
  streak = 1;
  for (let i = 1; i < dayArray.length; i++) {
    const prev = new Date(dayArray[i - 1].getTime() - 86400000);
    prev.setHours(0, 0, 0, 0);
    dayArray[i].setHours(0, 0, 0, 0);
    if (dayArray[i].getTime() === prev.getTime()) { streak++; longest = Math.max(longest, streak); }
    else { longest = Math.max(longest, streak); streak = 1; }
  }
  longest = Math.max(longest, streak, current);
  return { current, longest };
}

interface RawActivity { childName?: string; score: number; total: number; dateTime: string; subject?: string; isAssessment?: boolean; }

function buildFromRawActivities(all: RawActivity[]): LeaderboardEntry[] {
  const settings = loadParentSettings();
  const childNames = CHILD_NAMES as readonly string[];
  const entries: Omit<LeaderboardEntry, 'rank'>[] = childNames.map((name) => {
    const child = settings.children[name] ?? { name, emoji: '🐱', photoUrl: null };
    const myResults = all.filter((r) => r.childName === name);
    const weeklyResults = myResults.filter((r) => isThisWeek(r.dateTime));
    const totalStars = myResults.reduce((sum, r) => {
      const isAssessment = (r as RawActivity & { isAssessment?: boolean }).isAssessment;
      return sum + (isAssessment ? starsForAssessment(r.score, r.total) : starsForPractice(r.score, r.total));
    }, 0);
    const weeklyActivityStars = weeklyResults.reduce((sum, r) => {
      const isAssessment = (r as RawActivity & { isAssessment?: boolean }).isAssessment;
      return sum + (isAssessment ? starsForAssessment(r.score, r.total) : starsForPractice(r.score, r.total));
    }, 0);
    const perfectScores = myResults.filter((r) => r.total > 0 && r.score === r.total).length;
    const dates = myResults.map((r) => r.dateTime);
    const { current, longest } = computeStreak(dates);
    const weeklyStars = weeklyActivityStars + streakBonusStars(current);
    const lastActive = myResults.length > 0 ? myResults.sort((a, b) => b.dateTime.localeCompare(a.dateTime))[0].dateTime : null;
    const subjectBreakdown: Record<string, { activities: number; avgScore: number }> = {};
    myResults.forEach((r) => {
      const subj = r.subject ?? 'english';
      if (!subjectBreakdown[subj]) subjectBreakdown[subj] = { activities: 0, avgScore: 0 };
      subjectBreakdown[subj].activities++;
      subjectBreakdown[subj].avgScore += r.total > 0 ? (r.score / r.total) * 100 : 0;
    });
    Object.keys(subjectBreakdown).forEach((k) => {
      subjectBreakdown[k].avgScore = Math.round(subjectBreakdown[k].avgScore / subjectBreakdown[k].activities);
    });
    return {
      childName: name,
      displayName: child.name,
      emoji: child.emoji,
      photoUrl: child.photoUrl,
      totalStars,
      weeklyStars,
      totalActivities: myResults.length,
      perfectScores,
      currentStreak: current,
      longestStreak: longest,
      lastActive,
      subjectBreakdown,
    };
  });

  const sorted = [...entries].sort((a, b) => b.weeklyStars - a.weeklyStars || b.totalStars - a.totalStars);
  return sorted.slice(0, 3).map((e, i) => ({ ...e, rank: (i + 1) as 1 | 2 | 3 }));
}

/** Synchronous version — reads from localStorage only (fast, used as initial render) */
export function buildLeaderboard(): LeaderboardEntry[] {
  const quizResults = getQuizResults().map((r): RawActivity => ({ childName: r.childName, score: r.score, total: r.total, dateTime: r.dateTime, subject: 'english' }));
  const mathsResults = getMathsResults().map((r): RawActivity => ({ childName: r.childName, score: r.score, total: r.total, dateTime: r.dateTime, subject: 'maths' }));
  const subjectResults = getSubjectResults().map((r): RawActivity => ({ childName: r.childName, score: r.score, total: r.total, dateTime: r.dateTime, subject: r.subject }));
  return buildFromRawActivities([...quizResults, ...mathsResults, ...subjectResults]);
}

/** Async version — fetches from Supabase (accurate, used for updates) */
export async function buildLeaderboardAsync(): Promise<LeaderboardEntry[]> {
  try {
    const [quizData, mathsData, subjectData] = await Promise.all([
      getQuizResultsAsync(),
      getMathsResultsAsync(),
      getSubjectResultsAsync(),
    ]);
    const quizResults = quizData.map((r): RawActivity => ({ childName: r.childName, score: r.score, total: r.total, dateTime: r.dateTime, subject: 'english' }));
    const mathsResults = mathsData.map((r): RawActivity => ({ childName: r.childName, score: r.score, total: r.total, dateTime: r.dateTime, subject: 'maths' }));
    const subjectResults = subjectData.map((r): RawActivity => ({ childName: r.childName, score: r.score, total: r.total, dateTime: r.dateTime, subject: r.subject }));
    return buildFromRawActivities([...quizResults, ...mathsResults, ...subjectResults]);
  } catch {
    // Fallback to localStorage if Supabase fails
    return buildLeaderboard();
  }
}
