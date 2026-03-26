// Word Match result storage — syncs with Supabase, falls back to localStorage

import { createClient } from '@/lib/supabase/client';

export interface WordMatchResult {
  id: string;
  storyTitle: string;
  childName?: string;
  score: number;
  total: number;
  attempts: number;
  dateTime: string; // ISO string
}

const STORAGE_KEY = 'kitty_word_match_results';
const PROFILE_KEY = 'kitty';

// ── localStorage helpers (fallback) ──────────────────────────────────────────

function getLocalResults(): WordMatchResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WordMatchResult[];
  } catch {
    return [];
  }
}

function setLocalResults(results: WordMatchResult[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

function rowToResult(row: any): WordMatchResult {
  return {
    id: row.id,
    storyTitle: row.story_title,
    childName: row.child_name ?? undefined,
    score: row.score,
    total: row.total,
    attempts: row.attempts ?? 1,
    dateTime: row.date_time,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Save a Word Match result to Supabase (and localStorage as backup) */
export async function saveWordMatchResult(
  result: Omit<WordMatchResult, 'id' | 'dateTime'>
): Promise<void> {
  const dateTime = new Date().toISOString();
  const localId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // Always write to localStorage immediately
  const existing = getLocalResults();
  const newLocal: WordMatchResult = { ...result, id: localId, dateTime };
  setLocalResults([newLocal, ...existing]);

  // Sync to Supabase
  try {
    const supabase = createClient();
    const { error } = await supabase.from('word_match_results').insert({
      profile_key: PROFILE_KEY,
      story_title: result.storyTitle,
      child_name: result.childName ?? null,
      score: result.score,
      total: result.total,
      attempts: result.attempts,
      date_time: dateTime,
    });
    if (error) console.error('[wordMatchResults] Supabase insert failed:', error.message);
  } catch (err) {
    console.error('[wordMatchResults] Supabase unavailable:', err);
  }
}

/** Load Word Match results — prefers Supabase, falls back to localStorage */
export async function getWordMatchResultsAsync(): Promise<WordMatchResult[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('word_match_results')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .order('date_time', { ascending: false });

    if (error || !data) {
      return getLocalResults();
    }

    const results = data.map(rowToResult);
    setLocalResults(results);
    return results;
  } catch {
    return getLocalResults();
  }
}

/** Clear all Word Match results from Supabase and localStorage */
export async function clearWordMatchResultsAsync(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }

  try {
    const supabase = createClient();
    await supabase
      .from('word_match_results')
      .delete()
      .eq('profile_key', PROFILE_KEY);
  } catch {
    // Supabase unavailable — localStorage already cleared
  }
}
