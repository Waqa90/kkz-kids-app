// Quiz result storage — syncs with Supabase, falls back to localStorage

import { createClient } from '@/lib/supabase/client';

export interface QuizResult {
  id: string;
  storyTitle: string;
  childName?: string;
  score: number;
  total: number;
  dateTime: string; // ISO string
}

const STORAGE_KEY = 'kitty_quiz_results';
const PROFILE_KEY = 'kitty';

// ── localStorage helpers (fallback) ──────────────────────────────────────────

function getLocalResults(): QuizResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QuizResult[];
  } catch {
    return [];
  }
}

function setLocalResults(results: QuizResult[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

function rowToResult(row: any): QuizResult {
  return {
    id: row.id,
    storyTitle: row.story_title,
    childName: row.child_name ?? undefined,
    score: row.score,
    total: row.total,
    dateTime: row.date_time,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Save a quiz result to Supabase (and localStorage as backup) */
export async function saveQuizResult(
  result: Omit<QuizResult, 'id' | 'dateTime'>
): Promise<void> {
  const dateTime = new Date().toISOString();
  const localId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // Always write to localStorage immediately
  const existing = getLocalResults();
  const newLocal: QuizResult = { ...result, id: localId, dateTime };
  setLocalResults([newLocal, ...existing]);

  // Sync to Supabase
  try {
    const supabase = createClient();
    const { error } = await supabase.from('quiz_results').insert({
      profile_key: PROFILE_KEY,
      story_title: result.storyTitle,
      child_name: result.childName ?? null,
      score: result.score,
      total: result.total,
      date_time: dateTime,
    });
    if (error) console.error('[quizResults] Supabase insert failed:', error.message);
  } catch (err) {
    console.error('[quizResults] Supabase unavailable:', err);
  }
}

/** Load quiz results — prefers Supabase, falls back to localStorage */
export async function getQuizResultsAsync(): Promise<QuizResult[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .order('date_time', { ascending: false });

    if (error || !data) {
      return getLocalResults();
    }

    const results = data.map(rowToResult);
    // Keep localStorage in sync
    setLocalResults(results);
    return results;
  } catch {
    return getLocalResults();
  }
}

/** Synchronous getter for localStorage (used in non-async contexts) */
export function getQuizResults(): QuizResult[] {
  return getLocalResults();
}

/** Clear all quiz results from Supabase and localStorage */
export async function clearQuizResultsAsync(): Promise<void> {
  // Clear localStorage immediately
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }

  try {
    const supabase = createClient();
    await supabase
      .from('quiz_results')
      .delete()
      .eq('profile_key', PROFILE_KEY);
  } catch {
    // Supabase unavailable — localStorage already cleared
  }
}

/** Synchronous clear (localStorage only) */
export function clearQuizResults(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
