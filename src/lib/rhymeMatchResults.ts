// Rhyme Match result storage — syncs with Supabase, falls back to localStorage

import { createClient } from '@/lib/supabase/client';

export interface RhymeMatchResult {
  id: string;
  storyTitle: string;
  childName?: string;
  score: number;
  total: number;
  attempts: number;
  dateTime: string; // ISO string
}

const STORAGE_KEY = 'kitty_rhyme_match_results';
const PROFILE_KEY = 'kitty';

// ── localStorage helpers (fallback) ──────────────────────────────────────────

function getLocalResults(): RhymeMatchResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RhymeMatchResult[];
  } catch {
    return [];
  }
}

function setLocalResults(results: RhymeMatchResult[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

// ── Supabase helpers ──────────────────────────────────────────────────────────

function rowToResult(row: Record<string, unknown>): RhymeMatchResult {
  return {
    id: row.id as string,
    storyTitle: row.story_title as string,
    childName: (row.child_name as string | null) ?? undefined,
    score: row.score as number,
    total: row.total as number,
    attempts: (row.attempts as number) ?? 1,
    dateTime: row.date_time as string,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Save a Rhyme Match result to Supabase (and localStorage as backup) */
export async function saveRhymeMatchResult(
  result: Omit<RhymeMatchResult, 'id' | 'dateTime'>
): Promise<void> {
  const dateTime = new Date().toISOString();
  const localId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  // Always write to localStorage immediately
  const existing = getLocalResults();
  const newLocal: RhymeMatchResult = { ...result, id: localId, dateTime };
  setLocalResults([newLocal, ...existing]);

  // Sync to Supabase
  try {
    const supabase = createClient();
    const { error } = await supabase.from('rhyme_match_results').insert({
      profile_key: PROFILE_KEY,
      story_title: result.storyTitle,
      child_name: result.childName ?? null,
      score: result.score,
      total: result.total,
      attempts: result.attempts,
      date_time: dateTime,
    });
    if (error) console.error('[rhymeMatchResults] Supabase insert failed:', error.message);
  } catch (err) {
    console.error('[rhymeMatchResults] Supabase unavailable:', err);
  }
}

/** Load Rhyme Match results — prefers Supabase, falls back to localStorage */
export async function getRhymeMatchResultsAsync(): Promise<RhymeMatchResult[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('rhyme_match_results')
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

/** Clear all Rhyme Match results from Supabase and localStorage */
export async function clearRhymeMatchResultsAsync(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }

  try {
    const supabase = createClient();
    await supabase
      .from('rhyme_match_results')
      .delete()
      .eq('profile_key', PROFILE_KEY);
  } catch {
    // Supabase unavailable — localStorage already cleared
  }
}
