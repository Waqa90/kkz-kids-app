// Subject activity result storage

import { createClient } from '@/lib/supabase/client';

export interface SubjectResult {
  id: string;
  activityId: string;
  activityTitle: string;
  subject: string;
  activityType: string;
  childName?: string;
  class: 3 | 4 | 5;
  score: number;
  total: number;
  dateTime: string;
}

const STORAGE_KEY = 'kkz_subject_results';
const PROFILE_KEY = 'kitty';

function getLocalResults(): SubjectResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SubjectResult[];
  } catch { return []; }
}

function setLocalResults(results: SubjectResult[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

function rowToResult(row: any): SubjectResult {
  return {
    id: row.id,
    activityId: row.activity_id,
    activityTitle: row.activity_title,
    subject: row.subject,
    activityType: row.activity_type,
    childName: row.child_name ?? undefined,
    class: row.class_level,
    score: row.score,
    total: row.total,
    dateTime: row.date_time,
  };
}

export async function saveSubjectResultAsync(result: Omit<SubjectResult, 'id' | 'dateTime'>): Promise<void> {
  const dateTime = new Date().toISOString();
  const localId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const existing = getLocalResults();
  setLocalResults([{ ...result, id: localId, dateTime }, ...existing]);
  try {
    const supabase = createClient();
    const { error } = await supabase.from('subject_results').insert({
      profile_key: PROFILE_KEY,
      child_name: result.childName ?? null,
      activity_id: result.activityId,
      activity_title: result.activityTitle,
      subject: result.subject,
      activity_type: result.activityType,
      class_level: result.class,
      score: result.score,
      total: result.total,
      date_time: dateTime,
    });
    if (error) console.error('[subjectResults] Supabase insert failed:', error.message);
  } catch (err) {
    console.error('[subjectResults] Supabase unavailable:', err);
  }
}

export async function getSubjectResultsAsync(): Promise<SubjectResult[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('subject_results')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .order('date_time', { ascending: false });
    if (error || !data) return getLocalResults();
    const results = data.map(rowToResult);
    setLocalResults(results);
    return results;
  } catch { return getLocalResults(); }
}

export function getSubjectResults(): SubjectResult[] {
  return getLocalResults();
}

export async function clearSubjectResultsAsync(): Promise<void> {
  if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
  try {
    const supabase = createClient();
    await supabase.from('subject_results').delete().eq('profile_key', PROFILE_KEY);
  } catch { /* localStorage already cleared */ }
}

export function clearSubjectResults(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
