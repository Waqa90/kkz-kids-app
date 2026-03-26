// Lab notes — OCR text + activity metadata for parent lab workflow

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

export function getLabNotes(): LabNote[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LAB_NOTES_KEY);
    return raw ? (JSON.parse(raw) as LabNote[]) : [];
  } catch { return []; }
}

export function saveLabNote(note: LabNote): void {
  if (typeof window === 'undefined') return;
  const existing = getLabNotes().filter((n) => n.id !== note.id);
  localStorage.setItem(LAB_NOTES_KEY, JSON.stringify([note, ...existing]));
}

export function updateLabNote(id: string, updates: Partial<LabNote>): void {
  if (typeof window === 'undefined') return;
  const notes = getLabNotes().map((n) => (n.id === id ? { ...n, ...updates } : n));
  localStorage.setItem(LAB_NOTES_KEY, JSON.stringify(notes));
}

export function deleteLabNote(id: string): void {
  if (typeof window === 'undefined') return;
  const notes = getLabNotes().filter((n) => n.id !== id);
  localStorage.setItem(LAB_NOTES_KEY, JSON.stringify(notes));
}

export function getLabNoteById(id: string): LabNote | null {
  return getLabNotes().find((n) => n.id === id) ?? null;
}
