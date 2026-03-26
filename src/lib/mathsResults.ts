// Maths result storage — syncs with Supabase, falls back to localStorage

import { createClient } from '@/lib/supabase/client';

export interface MathsResult {
  id: string;
  mathsSetId: string;
  mathsSetTitle: string;
  childName?: string;
  class: 3 | 4 | 5;
  topic: string;
  score: number;
  total: number;
  dateTime: string;
}

const STORAGE_KEY = 'kkz_maths_results';
const PROFILE_KEY = 'kitty';

function getLocalResults(): MathsResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MathsResult[];
  } catch { return []; }
}

function setLocalResults(results: MathsResult[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

function rowToResult(row: any): MathsResult {
  return {
    id: row.id,
    mathsSetId: row.set_id,
    mathsSetTitle: row.set_title,
    childName: row.child_name ?? undefined,
    class: row.class_level,
    topic: row.topic,
    score: row.score,
    total: row.total,
    dateTime: row.date_time,
  };
}

export async function saveMathsResultAsync(result: Omit<MathsResult, 'id' | 'dateTime'>): Promise<void> {
  const dateTime = new Date().toISOString();
  const localId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const existing = getLocalResults();
  setLocalResults([{ ...result, id: localId, dateTime }, ...existing]);
  try {
    const supabase = createClient();
    const { error } = await supabase.from('maths_results').insert({
      profile_key: PROFILE_KEY,
      child_name: result.childName ?? null,
      set_id: result.mathsSetId,
      set_title: result.mathsSetTitle,
      topic: result.topic,
      class_level: result.class,
      score: result.score,
      total: result.total,
      date_time: dateTime,
    });
    if (error) console.error('[mathsResults] Supabase insert failed:', error.message);
  } catch (err) {
    console.error('[mathsResults] Supabase unavailable:', err);
  }
}

export async function getMathsResultsAsync(): Promise<MathsResult[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('maths_results')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .order('date_time', { ascending: false });
    if (error || !data) return getLocalResults();
    const results = data.map(rowToResult);
    setLocalResults(results);
    return results;
  } catch { return getLocalResults(); }
}

export function getMathsResults(): MathsResult[] {
  return getLocalResults();
}

export async function clearMathsResultsAsync(): Promise<void> {
  if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
  try {
    const supabase = createClient();
    await supabase.from('maths_results').delete().eq('profile_key', PROFILE_KEY);
  } catch { /* localStorage already cleared */ }
}

export function clearMathsResults(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
