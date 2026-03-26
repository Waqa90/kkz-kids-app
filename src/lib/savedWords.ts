// Saved/practice words — syncs with Supabase, falls back to localStorage

import { createClient } from '@/lib/supabase/client';

export interface SavedWord {
  id: string;
  word: string;
  source: 'story' | 'photo';
  storyTitle?: string;
  addedAt: number;       // timestamp ms
  practiced: boolean;
  practiceCount: number;
}

const STORAGE_KEY = 'kitty_saved_words';
const PROFILE_KEY = 'kitty';

// ── localStorage helpers ──────────────────────────────────────────────────────

export function loadSavedWords(): SavedWord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedWord[]) : [];
  } catch {
    return [];
  }
}

export function persistSavedWords(words: SavedWord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

// ── Supabase row converter ────────────────────────────────────────────────────

function rowToWord(row: any): SavedWord {
  return {
    id: row.id,
    word: row.word,
    source: row.source as 'story' | 'photo',
    storyTitle: row.story_title ?? undefined,
    addedAt: Number(row.added_at),
    practiced: row.practiced,
    practiceCount: row.practice_count,
  };
}

// ── Async Supabase API ────────────────────────────────────────────────────────

/** Load words from Supabase, fall back to localStorage */
export async function loadSavedWordsAsync(): Promise<SavedWord[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('practice_words')
      .select('*')
      .eq('profile_key', PROFILE_KEY)
      .order('added_at', { ascending: false });

    if (error || !data) {
      return loadSavedWords();
    }

    const words = data.map(rowToWord);
    persistSavedWords(words);
    return words;
  } catch {
    return loadSavedWords();
  }
}

/** Add a new word — ignore duplicates (case-insensitive) */
export async function addSavedWordAsync(
  word: string,
  source: 'story' | 'photo',
  storyTitle?: string
): Promise<SavedWord[]> {
  const existing = loadSavedWords();
  const clean = word.toLowerCase().trim();
  const alreadyExists = existing.some((w) => w.word.toLowerCase() === clean);
  if (alreadyExists) return existing;

  const addedAt = Date.now();

  // Optimistic local update
  const tempId = `${addedAt}-${Math.random().toString(36).slice(2, 7)}`;
  const newWord: SavedWord = {
    id: tempId,
    word: word.trim(),
    source,
    storyTitle,
    addedAt,
    practiced: false,
    practiceCount: 0,
  };
  const updated = [newWord, ...existing];
  persistSavedWords(updated);

  // Sync to Supabase
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('practice_words')
      .insert({
        profile_key: PROFILE_KEY,
        word: word.trim(),
        source,
        story_title: storyTitle ?? null,
        added_at: addedAt,
        practiced: false,
        practice_count: 0,
      })
      .select()
      .single();

    if (data) {
      // Replace temp id with real Supabase id
      const synced = updated.map((w) => (w.id === tempId ? rowToWord(data) : w));
      persistSavedWords(synced);
      return synced;
    }
  } catch {
    // Supabase unavailable — localStorage already updated
  }

  return updated;
}

/** Synchronous add (localStorage only, for backward compat) */
export function addSavedWord(
  word: string,
  source: 'story' | 'photo',
  storyTitle?: string
): SavedWord[] {
  const existing = loadSavedWords();
  const clean = word.toLowerCase().trim();
  const alreadyExists = existing.some((w) => w.word.toLowerCase() === clean);
  if (alreadyExists) return existing;

  const newWord: SavedWord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    word: word.trim(),
    source,
    storyTitle,
    addedAt: Date.now(),
    practiced: false,
    practiceCount: 0,
  };

  const updated = [newWord, ...existing];
  persistSavedWords(updated);

  // Fire-and-forget Supabase sync
  if (typeof window !== 'undefined') {
    const supabase = createClient();
    void (async () => {
      try {
        await supabase
          .from('practice_words')
          .insert({
            id: newWord.id,
            profile_key: PROFILE_KEY,
            word: newWord.word,
            source: newWord.source,
            story_title: newWord.storyTitle ?? null,
            added_at: newWord.addedAt,
            practiced: false,
            practice_count: 0,
          });
      } catch { /* localStorage already updated */ }
    })();
  }

  return updated;
}

/** Toggle practiced state */
export async function togglePracticedAsync(id: string): Promise<SavedWord[]> {
  const existing = loadSavedWords();
  const word = existing.find((w) => w.id === id);
  if (!word) return existing;

  const newPracticed = !word.practiced;
  const newCount = newPracticed ? word.practiceCount + 1 : word.practiceCount;

  const updated = existing.map((w) =>
    w.id === id ? { ...w, practiced: newPracticed, practiceCount: newCount } : w
  );
  persistSavedWords(updated);

  try {
    const supabase = createClient();
    await supabase
      .from('practice_words')
      .update({ practiced: newPracticed, practice_count: newCount })
      .eq('id', id);
  } catch {
    // localStorage already updated
  }

  return updated;
}

/** Synchronous toggle (localStorage + fire-and-forget Supabase) */
export function togglePracticed(id: string): SavedWord[] {
  const existing = loadSavedWords();
  const word = existing.find((w) => w.id === id);
  if (!word) return existing;

  const newPracticed = !word.practiced;
  const newCount = newPracticed ? word.practiceCount + 1 : word.practiceCount;

  const updated = existing.map((w) =>
    w.id === id ? { ...w, practiced: newPracticed, practiceCount: newCount } : w
  );
  persistSavedWords(updated);

  if (typeof window !== 'undefined') {
    const supabase = createClient();
    void (async () => {
      try {
        await supabase
          .from('practice_words')
          .update({ practiced: newPracticed, practice_count: newCount })
          .eq('id', id);
      } catch { /* localStorage already updated */ }
    })();
  }

  return updated;
}

/** Remove a word by id */
export async function removeWordAsync(id: string): Promise<SavedWord[]> {
  const existing = loadSavedWords();
  const updated = existing.filter((w) => w.id !== id);
  persistSavedWords(updated);

  try {
    const supabase = createClient();
    await supabase.from('practice_words').delete().eq('id', id);
  } catch {
    // localStorage already updated
  }

  return updated;
}

/** Synchronous remove (localStorage + fire-and-forget Supabase) */
export function removeWord(id: string): SavedWord[] {
  const existing = loadSavedWords();
  const updated = existing.filter((w) => w.id !== id);
  persistSavedWords(updated);

  if (typeof window !== 'undefined') {
    const supabase = createClient();
    void (async () => {
      try {
        await supabase
          .from('practice_words')
          .delete()
          .eq('id', id);
      } catch { /* localStorage already updated */ }
    })();
  }

  return updated;
}

/** Clear all words */
export async function clearAllWordsAsync(): Promise<SavedWord[]> {
  persistSavedWords([]);

  try {
    const supabase = createClient();
    await supabase
      .from('practice_words')
      .delete()
      .eq('profile_key', PROFILE_KEY);
  } catch {
    // localStorage already cleared
  }

  return [];
}

/** Synchronous clear */
export function clearAllWords(): SavedWord[] {
  persistSavedWords([]);

  if (typeof window !== 'undefined') {
    const supabase = createClient();
    void (async () => {
      try {
        await supabase
          .from('practice_words')
          .delete()
          .eq('profile_key', PROFILE_KEY);
      } catch { /* localStorage already cleared */ }
    })();
  }

  return [];
}

/** Check if a word is already saved */
export function isWordSaved(word: string): boolean {
  const existing = loadSavedWords();
  return existing.some((w) => w.word.toLowerCase() === word.toLowerCase().trim());
}