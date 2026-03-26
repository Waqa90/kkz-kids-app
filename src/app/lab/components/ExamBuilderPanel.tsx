'use client';

import React, { useState } from 'react';
import { CHILD_NAMES, SUBJECT_META, type ChildName, type SubjectKey, getChildClass } from '@/lib/childProfile';
import { loadParentSettings } from '@/app/parent/components/SettingsPanel';
import toast from 'react-hot-toast';

// ── Types (match AssessmentContent.tsx exactly) ────────────────────────────────

type QuestionType = 'multiple-choice' | 'fill-blank' | 'long-answer' | 'comprehension' | 'word-bank';
type SectionType = QuestionType;

interface AssessmentQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  marks: number;
  passage?: string;
  wordBank?: string[];
}

interface AssessmentSection {
  label: string;
  title: string;
  type: SectionType;
  questions: AssessmentQuestion[];
  marks: number;
}

interface AssessmentCard {
  id: string;
  title: string;
  subject: string;
  term: string;
  classLevel: number;
  childName: string;
  totalMarks: number;
  timeLimit: number;
  sections: AssessmentSection[];
  createdAt: string;
}

const STORAGE_KEY = 'kkz_assessments';
const SECTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SUBJECT_KEYS = Object.keys(SUBJECT_META) as SubjectKey[];
const TERMS = ['Term 1', 'Term 2', 'Term 3', 'Short Test', 'Practice Quiz'];
const SECTION_TYPES: { value: SectionType; label: string; desc: string }[] = [
  { value: 'multiple-choice', label: 'Multiple Choice', desc: 'Select one correct answer from options' },
  { value: 'fill-blank', label: 'Fill in the Blank', desc: 'Complete the sentence with a missing word' },
  { value: 'long-answer', label: 'Long Answer', desc: 'Write a detailed answer' },
  { value: 'comprehension', label: 'Comprehension', desc: 'Read a passage, then answer questions' },
  { value: 'word-bank', label: 'Word Bank / Gap Fill', desc: 'Place provided words into sentences' },
];

function newQuestion(type: QuestionType): AssessmentQuestion {
  return {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    question: '',
    type,
    options: type === 'multiple-choice' ? ['', '', '', ''] : undefined,
    correctAnswer: '',
    marks: 2,
    passage: type === 'comprehension' ? '' : undefined,
    wordBank: type === 'word-bank' ? [''] : undefined,
  };
}

function newSection(idx: number): AssessmentSection {
  return {
    label: SECTION_LABELS[idx] ?? String(idx + 1),
    title: '',
    type: 'multiple-choice',
    questions: [newQuestion('multiple-choice')],
    marks: 0,
  };
}

function calcSectionMarks(s: AssessmentSection): number {
  return s.questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
}

