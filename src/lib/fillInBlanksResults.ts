// Fill in the Blanks result storage — syncs with Supabase, falls back to localStorage

import { createClient } from '@/lib/supabase/client';

export interface FillInBlanksResult {
  id: string;
  storyTitle: string;
  childName?: string;
  score: number;
  total: number;
  dateTime: string; // ISO string
}

const STORAGE_KEY = 'kitty_fill_in_blanks_results';
const PROFILE_KEY = 'kitty';

// ── localStorage helpers (fallback) ──────────────────────────────────────────

function getLocalResults(): FillInBlanksResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FillInBlanksResult[];
  } catch {
    return [];
  }
}

function setLocalResults(results: FillInBlanksResult[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

function rowToResult(row: any): FillInBlanksResult {
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

/** Save a Fill in the Blanks result to Supabase (and localStorage as backup) */
export async function saveFillInBlanksResult(
  result: Omit<FillInBlanksResult, 'id' | 'dateTime'>
): Promise<void> {
  const dateTime = new Date().toISOString();
  const localId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // Always write to localStorage immediately
  const existing = getLocalResults();
  const newLocal: FillInBlanksResult = { ...result, id: localId, dateTime };
  setLocalResults([newLocal, ...existing]);

  // Sync to Supabase
  try {
    const supabase = createClient();
    await supabase.from('fill_in_blanks_results').insert({
      profile_key: PROFILE_KEY,
      story_title: result.storyTitle,
      child_name: result.childName ?? null,
      score: result.score,
      total: result.total,
      date_time: dateTime,
    });
  } catch {
    // Supabase unavailable — localStorage already saved
  }
}

/** Load Fill in the Blanks results — prefers Supabase, falls back to localStorage */
export async function getFillInBlanksResultsAsync(): Promise<FillInBlanksResult[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('fill_in_blanks_results')
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

/** Clear all Fill in the Blanks results from Supabase and localStorage */
export async function clearFillInBlanksResultsAsync(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }

  try {
    const supabase = createClient();
    await supabase
      .from('fill_in_blanks_results')
      .delete()
      .eq('profile_key', PROFILE_KEY);
  } catch {
    // Supabase unavailable — localStorage already cleared
  }
}
