// Lab notes — OCR text + activity metadata for parent lab workflow
// Syncs with Supabase so notes are available across all devices

import { createClient } from '@/lib/supabase/client';

export interface LabNote {
  id: string;
  childName: string;
  subject: string;
  class: 3 | 4 | 5;
  title: string;
  activityTypes: string[];
  questionCount: number;
  rawText: string;
  extractedAt: string;
  processedActivities?: any[];
  publishedAt?: string;
}

const LAB_NOTES_KEY = 'kkz_lab_notes';
const PROFILE_KEY = 'kitty';

// ── Local helpers ──

function getLocal(): LabNote[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LAB_NOTES_KEY);
    return raw ? (JSON.parse(raw) as LabNote[]) : [];
  } catch { return []; }
}

function setLocal(notes: LabNote[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAB_NOTES_KEY, JSON.stringify(notes));
}

// ── Row ↔ LabNote mapping ──

function rowToNote(row: any): LabNote {
  return {
    id: row.note_id ?? row.id,
    childName: row.child_name,
    subject: row.subject,
    class: row.class_level,
    title: row.title,
    activityTypes: row.activity_types ?? [],
    questionCount: row.question_count ?? 10,
    rawText: row.raw_text ?? '',
    extractedAt: row.extracted_at,
    processedActivities: row.processed_activities ?? undefined,
    publishedAt: row.published_at ?? undefined,
  };
}

// ── Synchronous (localStorage-only, fast for initial render) ──

export function getLabNotes(): LabNote[] {
  return getLocal();
}

export function saveLabNote(note: LabNote): void {
  if (typeof window === 'undefined') return;
  const existing = getLocal().filter((n) => n.id !== note.id);
  setLocal([note, ...existing]);
  // Fire-and-forget Supabase upsert
  saveLabNoteAsync(note).catch(() => {});
}

export function updateLabNote(id: string, updates: Partial<LabNote>): void {
  if (typeof window === 'undefined') return;
  const notes = getLocal().map((n) => (n.id === id ? { ...n, ...updates } : n));
  setLocal(notes);
  const updated = notes.find((n) => n.id === id);
  if (updated) saveLabNoteAsync(updated).catch(() => {});
}

export function deleteLabNote(id: string): void {
  if (typeof window === 'undefined') return;
  const notes = getLocal().filter((n) => n.id !== id);
  setLocal(notes);
  deleteLabNoteAsync(id).catch(() => {});
}

export function getLabNoteById(id: string): LabNote | null {
  return getLocal().find((n) => n.id === id) ?? null;
}

// ── Async (Supabase + localStorage sync) ──

export async function saveLabNoteAsync(note: LabNote): Promise<void> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('lab_notes').upsert({
      note_id: note.id,
      profile_key: PROFILE_KEY,
      child_name: note.childName,
      subject: note.subject,
      class_level: note.class,
      title: note.title,
      activity_types: note.activityTypes,
      question_count: note.questionCount,
      raw_text: note.rawText,
      extracted_at: note.extractedAt,
      processed_activities: note.processedActivities ?? null,
      published_at: note.publishedAt ?? null,
    }, { onConflict: 'note_id' });
    if (error) console.error('[labNotes] Supabase upsert failed:', error.message);
  } catch (err) {
    console.error('[labNotes] Supabase unavailable:', err);
  }
}

export async function getLabNotesAsync(): Promise<LabNote[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('lab_notes')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .order('extracted_at', { ascending: false });
    if (error || !data) return getLocal();
    const notes = data.map(rowToNote);
    setLocal(notes);
    return notes;
  } catch { return getLocal(); }
}

export async function deleteLabNoteAsync(id: string): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.from('lab_notes').delete().eq('note_id', id);
  } catch { /* localStorage already updated */ }
}
