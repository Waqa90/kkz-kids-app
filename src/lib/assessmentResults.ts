// Assessment result storage — syncs with Supabase, falls back to localStorage

import { createClient } from '@/lib/supabase/client';

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  childName: string;
  subject: string;
  classLevel: number;
  term: string;
  score: number;
  totalMarks: number;
  sections: Array<{ label: string; title: string; score: number; marks: number }>;
  dateTime: string;
}

const STORAGE_KEY = 'kkz_assessment_results';
const PROFILE_KEY = 'kitty';

function getLocal(): AssessmentResult[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function setLocal(results: AssessmentResult[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

export async function saveAssessmentResult(
  result: Omit<AssessmentResult, 'id' | 'dateTime'>
): Promise<void> {
  const dateTime = new Date().toISOString();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const full: AssessmentResult = { ...result, id, dateTime };

  // Always save locally first
  setLocal([full, ...getLocal()]);

  // Sync to Supabase
  try {
    const supabase = createClient();
    const { error } = await supabase.from('assessment_results').insert({
      profile_key: PROFILE_KEY,
      assessment_id: result.assessmentId,
      assessment_title: result.assessmentTitle,
      child_name: result.childName,
      subject: result.subject,
      class_level: result.classLevel,
      term: result.term,
      score: result.score,
      total_marks: result.totalMarks,
      sections: result.sections,
      date_time: dateTime,
    });
    if (error) console.error('[assessmentResults] Supabase insert failed:', error.message);
  } catch (err) {
    console.error('[assessmentResults] Supabase unavailable:', err);
  }
}

export async function getAssessmentResultsAsync(childName?: string): Promise<AssessmentResult[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('assessment_results')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .order('date_time', { ascending: false });

    if (childName) query = query.eq('child_name', childName);

    const { data, error } = await query;
    if (error || !data) return getLocal();

    const results: AssessmentResult[] = data.map((row: any) => ({
      id: row.id,
      assessmentId: row.assessment_id,
      assessmentTitle: row.assessment_title,
      childName: row.child_name,
      subject: row.subject,
      classLevel: row.class_level,
      term: row.term,
      score: row.score,
      totalMarks: row.total_marks,
      sections: row.sections ?? [],
      dateTime: row.date_time,
    }));

    setLocal(results);
    return results;
  } catch {
    return getLocal();
  }
}

export function getAssessmentResults(): AssessmentResult[] {
  return getLocal();
}
