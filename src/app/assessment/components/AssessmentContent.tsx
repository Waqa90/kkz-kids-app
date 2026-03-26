'use client';

import React, { useState, useEffect } from 'react';
import {
  CHILD_NAMES, getSelectedChild, setSelectedChild, clearSelectedChild,
  type ChildName, getChildClass,
} from '@/lib/childProfile';
import { loadParentSettings } from '@/app/parent/components/SettingsPanel';
import ChildPicker from '@/components/ChildPicker';
import AppNav from '@/components/AppNav';

interface AssessmentCard {
  id: string;
  title: string;
  subject: string;
  term: string;
  classLevel: number;
  childName: string;
  totalMarks: number;
  timeLimit: number; // minutes
  sections: AssessmentSection[];
  createdAt: string;
}

interface AssessmentSection {
  label: string;
  title: string;
  type: 'multiple-choice' | 'fill-blank' | 'long-answer' | 'comprehension' | 'word-bank';
  questions: AssessmentQuestion[];
  marks: number;
}

interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-blank' | 'long-answer' | 'comprehension' | 'word-bank';
  options?: string[];
  correctAnswer: string;
  marks: number;
  passage?: string;
  wordBank?: string[];
}

const STORAGE_KEY = 'kkz_assessments';

function loadAssessments(): AssessmentCard[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

export default function AssessmentContent() {
  const [screen, setScreen] = useState<'picker' | 'list' | 'exam'>('picker');
  const [selectedChild, setSelectedChildState] = useState<ChildName | null>(null);
  const [assessments, setAssessments] = useState<AssessmentCard[]>([]);
  const [activeExam, setActiveExam] = useState<AssessmentCard | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [childSettings, setChildSettings] = useState(() => loadParentSettings().children);

  useEffect(() => {
    setMounted(true);
    const saved = getSelectedChild();
    if (saved) {
      setSelectedChildState(saved);
      setScreen('list');
    }
    setAssessments(loadAssessments());
    const reload = () => setChildSettings(loadParentSettings().children);
    window.addEventListener('kitty_settings_changed', reload);
    return () => window.removeEventListener('kitty_settings_changed', reload);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!examStarted || examFinished || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setExamFinished(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examStarted, examFinished, timeLeft]);

  const handleSelectChild = (name: ChildName) => {
    setSelectedChild(name);
    setSelectedChildState(name);
    setScreen('list');
  };

  const handleSwitchChild = () => {
    clearSelectedChild();
    setSelectedChildState(null);
    setScreen('picker');
  };

  const handleStartExam = (exam: AssessmentCard) => {
    setActiveExam(exam);
    setCurrentSection(0);
    setAnswers({});
    setTimeLeft(exam.timeLimit * 60);
    setExamStarted(true);
    setExamFinished(false);
    setScreen('exam');
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitExam = () => {
    setExamFinished(true);
    if (activeExam && selectedChild) {
      // Calculate score
      let totalScore = 0;
      let totalMarks = 0;
      activeExam.sections.forEach((section) => {
        section.questions.forEach((q) => {
          totalMarks += q.marks;
          const userAnswer = (answers[q.id] || '').trim().toLowerCase();
          const correct = q.correctAnswer.trim().toLowerCase();
          if (userAnswer === correct) totalScore += q.marks;
        });
      });
      // Save result to localStorage & sync
      const result = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        assessmentId: activeExam.id,
        assessmentTitle: activeExam.title,
        childName: selectedChild,
        subject: activeExam.subject,
        classLevel: activeExam.classLevel,
        term: activeExam.term,
        score: totalScore,
        totalMarks,
        sections: activeExam.sections.map((s) => ({
          label: s.label,
          title: s.title,
          marks: s.marks,
          score: s.questions.reduce((sum, q) => {
            const userAnswer = (answers[q.id] || '').trim().toLowerCase();
            return sum + (userAnswer === q.correctAnswer.trim().toLowerCase() ? q.marks : 0);
          }, 0),
        })),
        dateTime: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem('kkz_assessment_results') || '[]');
      localStorage.setItem('kkz_assessment_results', JSON.stringify([result, ...existing]));
    }
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!mounted) return null;

  // ── Child Picker Screen ──
  if (screen === 'picker') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <ChildPicker onSelect={handleSelectChild} selectedChild={selectedChild} />
        </main>
      </div>
    );
  }

  // ── Exam Screen ──
  if (screen === 'exam' && activeExam) {
    const section = activeExam.sections[currentSection];
    const totalScore = activeExam.sections.reduce((sum, s) =>
      sum + s.questions.reduce((qs, q) => {
        const userAnswer = (answers[q.id] || '').trim().toLowerCase();
        return qs + (userAnswer === q.correctAnswer.trim().toLowerCase() ? q.marks : 0);
      }, 0), 0);
    const totalMarks = activeExam.sections.reduce((sum, s) =>
      sum + s.questions.reduce((qs, q) => qs + q.marks, 0), 0);
    const pct = totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0;

    if (examFinished) {
      // Results Screen
      const earnedStars = pct >= 100 ? 5 : pct >= 80 ? 4 : pct >= 60 ? 3 : pct >= 40 ? 1 : 0;
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
          <AppNav />
          <main className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '🎉' : '💪'}</div>
              <h2 className="text-3xl font-extrabold text-purple-800 mb-2">Exam Complete!</h2>
              <p className="text-xl text-purple-600 font-bold mb-4">{activeExam.title}</p>
              <div className="text-5xl font-extrabold text-orange-500 mb-2">{pct}%</div>
              <p className="text-lg text-purple-600 mb-2">{totalScore} / {totalMarks} marks</p>
              <div className="text-3xl mb-4">{'⭐'.repeat(earnedStars)}{'☆'.repeat(5 - earnedStars)}</div>

              {/* Section Breakdown */}
              <div className="mt-6 space-y-3 text-left">
                <h3 className="font-extrabold text-purple-700 text-lg">Section Breakdown:</h3>
                {activeExam.sections.map((s, i) => {
                  const sectionScore = s.questions.reduce((sum, q) => {
                    const ua = (answers[q.id] || '').trim().toLowerCase();
                    return sum + (ua === q.correctAnswer.trim().toLowerCase() ? q.marks : 0);
                  }, 0);
                  return (
                    <div key={i} className="flex justify-between items-center bg-purple-50 rounded-xl px-4 py-3">
                      <span className="font-bold text-purple-700">Section {s.label}: {s.title}</span>
                      <span className="font-extrabold text-orange-600">{sectionScore}/{s.marks}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex gap-4 justify-center">
                <button onClick={() => { setScreen('list'); setActiveExam(null); setExamStarted(false); setExamFinished(false); }}
                  className="px-6 py-3 bg-purple-500 text-white rounded-2xl font-bold hover:bg-purple-600 transition">
                  Back to Assessments
                </button>
              </div>
            </div>
          </main>
        </div>
      );
    }

    // Active Exam Screen
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <main className="max-w-4xl mx-auto px-4 py-4">
          {/* Exam Header */}
          <div className="bg-white rounded-2xl border-2 border-purple-100 shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-purple-800 text-lg">{activeExam.title}</h2>
              <div className={`px-4 py-2 rounded-xl font-extrabold text-lg ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-orange-100 text-orange-600'}`}>
                ⏱ {formatTime(timeLeft)}
              </div>
            </div>
            {/* Section Navigation Tabs */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {activeExam.sections.map((s, i) => (
                <button key={i} onClick={() => setCurrentSection(i)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${currentSection === i
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}>
                  Section {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section Content */}
          {section && (
            <div className="bg-white rounded-2xl border-2 border-purple-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-purple-700 text-xl">
                  Section {section.label}: {section.title}
                </h3>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full font-bold text-sm">
                  {section.marks} marks
                </span>
              </div>

              {/* Passage for comprehension */}
              {section.type === 'comprehension' && section.questions[0]?.passage && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-5 mb-6">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{section.questions[0].passage}</p>
                </div>
              )}

              {/* Word bank */}
              {section.type === 'word-bank' && section.questions[0]?.wordBank && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
                  <p className="font-bold text-blue-700 mb-2">Word Bank:</p>
                  <div className="flex flex-wrap gap-2">
                    {section.questions[0].wordBank.map((word, i) => (
                      <span key={i} className="px-3 py-1 bg-white border-2 border-blue-300 rounded-full font-bold text-blue-700">{word}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions */}
              <div className="space-y-6">
                {section.questions.map((q, qi) => (
                  <div key={q.id} className="border-2 border-gray-100 rounded-2xl p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full font-extrabold text-sm flex-shrink-0">
                        {qi + 1}
                      </span>
                      <p className="font-bold text-gray-800 text-lg flex-1">{q.question}</p>
                      <span className="text-xs text-gray-400 font-bold">[{q.marks} {q.marks === 1 ? 'mark' : 'marks'}]</span>
                    </div>

                    {/* Multiple Choice */}
                    {q.type === 'multiple-choice' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-11">
                        {q.options.map((opt, oi) => (
                          <button key={oi}
                            onClick={() => handleAnswer(q.id, opt)}
                            className={`text-left px-4 py-3 rounded-xl border-2 font-bold transition-all ${answers[q.id] === opt
                              ? 'bg-purple-500 text-white border-purple-500'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-300'}`}>
                            {String.fromCharCode(65 + oi)}. {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Fill in blank / Long answer / Comprehension answer */}
                    {(q.type === 'fill-blank' || q.type === 'long-answer' || q.type === 'comprehension' || q.type === 'word-bank') && (
                      <div className="ml-11">
                        {q.type === 'long-answer' ? (
                          <textarea
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswer(q.id, e.target.value)}
                            placeholder="Write your answer here..."
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none font-medium text-gray-800 resize-none"
                            rows={4}
                          />
                        ) : (
                          <input
                            type="text"
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswer(q.id, e.target.value)}
                            placeholder="Type your answer..."
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none font-medium text-gray-800"
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                  className={`px-5 py-3 rounded-xl font-bold transition-all ${currentSection === 0 ? 'opacity-30 cursor-not-allowed' : 'bg-gray-100 text-purple-700 hover:bg-gray-200'}`}>
                  ← Previous Section
                </button>

                {currentSection === activeExam.sections.length - 1 ? (
                  <button onClick={handleSubmitExam}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-extrabold hover:bg-green-600 transition-all shadow-md">
                    ✅ Submit Exam
                  </button>
                ) : (
                  <button onClick={() => setCurrentSection(currentSection + 1)}
                    className="px-5 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-all">
                    Next Section →
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ── Assessment List Screen ──
  const child = selectedChild!;
  const childData = childSettings[child];
  const cls = getChildClass(child);
  const myAssessments = assessments.filter((a) => a.childName === child || a.classLevel === cls);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
      <AppNav />
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-300 bg-white flex items-center justify-center shadow">
              {childData?.photoUrl
                ? <img src={childData.photoUrl} alt={child} className="w-full h-full object-cover" />
                : <span className="text-2xl">{childData?.emoji ?? '🐱'}</span>}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-purple-800">📝 Assessments</h1>
              <p className="text-sm text-purple-500 font-bold">Class {cls} exams for {child}</p>
            </div>
          </div>
          <button onClick={handleSwitchChild}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-bold hover:bg-purple-200 transition text-sm">
            Switch Child
          </button>
        </div>

        {/* Assessment Cards */}
        {myAssessments.length > 0 ? (
          <div className="space-y-4">
            {myAssessments.map((exam) => (
              <div key={exam.id} className="bg-white rounded-2xl border-2 border-purple-100 shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-extrabold text-purple-800 text-lg">{exam.title}</h3>
                    <p className="text-sm text-purple-500 font-bold">{exam.subject} · {exam.term} · Class {exam.classLevel}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-orange-600">⏱ {exam.timeLimit} min</p>
                    <p className="text-sm font-bold text-purple-500">{exam.totalMarks} marks</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {exam.sections.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">
                      {s.label}: {s.title}
                    </span>
                  ))}
                </div>
                <button onClick={() => handleStartExam(exam)}
                  className="w-full py-3 bg-orange-400 text-white rounded-xl font-extrabold text-lg hover:bg-orange-500 transition-all shadow-sm active:scale-95">
                  Start Exam 📝
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-purple-200 p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-extrabold text-purple-700 mb-2">No Assessments Yet</h3>
            <p className="text-purple-400 font-bold">
              Assessments will appear here once they are created in the Lab.
            </p>
          </div>
        )}

        {/* Past Results */}
        <PastResults childName={child} />
      </main>
    </div>
  );
}

function PastResults({ childName }: { childName: string }) {
  const [results, setResults] = useState<Array<{
    id: string; assessmentTitle: string; score: number; totalMarks: number;
    term: string; subject: string; dateTime: string;
    sections: Array<{ label: string; title: string; score: number; marks: number }>;
  }>>([]);

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem('kkz_assessment_results') || '[]');
      setResults(all.filter((r: { childName: string }) => r.childName === childName));
    } catch { /* ignore */ }
  }, [childName]);

  if (results.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-extrabold text-purple-700 mb-4">📊 Past Results</h3>
      <div className="space-y-3">
        {results.slice(0, 10).map((r) => {
          const pct = r.totalMarks > 0 ? Math.round((r.score / r.totalMarks) * 100) : 0;
          const stars = pct >= 100 ? 5 : pct >= 80 ? 4 : pct >= 60 ? 3 : pct >= 40 ? 1 : 0;
          return (
            <div key={r.id} className="bg-white rounded-2xl border-2 border-purple-100 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-extrabold text-purple-800">{r.assessmentTitle}</p>
                  <p className="text-xs text-purple-400 font-bold">{r.subject} · {r.term} · {new Date(r.dateTime).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-orange-500">{pct}%</p>
                  <p className="text-xs text-purple-500">{r.score}/{r.totalMarks}</p>
                  <p className="text-sm">{'⭐'.repeat(stars)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
