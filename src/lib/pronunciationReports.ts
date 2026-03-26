import { createClient } from '@/lib/supabase/client';

export interface WeakWord {
  word: string;
  issue: string;
  tip: string;
}

export interface PronunciationIssue {
  category: string;
  description: string;
  examples: string[];
}

export interface PronunciationReport {
  id: string;
  profileKey: string;
  storyId: string;
  storyTitle: string;
  sessionDate: string;
  overallScore: number;
  wordsAttempted: number;
  wordsCorrect: number;
  weakWords: WeakWord[];
  pronunciationIssues: PronunciationIssue[];
  strengths: string;
  improvementsNeeded: string;
  teacherFeedback: string;
  createdAt: string;
}

function rowToReport(row: Record<string, unknown>): PronunciationReport {
  return {
    id: row.id as string,
    profileKey: row.profile_key as string,
    storyId: row.story_id as string,
    storyTitle: row.story_title as string,
    sessionDate: row.session_date as string,
    overallScore: row.overall_score as number,
    wordsAttempted: row.words_attempted as number,
    wordsCorrect: row.words_correct as number,
    weakWords: (row.weak_words as WeakWord[]) || [],
    pronunciationIssues: (row.pronunciation_issues as PronunciationIssue[]) || [],
    strengths: row.strengths as string,
    improvementsNeeded: row.improvements_needed as string,
    teacherFeedback: row.teacher_feedback as string,
    createdAt: row.created_at as string,
  };
}

export async function savePronunciationReport(
  report: Omit<PronunciationReport, 'id' | 'createdAt'>
): Promise<PronunciationReport | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('pronunciation_reports')
      .insert({
        profile_key: report.profileKey,
        story_id: report.storyId,
        story_title: report.storyTitle,
        session_date: report.sessionDate,
        overall_score: report.overallScore,
        words_attempted: report.wordsAttempted,
        words_correct: report.wordsCorrect,
        weak_words: report.weakWords,
        pronunciation_issues: report.pronunciationIssues,
        strengths: report.strengths,
        improvements_needed: report.improvementsNeeded,
        teacher_feedback: report.teacherFeedback,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving pronunciation report:', error);
      return null;
    }
    return rowToReport(data as Record<string, unknown>);
  } catch (err) {
    console.error('Failed to save pronunciation report:', err);
    return null;
  }
}

export async function getPronunciationReports(): Promise<PronunciationReport[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('pronunciation_reports')
      .select('*')
      .eq('profile_key', 'kitty')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading pronunciation reports:', error);
      return [];
    }
    return (data || []).map((row) => rowToReport(row as Record<string, unknown>));
  } catch (err) {
    console.error('Failed to load pronunciation reports:', err);
    return [];
  }
}
