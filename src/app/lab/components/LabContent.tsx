'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getLabNotes, getLabNotesAsync, deleteLabNote, updateLabNote, type LabNote } from '@/lib/labNotes';
import { saveUploadedActivity, deleteUploadedActivity, getUploadedActivities, getUploadedActivitiesAsync, type SubjectActivity } from '@/lib/subjectContent';
import { SUBJECT_META, type SubjectKey } from '@/lib/childProfile';
import { loadParentSettings } from '@/app/parent/components/SettingsPanel';
import PinGate from '@/components/PinGate';
import AppNav from '@/components/AppNav';
import toast from 'react-hot-toast';
import GenerateStory from '@/app/parent/components/GenerateStory';
import ScannerPanel from './ScannerPanel';
import ExamBuilderPanel from './ExamBuilderPanel';

type LabTab = 'scanner' | 'notes' | 'exam' | 'practice';
type PracticeView = 'list' | 'create' | 'edit';

const SUBJECT_KEYS = Object.keys(SUBJECT_META) as SubjectKey[];

// ── Practice Card Builder ─────────────────────────────────────────────────────

interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  marks: number;
}

function newPQ(): PracticeQuestion {
  return { id: `pq-${Date.now()}-${Math.random().toString(36).slice(2)}`, question: '', options: ['', '', '', ''], correctIndex: 0, marks: 1 };
}

interface PracticeCardBuilderProps {
  initialData?: SubjectActivity | null;
  onBack: () => void;
}

