// Opposite Words result storage — syncs with Supabase, falls back to localStorage

import { createClient } from '@/lib/supabase/client';

export interface OppositeWordsResult {
  id: string;
  storyTitle: string;
  childName?: string;
  score: number;
  total: number;
  attempts: number;
  dateTime: string; // ISO string
}

const STORAGE_KEY = 'kitty_opposite_words_results';
const PROFILE_KEY = 'kitty';

// ── localStorage helpers (fallback) ──────────────────────────────────────────

function getLocalResults(): OppositeWordsResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as OppositeWordsResult[];
  } catch {
    return [];
  }
}

function setLocalResults(results: OppositeWordsResult[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

function rowToResult(row: any): OppositeWordsResult {
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

/** Save an Opposite Words result to Supabase (and localStorage as backup) */
export async function saveOppositeWordsResult(
  result: Omit<OppositeWordsResult, 'id' | 'dateTime'>
): Promise<void> {
  const dateTime = new Date().toISOString();
  const localId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // Always write to localStorage immediately
  const existing = getLocalResults();
  const newLocal: OppositeWordsResult = { ...result, id: localId, dateTime };
  setLocalResults([newLocal, ...existing]);

  // Sync to Supabase
  try {
    const supabase = createClient();
    const { error } = await supabase.from('opposite_words_results').insert({
      profile_key: PROFILE_KEY,
      story_title: result.storyTitle,
      child_name: result.childName ?? null,
      score: result.score,
      total: result.total,
      attempts: result.attempts,
      date_time: dateTime,
    });
    if (error) console.error('[oppositeWordsResults] Supabase insert failed:', error.message);
  } catch (err) {
    console.error('[oppositeWordsResults] Supabase unavailable:', err);
  }
}

/** Load Opposite Words results — prefers Supabase, falls back to localStorage */
export async function getOppositeWordsResultsAsync(): Promise<OppositeWordsResult[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('opposite_words_results')
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

/** Clear all Opposite Words results from Supabase and localStorage */
export async function clearOppositeWordsResultsAsync(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }

  try {
    const supabase = createClient();
    await supabase
      .from('opposite_words_results')
      .delete()
      .eq('profile_key', PROFILE_KEY);
  } catch {
    // Supabase unavailable — localStorage already cleared
  }
}
