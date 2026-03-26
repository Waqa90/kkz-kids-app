'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getLabNotes, deleteLabNote, updateLabNote, type LabNote } from '@/lib/labNotes';
import { saveUploadedActivity } from '@/lib/subjectContent';
import { SUBJECT_META, type SubjectKey } from '@/lib/childProfile';
import { loadParentSettings } from '@/app/parent/components/SettingsPanel';
import PinGate from '@/components/PinGate';
import AppNav from '@/components/AppNav';
import toast from 'react-hot-toast';
import GenerateStory from '@/app/parent/components/GenerateStory';

type Panel = 'notes' | 'builder';

const SUBJECT_KEYS = Object.keys(SUBJECT_META) as SubjectKey[];

export default function LabContent() {
  const [unlocked, setUnlocked] = useState(false);
  const [panel, setPanel] = useState<Panel>('notes');
  const [notes, setNotes] = useState<LabNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<LabNote | null>(null);
  const [filterChild, setFilterChild] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedActivities, setGeneratedActivities] = useState<any[]>([]);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');

  useEffect(() => {
    const isUnlocked = typeof window !== 'undefined' && sessionStorage.getItem('kkz_lab_unlocked') === 'true';
    setUnlocked(isUnlocked);
  }, []);

  const loadNotes = useCallback(() => setNotes(getLabNotes()), []);

  useEffect(() => {
    if (unlocked) loadNotes();
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
    setPanel('builder');
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
          provider: 'ANTHROPIC',
          model: 'claude-sonnet-4-6',
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
      const content = data.content ?? data.message ?? data.choices?.[0]?.message?.content ?? '';
      const parsed = JSON.parse(content);
      const acts = parsed.activities ?? [];
      setGeneratedActivities(acts);
      updateLabNote(selectedNote.id, { processedActivities: acts });
      setSelectedNote((prev) => prev ? { ...prev, processedActivities: acts } : prev);
      loadNotes();
      toast.success('Activities generated!');
    } catch (err) {
      toast.error('Generation failed. Check your AI settings and try again.');
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

        {/* Mobile tabs */}
        <div className="md:hidden flex border-b border-purple-100 mb-4">
          <button onClick={() => setPanel('notes')} className={`flex-1 py-2.5 text-sm font-extrabold ${panel === 'notes' ? 'text-purple-700 border-b-2 border-purple-500' : 'text-purple-400'}`}>📁 Notes</button>
          <button onClick={() => setPanel('builder')} className={`flex-1 py-2.5 text-sm font-extrabold ${panel === 'builder' ? 'text-purple-700 border-b-2 border-purple-500' : 'text-purple-400'}`}>🔨 Builder</button>
        </div>

        <div className="md:flex md:gap-6">
          {/* ── Sidebar / Notes ── */}
          <div className={`md:w-72 flex-shrink-0 ${panel === 'builder' ? 'hidden md:block' : ''}`}>
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
                  <p className="text-xs text-purple-300 mt-1">Upload a photo in the Camera tab!</p>
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

          {/* ── Main Panel / Builder ── */}
          <div className={`flex-1 min-w-0 ${panel === 'notes' && !selectedNote ? 'hidden md:block' : ''}`}>
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
                        className="flex-1 text-sm font-bold border border-purple-300 rounded-lg px-2 py-1 focus:outline-none"
                        autoFocus />
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

                {/* Generate button */}
                <button onClick={handleGenerate} disabled={generating || !selectedNote.rawText}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-lg transition-all active:scale-95">
                  {generating ? '🤖 Creating activities…' : '🤖 Generate Activities'}
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

        {/* Generate New Story */}
        <div className="mt-6">
          <GenerateStory activityResults={[]} />
        </div>
      </div>
    </div>
  );
}