function PracticeCardBuilder({ initialData, onBack }: PracticeCardBuilderProps) {
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [subject, setSubject] = useState<SubjectKey>(initialData?.subject ?? 'maths');
  const [classLevel, setClassLevel] = useState<3 | 4 | 5>(initialData?.class ?? 4);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(initialData?.difficulty ?? 'Medium');
  const [questions, setQuestions] = useState<PracticeQuestion[]>(
    initialData?.questions?.length
      ? initialData.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: (q.options ?? []).length >= 4 ? [...(q.options ?? [])] : [...(q.options ?? []), ...Array(4 - (q.options ?? []).length).fill('')],
          correctIndex: q.correctIndex ?? 0,
          marks: 1,
        }))
      : [newPQ()]
  );

  const addQ = () => setQuestions((prev) => [...prev, newPQ()]);
  const removeQ = (idx: number) => setQuestions((prev) => prev.filter((_, i) => i !== idx));
  const updateQ = (idx: number, upd: Partial<PracticeQuestion>) =>
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, ...upd } : q)));
  const updateOpt = (qi: number, oi: number, val: string) =>
    setQuestions((prev) => prev.map((q, i) => {
      if (i !== qi) return q;
      const opts = [...q.options];
      opts[oi] = val;
      return { ...q, options: opts };
    }));

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Enter a card title.'); return; }
    const validQs = questions.filter((q) => q.question.trim() && q.options.some((o) => o.trim()));
    if (validQs.length === 0) { toast.error('Add at least one question.'); return; }
    const meta = SUBJECT_META[subject];
    const id = isEditing ? initialData!.id : `pc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    await saveUploadedActivity({
      id,
      subject,
      class: classLevel,
      title: title.trim(),
      emoji: meta.emoji,
      color: meta.color,
      levelColor: meta.levelColor,
      activityType: 'multiple-choice',
      source: 'uploaded',
      difficulty,
      questions: validQs.map((q) => {
        const filteredOptions = q.options.filter((o) => o.trim());
        const correctAnswer = q.options[q.correctIndex] ?? q.options[0];
        const newCorrectIndex = Math.max(0, filteredOptions.indexOf(correctAnswer));
        return {
          id: q.id,
          question: q.question,
          type: 'multiple-choice' as const,
          options: filteredOptions,
          correctAnswer,
          correctIndex: newCorrectIndex,
        };
      }),
    });
    toast.success(isEditing ? `✅ "${title}" updated!` : `✅ "${title}" saved to ${meta.label}!`);
    onBack();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold transition-colors">←</button>
        <h2 className="text-base font-extrabold text-purple-800">{isEditing ? '✏️ Edit Practice Card' : '+ New Practice Card'}</h2>
      </div>

      <div className="bg-white rounded-3xl border-2 border-purple-100 p-4 shadow-sm">
        <p className="font-extrabold text-purple-700 mb-3">Card Details</p>
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title (e.g. Multiplication Tables)"
            className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none font-semibold text-sm" />
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-bold text-purple-500 block mb-1">Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value as SubjectKey)}
                className="w-full px-2 py-1.5 rounded-xl border-2 border-purple-200 font-bold text-purple-700 text-xs bg-white">
                {SUBJECT_KEYS.map((s) => <option key={s} value={s}>{SUBJECT_META[s].emoji} {SUBJECT_META[s].label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-purple-500 block mb-1">Class</label>
              <div className="flex gap-1">
                {([3, 4, 5] as const).map((c) => (
                  <button key={c} onClick={() => setClassLevel(c)}
                    className={`flex-1 py-1.5 rounded-lg font-extrabold text-xs ${classLevel === c ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-purple-500 block mb-1">Difficulty</label>
              <div className="flex gap-1">
                {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${difficulty === d
                      ? d === 'Easy' ? 'bg-green-400 text-white' : d === 'Medium' ? 'bg-yellow-400 text-white' : 'bg-red-400 text-white'
                      : 'bg-gray-100 text-gray-500'}`}>
                    {d[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {questions.map((q, qi) => (
        <div key={q.id} className="bg-white rounded-2xl border-2 border-purple-100 p-4 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full font-extrabold text-xs flex-shrink-0 mt-0.5">
              {qi + 1}
            </span>
            <div className="flex-1 space-y-2">
              <textarea value={q.question} onChange={(e) => updateQ(qi, { question: e.target.value })}
                placeholder="Enter question…" rows={2}
                className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm font-medium resize-none" />
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs font-bold text-gray-500 flex-shrink-0">
                    {String.fromCharCode(65 + oi)}
                  </span>
                  <input value={opt} onChange={(e) => updateOpt(qi, oi, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                    className={`flex-1 px-3 py-1.5 rounded-xl border-2 text-sm font-medium focus:outline-none ${q.correctIndex === oi ? 'border-green-400 bg-green-50' : 'border-gray-200 focus:border-purple-300'}`} />
                  <button onClick={() => updateQ(qi, { correctIndex: oi })}
                    className={`text-xs px-2 py-1 rounded-lg font-bold ${q.correctIndex === oi ? 'bg-green-400 text-white' : 'bg-gray-100 text-gray-400 hover:bg-green-100'}`}>
                    ✓
                  </button>
                </div>
              ))}
            </div>
            {questions.length > 1 && (
              <button onClick={() => removeQ(qi)} className="text-red-300 hover:text-red-500 text-sm flex-shrink-0">🗑</button>
            )}
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        <button onClick={addQ}
          className="flex-1 py-3 bg-purple-100 text-purple-700 rounded-2xl font-bold hover:bg-purple-200 transition-all">
          + Add Question
        </button>
        <button onClick={handleSave} disabled={!title.trim()}
          className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-extrabold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50">
          {isEditing ? '✅ Update Card' : '🚀 Save to Subjects'}
        </button>
      </div>
    </div>
  );
}

// ── My Cards List ─────────────────────────────────────────────────────────────

interface MyCardsListProps {
  onEdit: (card: SubjectActivity) => void;
  onCreateNew: () => void;
  refreshKey: number;
}

function MyCardsList({ onEdit, onCreateNew, refreshKey }: MyCardsListProps) {
  const [cards, setCards] = useState<SubjectActivity[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setCards(getUploadedActivities());
    getUploadedActivitiesAsync().then(setCards).catch(() => {});
  }, [refreshKey]);

  const handleDelete = (id: string) => {
    deleteUploadedActivity(id);
    setCards((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
    toast.success('Card deleted.');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-purple-800">🃏 My Practice Cards</h2>
          <p className="text-xs text-purple-400 font-medium">{cards.length} card{cards.length !== 1 ? 's' : ''} saved</p>
        </div>
        <button onClick={onCreateNew}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-extrabold text-sm rounded-2xl shadow transition-all active:scale-95 hover:opacity-90">
          + New Card
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-purple-200">
          <div className="text-5xl mb-3">🃏</div>
          <p className="font-extrabold text-purple-700 mb-1">No practice cards yet</p>
          <p className="text-xs text-purple-400 mb-4">Create your first card to add activities for the children</p>
          <button onClick={onCreateNew}
            className="px-6 py-2.5 bg-purple-500 text-white font-bold rounded-2xl hover:bg-purple-600 transition-all">
            + Create First Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cards.map((card) => (
            <div key={card.id} className={`${card.color} rounded-3xl border-2 border-transparent p-4 shadow-md`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{card.emoji}</span>
                  <div>
                    <p className="font-extrabold text-gray-800 text-sm leading-tight">{card.title}</p>
                    <div className="flex gap-1 mt-0.5 flex-wrap">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${card.levelColor}`}>
                        {SUBJECT_META[card.subject as SubjectKey]?.label ?? card.subject}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-white text-purple-700">
                        Class {card.class}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                        card.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        card.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {card.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => onEdit(card)}
                    className="p-2 rounded-xl bg-white text-purple-600 hover:bg-purple-100 transition-colors text-sm font-bold"
                    title="Edit card">
                    ✏️
                  </button>
                  <button onClick={() => setDeleteConfirmId(card.id)}
                    className="p-2 rounded-xl bg-white text-red-400 hover:bg-red-50 transition-colors text-sm font-bold"
                    title="Delete card">
                    🗑️
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2">{card.questions.length} question{card.questions.length !== 1 ? 's' : ''}</p>

              {deleteConfirmId === card.id && (
                <div className="mt-1 p-2 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-xs text-red-700 font-bold mb-1">Delete "{card.title}"?</p>
                  <div className="flex gap-1">
                    <button onClick={() => handleDelete(card.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold">Yes, delete</button>
                    <button onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main LabContent ──────────────────────────────────────────────────────────

export default function LabContent() {
  const [unlocked, setUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<LabTab>('scanner');
  const [notes, setNotes] = useState<LabNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<LabNote | null>(null);
  const [filterChild, setFilterChild] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedActivities, setGeneratedActivities] = useState<any[]>([]);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  // Practice Cards view state
  const [practiceView, setPracticeView] = useState<PracticeView>('list');
  const [editingCard, setEditingCard] = useState<SubjectActivity | null>(null);
  const [cardRefreshKey, setCardRefreshKey] = useState(0);

  useEffect(() => {
    const isUnlocked = typeof window !== 'undefined' && sessionStorage.getItem('kkz_lab_unlocked') === 'true';
    setUnlocked(isUnlocked);
  }, []);

  const loadNotes = useCallback(() => {
    // Show local instantly, then sync from Supabase
    setNotes(getLabNotes());
    getLabNotesAsync().then((synced) => setNotes(synced)).catch(() => {});
  }, []);

  useEffect(() => {
    if (unlocked) {
      loadNotes();
      // Sync uploaded activities from Supabase so phone-created cards appear on desktop
      getUploadedActivitiesAsync().catch(() => {});
    }
  }, [unlocked, loadNotes]);

  const handleUnlock = () => {
    sessionStorage.setItem('kkz_lab_unlocked', 'true');
    setUnlocked(true);
  };

  const handleLock = () => {
    sessionStorage.removeItem('kkz_lab_unlocked');
    setUnlocked(false);
    setSelectedNote(null);
    setGeneratedActivities([]);
  };

  const handleDelete = (id: string) => {
    deleteLabNote(id);
    if (selectedNote?.id === id) setSelectedNote(null);
    loadNotes();
    setDeleteConfirm(null);
  };

  const handleSelectNote = (note: LabNote) => {
    setSelectedNote(note);
    setGeneratedActivities(note.processedActivities ?? []);
    setTitleDraft(note.title);
  };

  const settings = loadParentSettings();
  const children = Object.keys(settings.children);

  const filteredNotes = notes.filter((n) => {
    if (filterChild !== 'all' && n.childName !== filterChild) return false;
    if (filterSubject !== 'all' && n.subject !== filterSubject) return false;
    return true;
  });

  const handleGenerate = async () => {
    if (!selectedNote) return;
    setGenerating(true);
    try {
      const response = await fetch('/api/ai/chat-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'GROQ',
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: `You are an expert primary school teacher in Fiji creating educational activities for Class ${selectedNote.class} students.\n\nFrom this text, create ${selectedNote.questionCount} questions of types: ${selectedNote.activityTypes.join(', ')} for Class ${selectedNote.class} ${selectedNote.subject}.\n\nText: ${selectedNote.rawText}\n\nReturn ONLY valid JSON (no markdown, no explanation) in this format:\n{"activities":[{"title":"Activity Title","activityType":"multiple-choice","questions":[{"question":"...","type":"multiple-choice","options":["a","b","c","d"],"correctAnswer":"correct option","hint":"optional hint"}]}]}`
            }
          ],
          systemPrompt: 'You are an expert primary school teacher in Fiji. Return ONLY valid JSON, no markdown, no explanation.',
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? data.details ?? 'API error');
      const raw = data.content ?? data.message ?? data.choices?.[0]?.message?.content ?? '';
      // Strip markdown code fences Gemini sometimes wraps around JSON
      const clean = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(clean);
      const acts = parsed.activities ?? [];
      setGeneratedActivities(acts);
      updateLabNote(selectedNote.id, { processedActivities: acts });
      setSelectedNote((prev) => prev ? { ...prev, processedActivities: acts } : prev);
      loadNotes();
      toast.success('Activities generated!');
    } catch (err) {
      console.error(err);
      toast.error('Generation failed. Check your Groq API key in Vercel settings.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = () => {
    if (!selectedNote || generatedActivities.length === 0) return;
    const subjectKey = selectedNote.subject as SubjectKey;
    generatedActivities.forEach((act: any, idx: number) => {
      saveUploadedActivity({
        id: `${selectedNote.id}-${idx}`,
        subject: subjectKey,
        class: selectedNote.class,
        title: act.title ?? selectedNote.title,
        emoji: SUBJECT_META[subjectKey]?.emoji ?? '📚',
        color: SUBJECT_META[subjectKey]?.color ?? 'bg-purple-100',
        levelColor: SUBJECT_META[subjectKey]?.levelColor ?? 'bg-purple-200 text-purple-800',
        activityType: act.activityType ?? 'multiple-choice',
        questions: (act.questions ?? []).map((q: any, qi: number) => ({
          id: `${selectedNote.id}-${idx}-${qi}`,
          question: q.question,
          type: q.type ?? 'multiple-choice',
          options: q.options,
          correctAnswer: q.correctAnswer,
          hint: q.hint,
        })),
        source: 'uploaded' as const,
        difficulty: (selectedNote.class === 3 ? 'Easy' : selectedNote.class === 5 ? 'Hard' : 'Medium') as 'Easy' | 'Medium' | 'Hard',
      });
    });
    const now = new Date().toISOString();
    updateLabNote(selectedNote.id, { publishedAt: now });
    setSelectedNote((prev) => prev ? { ...prev, publishedAt: now } : prev);
    loadNotes();
    toast.success(`✅ Published to ${SUBJECT_META[subjectKey]?.label ?? selectedNote.subject}!`);
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <PinGate title="🧪 Lab" subtitle="Parent access required" onSuccess={handleUnlock} />
      </div>
    );
  }

  const TABS: { id: LabTab; label: string; emoji: string }[] = [
    { id: 'scanner', label: 'Scanner', emoji: '📷' },
    { id: 'notes', label: 'Notes', emoji: '📁' },
    { id: 'exam', label: 'Exam Builder', emoji: '📝' },
    { id: 'practice', label: 'Practice Cards', emoji: '🃏' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
      <AppNav />
      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Lab header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧪</span>
            <h1 className="text-xl font-extrabold text-purple-800">Lab</h1>
          </div>
          <button onClick={handleLock} className="text-xs font-bold text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors">
            🔒 Lock Lab
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-white rounded-2xl border-2 border-purple-100 p-1 mb-5 overflow-x-auto shadow-sm">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id === 'practice') { setPracticeView('list'); setEditingCard(null); } }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-1 justify-center ${activeTab === tab.id ? 'bg-purple-500 text-white shadow-md' : 'text-purple-500 hover:bg-purple-50'}`}>
              <span>{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── SCANNER TAB ── */}
        {activeTab === 'scanner' && (
          <ScannerPanel onSaved={() => { loadNotes(); setActiveTab('notes'); }} />
        )}

        {/* ── NOTES TAB ── */}
        {activeTab === 'notes' && (
          <div className="md:flex md:gap-6">
            {/* Sidebar */}
            <div className="md:w-72 flex-shrink-0">
              {/* Filters */}
              <div className="flex gap-2 mb-3">
                <select value={filterChild} onChange={(e) => setFilterChild(e.target.value)}
                  className="flex-1 text-xs rounded-xl border border-purple-200 px-2 py-1.5 font-semibold text-purple-700 bg-white">
                  <option value="all">All children</option>
                  {children.map((c) => <option key={c} value={c}>{c}</option>)}
                  <option value="parent">Parent</option>
                </select>
                <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}
                  className="flex-1 text-xs rounded-xl border border-purple-200 px-2 py-1.5 font-semibold text-purple-700 bg-white">
                  <option value="all">All subjects</option>
                  {SUBJECT_KEYS.map((s) => <option key={s} value={s}>{SUBJECT_META[s].label}</option>)}
                </select>
              </div>

              {/* Note list */}
              <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
                {filteredNotes.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-2xl border-2 border-dashed border-purple-200">
                    <p className="text-4xl mb-2">📷</p>
                    <p className="text-sm text-purple-400 font-medium">No notes yet.</p>
                    <p className="text-xs text-purple-300 mt-1">Scan a document in the Scanner tab!</p>
                    <button onClick={() => setActiveTab('scanner')}
                      className="mt-3 px-4 py-2 bg-purple-100 text-purple-600 rounded-xl text-xs font-bold hover:bg-purple-200 transition-all">
                      Go to Scanner →
                    </button>
                  </div>
                ) : filteredNotes.map((note) => (
                  <div key={note.id}
                    className={`bg-white rounded-2xl border-2 p-3 cursor-pointer transition-all hover:shadow-md ${selectedNote?.id === note.id ? 'border-purple-400 shadow-md' : 'border-purple-100'}`}
                    onClick={() => handleSelectNote(note)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1 flex-wrap">
                          <span className="text-base">{SUBJECT_META[note.subject as SubjectKey]?.emoji ?? '📚'}</span>
                          <span className="text-xs bg-purple-100 text-purple-600 rounded-full px-1.5 font-bold">{SUBJECT_META[note.subject as SubjectKey]?.label ?? note.subject}</span>
                          <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-1.5 font-bold">Class {note.class}</span>
                          {note.publishedAt
                            ? <span className="text-xs bg-green-100 text-green-600 rounded-full px-1.5 font-bold">✅ Published</span>
                            : <span className="text-xs bg-yellow-100 text-yellow-600 rounded-full px-1.5 font-bold">📝 Draft</span>}
                        </div>
                        <p className="text-xs font-semibold text-purple-800 truncate">{note.title}</p>
                        <p className="text-xs text-purple-400">{note.childName} · {new Date(note.extractedAt).toLocaleDateString()}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(note.id); }}
                        className="text-red-300 hover:text-red-500 text-sm flex-shrink-0">🗑</button>
                    </div>
                    {deleteConfirm === note.id && (
                      <div className="mt-2 p-2 bg-red-50 rounded-xl border border-red-200">
                        <p className="text-xs text-red-700 font-bold mb-1">Delete this note?</p>
                        <div className="flex gap-1">
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }} className="px-2 py-0.5 bg-red-500 text-white rounded-lg text-xs font-bold">Yes</button>
                          <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">No</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Builder panel */}
            <div className="flex-1 min-w-0 mt-4 md:mt-0">
              {!selectedNote ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border-2 border-dashed border-purple-200">
                  <p className="text-4xl mb-2">👈</p>
                  <p className="text-purple-400 font-semibold text-sm">Select a note to build activities</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Note header */}
                  <div className="bg-white rounded-3xl border-2 border-purple-100 p-4">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-2xl">{SUBJECT_META[selectedNote.subject as SubjectKey]?.emoji ?? '📚'}</span>
                      {editingTitle ? (
                        <input value={titleDraft} onChange={(e) => setTitleDraft(e.target.value)}
                          onBlur={() => { updateLabNote(selectedNote.id, { title: titleDraft }); setSelectedNote((p) => p ? { ...p, title: titleDraft } : p); setEditingTitle(false); }}
                          className="flex-1 text-sm font-bold border border-purple-300 rounded-lg px-2 py-1 focus:outline-none" autoFocus />
                      ) : (
                        <span className="text-sm font-extrabold text-purple-800 flex-1 cursor-pointer hover:text-purple-600" onClick={() => setEditingTitle(true)}>
                          {selectedNote.title} ✏️
                        </span>
                      )}
                      <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 font-bold">Class {selectedNote.class}</span>
                      <span className="text-xs bg-purple-100 text-purple-600 rounded-full px-2 font-bold">{selectedNote.childName}</span>
                      {selectedNote.publishedAt
                        ? <span className="text-xs bg-green-100 text-green-600 rounded-full px-2 font-bold">✅ Published</span>
                        : <span className="text-xs bg-yellow-100 text-yellow-600 rounded-full px-2 font-bold">📝 Draft</span>}
                    </div>
                    <div className="text-xs font-semibold text-purple-400">{selectedNote.activityTypes.join(' · ')} · {selectedNote.questionCount} questions</div>
                  </div>

                  {/* Raw text */}
                  <div className="bg-purple-50 rounded-3xl border-2 border-purple-100 p-4 max-h-40 overflow-y-auto">
                    <p className="text-xs font-bold text-purple-600 mb-2">📄 Extracted Text</p>
                    <p className="text-sm text-purple-800 font-medium whitespace-pre-wrap">{selectedNote.rawText || 'No text extracted yet.'}</p>
                  </div>

                  {/* Generate */}
                  <button onClick={handleGenerate} disabled={generating || !selectedNote.rawText}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-lg transition-all active:scale-95">
                    {generating ? '🤖 Creating activities…' : '🤖 Generate Activities with AI'}
                  </button>

                  {/* Generated activities */}
                  {generatedActivities.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {generatedActivities.map((act: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-2xl border-2 border-purple-100 p-4">
                          <p className="font-extrabold text-purple-800 mb-1">{act.title}</p>
                          <span className="text-xs bg-purple-100 text-purple-600 rounded-full px-2 py-0.5 font-bold">{act.activityType}</span>
                          <div className="mt-2 flex flex-col gap-1">
                            {(act.questions ?? []).slice(0, 3).map((q: any, qi: number) => (
                              <p key={qi} className="text-xs text-purple-600 truncate">• {q.question}</p>
                            ))}
                            {(act.questions ?? []).length > 3 && <p className="text-xs text-purple-400">…and {(act.questions ?? []).length - 3} more</p>}
                          </div>
                        </div>
                      ))}
                      <button onClick={handlePublish}
                        className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-extrabold rounded-2xl shadow-lg transition-all active:scale-95">
                        🚀 Publish to {SUBJECT_META[selectedNote.subject as SubjectKey]?.label ?? selectedNote.subject}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EXAM BUILDER TAB ── */}
        {activeTab === 'exam' && (
          <ExamBuilderPanel />
        )}

        {/* ── PRACTICE CARDS TAB ── */}
        {activeTab === 'practice' && practiceView === 'list' && (
          <MyCardsList
            refreshKey={cardRefreshKey}
            onCreateNew={() => { setEditingCard(null); setPracticeView('create'); }}
            onEdit={(card) => { setEditingCard(card); setPracticeView('edit'); }}
          />
        )}
        {activeTab === 'practice' && practiceView === 'create' && (
          <PracticeCardBuilder
            onBack={() => { setPracticeView('list'); setCardRefreshKey((k) => k + 1); }}
          />
        )}
        {activeTab === 'practice' && practiceView === 'edit' && (
          <PracticeCardBuilder
            initialData={editingCard}
            onBack={() => { setEditingCard(null); setPracticeView('list'); setCardRefreshKey((k) => k + 1); }}
          />
        )}

        {/* Generate New Story — shown in notes tab */}
        {activeTab === 'notes' && (
          <div className="mt-6">
            <GenerateStory activityResults={[]} />
          </div>
        )}
      </div>
    </div>
  );
}