function saveExam(exam: AssessmentCard): void {
  if (typeof window === 'undefined') return;
  try {
    const existing: AssessmentCard[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = [exam, ...existing.filter((e) => e.id !== exam.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch { /* ignore */ }
}

interface Props {
  onSaved?: () => void;
}

export default function ExamBuilderPanel({ onSaved }: Props) {
  const settings = loadParentSettings();

  // Metadata
  const [examTitle, setExamTitle] = useState('');
  const [selectedChild, setSelectedChild] = useState<ChildName>(CHILD_NAMES[0]);
  const [subject, setSubject] = useState<SubjectKey>('english');
  const [term, setTerm] = useState(TERMS[0]);
  const [timeLimit, setTimeLimit] = useState(30);

  // Sections
  const [sections, setSections] = useState<AssessmentSection[]>([newSection(0)]);

  // UI state
  const [activeSection, setActiveSection] = useState(0);
  const [saved, setSaved] = useState(false);
  const [savedExams, setSavedExams] = useState<AssessmentCard[]>(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });
  const [viewList, setViewList] = useState(false);

  const classLevel = getChildClass(selectedChild);
  const totalMarks = sections.reduce((sum, s) => sum + calcSectionMarks(s), 0);

  // ── Section helpers ──

  const addSection = () => {
    if (sections.length >= 6) return;
    setSections((prev) => [...prev, newSection(prev.length)]);
    setActiveSection(sections.length);
  };

  const removeSection = (idx: number) => {
    if (sections.length <= 1) return;
    setSections((prev) => prev.filter((_, i) => i !== idx));
    setActiveSection(Math.max(0, activeSection - 1));
  };

  const updateSection = (idx: number, updates: Partial<AssessmentSection>) => {
    setSections((prev) => prev.map((s, i) => {
      if (i !== idx) return s;
      const updated = { ...s, ...updates };
      updated.marks = calcSectionMarks(updated);
      return updated;
    }));
  };

  const changeSectionType = (idx: number, type: SectionType) => {
    setSections((prev) => prev.map((s, i) => {
      if (i !== idx) return s;
      return {
        ...s,
        type,
        questions: [newQuestion(type)],
        marks: 0,
      };
    }));
  };

  // ── Question helpers ──

  const addQuestion = (sIdx: number) => {
    setSections((prev) => prev.map((s, i) => {
      if (i !== sIdx) return s;
      const q = newQuestion(s.type);
      const updated = { ...s, questions: [...s.questions, q] };
      updated.marks = calcSectionMarks(updated);
      return updated;
    }));
  };

  const removeQuestion = (sIdx: number, qIdx: number) => {
    setSections((prev) => prev.map((s, i) => {
      if (i !== sIdx) return s;
      if (s.questions.length <= 1) return s;
      const updated = { ...s, questions: s.questions.filter((_, qi) => qi !== qIdx) };
      updated.marks = calcSectionMarks(updated);
      return updated;
    }));
  };

  const updateQuestion = (sIdx: number, qIdx: number, updates: Partial<AssessmentQuestion>) => {
    setSections((prev) => prev.map((s, i) => {
      if (i !== sIdx) return s;
      const updated = {
        ...s,
        questions: s.questions.map((q, qi) => qi === qIdx ? { ...q, ...updates } : q),
      };
      updated.marks = calcSectionMarks(updated);
      return updated;
    }));
  };

  const updateOption = (sIdx: number, qIdx: number, optIdx: number, value: string) => {
    setSections((prev) => prev.map((s, i) => {
      if (i !== sIdx) return s;
      return {
        ...s,
        questions: s.questions.map((q, qi) => {
          if (qi !== qIdx) return q;
          const options = [...(q.options ?? ['', '', '', ''])];
          options[optIdx] = value;
          return { ...q, options };
        }),
      };
    }));
  };

  const updateWordBank = (sIdx: number, qIdx: number, idx: number, value: string) => {
    setSections((prev) => prev.map((s, i) => {
      if (i !== sIdx) return s;
      return {
        ...s,
        questions: s.questions.map((q, qi) => {
          if (qi !== qIdx) return q;
          const wb = [...(q.wordBank ?? [''])];
          wb[idx] = value;
          return { ...q, wordBank: wb };
        }),
      };
    }));
  };

  // ── Save ──

  const handleSave = () => {
    if (!examTitle.trim()) { toast.error('Please enter an exam title.'); return; }
    if (totalMarks === 0) { toast.error('Please add questions with marks.'); return; }
    const exam: AssessmentCard = {
      id: `exam-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: examTitle.trim(),
      subject,
      term,
      classLevel,
      childName: selectedChild,
      totalMarks,
      timeLimit,
      sections: sections.map((s) => ({ ...s, marks: calcSectionMarks(s) })),
      createdAt: new Date().toISOString(),
    };
    saveExam(exam);
    setSavedExams((prev) => [exam, ...prev]);
    toast.success('✅ Exam saved! It will appear in the Assessment tab.');
    setSaved(true);
    onSaved?.();
  };

  const handleDeleteExam = (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const updated = savedExams.filter((e) => e.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSavedExams(updated);
      toast.success('Exam deleted.');
    } catch { /* ignore */ }
  };

  const handleNewExam = () => {
    setExamTitle('');
    setSections([newSection(0)]);
    setActiveSection(0);
    setSaved(false);
    setViewList(false);
  };

  // ── Render: saved list ──
  if (viewList) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-purple-800 text-lg">📋 Saved Exams</h2>
          <button onClick={() => setViewList(false)} className="text-sm font-bold text-purple-500 hover:text-purple-700">
            ← Back to Builder
          </button>
        </div>
        {savedExams.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-purple-200 p-10 text-center">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-purple-400 font-semibold">No saved exams yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedExams.map((exam) => (
              <div key={exam.id} className="bg-white rounded-2xl border-2 border-purple-100 p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-extrabold text-purple-800">{exam.title}</p>
                    <p className="text-xs text-purple-400 font-bold mt-0.5">
                      {exam.subject} · {exam.term} · Class {exam.classLevel} · {exam.childName}
                    </p>
                    <p className="text-xs text-orange-500 font-bold mt-0.5">
                      ⏱ {exam.timeLimit} min · {exam.totalMarks} marks · {exam.sections.length} section{exam.sections.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteExam(exam.id)}
                    className="text-red-300 hover:text-red-500 text-sm px-2 py-1">🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const section = sections[activeSection];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-purple-800 text-lg">📝 Exam Builder</h2>
        <div className="flex gap-2">
          <button onClick={() => setViewList(true)} className="text-xs font-bold text-purple-500 hover:text-purple-700 px-3 py-1.5 bg-purple-50 rounded-xl">
            📋 Saved ({savedExams.length})
          </button>
          {saved && (
            <button onClick={handleNewExam} className="text-xs font-bold text-green-600 px-3 py-1.5 bg-green-50 rounded-xl">
              + New Exam
            </button>
          )}
        </div>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-50 border-2 border-green-200 rounded-2xl text-green-700 font-bold text-sm">
          ✅ Exam saved! Go to the Assessment tab so your child can take it.
        </div>
      )}

      {/* ── Exam Metadata ── */}
      <div className="bg-white rounded-3xl border-2 border-purple-100 p-4 shadow-sm">
        <p className="font-extrabold text-purple-700 mb-3">Exam Details</p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-purple-500 block mb-1">Exam Title *</label>
            <input
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="e.g. Term 1 English Exam"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none font-semibold text-gray-800 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-purple-500 block mb-1">Child</label>
              <select value={selectedChild} onChange={(e) => setSelectedChild(e.target.value as ChildName)}
                className="w-full px-3 py-2 rounded-xl border-2 border-purple-200 font-bold text-purple-700 text-sm bg-white">
                {CHILD_NAMES.map((n) => <option key={n} value={n}>{n} (Class {getChildClass(n)})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-purple-500 block mb-1">Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value as SubjectKey)}
                className="w-full px-3 py-2 rounded-xl border-2 border-purple-200 font-bold text-purple-700 text-sm bg-white">
                {SUBJECT_KEYS.map((s) => <option key={s} value={s}>{SUBJECT_META[s].emoji} {SUBJECT_META[s].label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-purple-500 block mb-1">Term / Test</label>
              <select value={term} onChange={(e) => setTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-purple-200 font-bold text-purple-700 text-sm bg-white">
                {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-purple-500 block mb-1">Time Limit (min)</label>
              <input
                type="number" min={5} max={180} value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border-2 border-purple-200 font-bold text-purple-700 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-purple-50 rounded-2xl">
            <span className="text-xs font-bold text-purple-500">Total marks</span>
            <span className="font-extrabold text-orange-600 text-lg">{totalMarks}</span>
          </div>
        </div>
      </div>

      {/* ── Section Tabs ── */}
      <div className="bg-white rounded-3xl border-2 border-purple-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="font-extrabold text-purple-700">Sections</p>
          {sections.length < 6 && (
            <button onClick={addSection}
              className="text-xs font-bold px-3 py-1.5 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-all">
              + Add Section
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap mb-4">
          {sections.map((s, i) => (
            <button key={i} onClick={() => setActiveSection(i)}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeSection === i ? 'bg-purple-500 text-white shadow-md' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}>
              Section {s.label}
              <span className="text-xs opacity-70">{calcSectionMarks(s)}m</span>
            </button>
          ))}
        </div>

        {/* Active section editor */}
        {section && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-bold text-purple-500 block mb-1">Section Title</label>
                <input
                  value={section.title}
                  onChange={(e) => updateSection(activeSection, { title: e.target.value })}
                  placeholder={`e.g. ${section.type === 'comprehension' ? 'Reading Comprehension' : section.type === 'multiple-choice' ? 'Multiple Choice' : 'Fill in the Blanks'}`}
                  className="w-full px-3 py-2 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none font-semibold text-gray-800 text-sm"
                />
              </div>
              {sections.length > 1 && (
                <button onClick={() => removeSection(activeSection)}
                  className="self-end px-3 py-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-100 text-sm font-bold">🗑</button>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-purple-500 block mb-2">Question Type</label>
              <div className="grid grid-cols-1 gap-2">
                {SECTION_TYPES.map((st) => (
                  <label key={st.value} className={`flex items-start gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all ${section.type === st.value ? 'border-purple-400 bg-purple-50' : 'border-gray-100 hover:border-purple-200'}`}>
                    <input type="radio" name={`type-${activeSection}`} value={st.value}
                      checked={section.type === st.value}
                      onChange={() => changeSectionType(activeSection, st.value)}
                      className="mt-0.5 accent-purple-500" />
                    <div>
                      <p className="font-bold text-purple-800 text-sm">{st.label}</p>
                      <p className="text-xs text-purple-400">{st.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Passage (for comprehension) */}
            {section.type === 'comprehension' && (
              <div>
                <label className="text-xs font-bold text-purple-500 block mb-1">Reading Passage</label>
                <textarea
                  value={section.questions[0]?.passage ?? ''}
                  onChange={(e) => updateQuestion(activeSection, 0, { passage: e.target.value })}
                  placeholder="Enter the reading passage here…"
                  rows={5}
                  className="w-full px-3 py-2 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none font-medium text-sm resize-none"
                />
              </div>
            )}

            {/* Word bank */}
            {section.type === 'word-bank' && section.questions[0] && (
              <div>
                <label className="text-xs font-bold text-purple-500 block mb-1">Word Bank</label>
                <div className="space-y-2">
                  {(section.questions[0].wordBank ?? ['']).map((w, wi) => (
                    <div key={wi} className="flex gap-2">
                      <input
                        value={w}
                        onChange={(e) => updateWordBank(activeSection, 0, wi, e.target.value)}
                        placeholder={`Word ${wi + 1}`}
                        className="flex-1 px-3 py-1.5 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-sm font-medium"
                      />
                      {(section.questions[0].wordBank?.length ?? 0) > 1 && (
                        <button onClick={() => {
                          const wb = [...(section.questions[0].wordBank ?? [])].filter((_, i) => i !== wi);
                          updateQuestion(activeSection, 0, { wordBank: wb });
                        }} className="text-red-400 px-2">×</button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => {
                    const wb = [...(section.questions[0].wordBank ?? ['']), ''];
                    updateQuestion(activeSection, 0, { wordBank: wb });
                  }} className="text-xs font-bold text-purple-500 hover:text-purple-700">+ Add word</button>
                </div>
              </div>
            )}

            {/* Questions list */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-purple-500">Questions ({section.questions.length})</label>
                <button onClick={() => addQuestion(activeSection)}
                  className="text-xs font-bold px-3 py-1 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200">
                  + Add Question
                </button>
              </div>
              <div className="space-y-4">
                {section.questions.map((q, qi) => (
                  <div key={q.id} className="border-2 border-gray-100 rounded-2xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full font-extrabold text-xs flex-shrink-0 mt-0.5">
                        {qi + 1}
                      </span>
                      <div className="flex-1 space-y-2">
                        <textarea
                          value={q.question}
                          onChange={(e) => updateQuestion(activeSection, qi, { question: e.target.value })}
                          placeholder="Enter question…"
                          rows={2}
                          className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none font-medium text-sm resize-none"
                        />

                        {/* Multiple choice options */}
                        {q.type === 'multiple-choice' && (
                          <div className="space-y-1.5">
                            {(q.options ?? ['', '', '', '']).map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-2">
                                <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs font-bold text-gray-500 flex-shrink-0">
                                  {String.fromCharCode(65 + oi)}
                                </span>
                                <input
                                  value={opt}
                                  onChange={(e) => updateOption(activeSection, qi, oi, e.target.value)}
                                  placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                                  className={`flex-1 px-3 py-1.5 rounded-xl border-2 text-sm font-medium focus:outline-none ${q.correctAnswer === opt && opt ? 'border-green-400 bg-green-50' : 'border-gray-200 focus:border-purple-300'}`}
                                />
                                <button
                                  onClick={() => updateQuestion(activeSection, qi, { correctAnswer: opt })}
                                  className={`text-xs px-2 py-1 rounded-lg font-bold transition-all ${q.correctAnswer === opt && opt ? 'bg-green-400 text-white' : 'bg-gray-100 text-gray-500 hover:bg-green-100'}`}
                                  title="Mark as correct">
                                  ✓
                                </button>
                              </div>
                            ))}
                            {q.correctAnswer && <p className="text-xs text-green-600 font-bold">✓ Correct: "{q.correctAnswer}"</p>}
                          </div>
                        )}

                        {/* Fill blank / long answer correct answer */}
                        {(q.type === 'fill-blank' || q.type === 'long-answer' || q.type === 'comprehension' || q.type === 'word-bank') && (
                          <input
                            value={q.correctAnswer}
                            onChange={(e) => updateQuestion(activeSection, qi, { correctAnswer: e.target.value })}
                            placeholder="Correct answer (for auto-marking)"
                            className="w-full px-3 py-1.5 rounded-xl border-2 border-green-200 bg-green-50 focus:border-green-400 focus:outline-none text-sm font-medium text-green-800"
                          />
                        )}

                        {/* Marks */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-purple-500">Marks:</label>
                          <input
                            type="number" min={1} max={20} value={q.marks}
                            onChange={(e) => updateQuestion(activeSection, qi, { marks: Number(e.target.value) })}
                            className="w-16 px-2 py-1 rounded-lg border-2 border-purple-200 text-sm font-bold text-center"
                          />
                        </div>
                      </div>
                      {section.questions.length > 1 && (
                        <button onClick={() => removeQuestion(activeSection, qi)}
                          className="text-red-300 hover:text-red-500 text-sm flex-shrink-0">🗑</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!examTitle.trim() || totalMarks === 0}
        className="w-full py-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-extrabold rounded-2xl text-lg shadow-lg transition-all active:scale-95 disabled:opacity-50">
        🚀 Save Exam to Assessment Tab ({totalMarks} marks · {timeLimit} min)
      </button>
    </div>
  );
}
