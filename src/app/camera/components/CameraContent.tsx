'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CHILD_NAMES, SUBJECT_META, SUBJECTS_BY_CHILD, type ChildName, type SubjectKey } from '@/lib/childProfile';
import { loadParentSettings, getChildClassFromSettings } from '@/app/parent/components/SettingsPanel';
import { saveLabNote, type LabNote } from '@/lib/labNotes';
import ChildPicker from '@/components/ChildPicker';
import PinGate from '@/components/PinGate';
import PhotoTextContent from '@/app/photo-text-reader/components/PhotoTextContent';
import AppNav from '@/components/AppNav';
import toast from 'react-hot-toast';

type WizardStep = 'who' | 'subject' | 'activity' | 'scan';
type WhoType = 'child' | 'parent';

const ACTIVITY_OPTIONS: Record<string, string[]> = {
  english: ['Comprehension Questions', 'Fill in Blanks', 'Word Match'],
  maths: ['Multiple Choice', 'Typed Answer', 'Word Problems'],
  science: ['Multiple Choice', 'True/False', 'Match Game'],
  'social-studies': ['Multiple Choice', 'True/False', 'Match Game'],
  'healthy-living': ['Multiple Choice', 'True/False', 'Match Game'],
  mce: ['Multiple Choice', 'True/False', 'Match Game'],
  fijian: ['Multiple Choice', 'True/False', 'Match Game'],
};

const Q_COUNT_OPTIONS = [5, 7, 10];

export default function CameraContent() {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>('who');
  const [whoType, setWhoType] = useState<WhoType | null>(null);
  const [selectedChild, setSelectedChildState] = useState<ChildName | null>(null);
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey | null>(null);
  const [selectedClass, setSelectedClass] = useState<3 | 4 | 5>(4);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(7);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const settings = loadParentSettings();

  const handleChildSelect = (name: ChildName) => {
    setSelectedChildState(name);
    setWhoType('child');
    setSelectedClass(getChildClassFromSettings(name));
    setStep('subject');
  };

  const handleParentUnlock = () => {
    setParentUnlocked(true);
    setWhoType('parent');
    setStep('subject');
  };

  const handleSubjectSelect = (s: SubjectKey) => {
    setSelectedSubject(s);
    // Default select all activity options
    const opts = ACTIVITY_OPTIONS[s] ?? [];
    setSelectedActivities([...opts]);
    setStep('activity');
  };

  const toggleActivity = (act: string) => {
    setSelectedActivities((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    );
  };

  const handleSaveToLab = () => {
    if (!selectedSubject) return;
    const childName = selectedChild ?? 'parent';
    const note: LabNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      childName,
      subject: selectedSubject,
      class: selectedClass,
      title: `Camera Scan [${selectedDifficulty}]`,
      activityTypes: selectedActivities,
      questionCount,
      rawText: '',
      extractedAt: new Date().toISOString(),
    };
    saveLabNote(note);
    toast.success('Saved to Lab! Open the 🧪 Lab tab to build activities.');
  };

  // ── Step: Who ──────────────────────────────────────────────────────────
  if (step === 'who') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <main className="max-w-xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-purple-800">📷 Camera Scanner</h1>
            <p className="text-purple-500 mt-1">Who is uploading a photo?</p>
          </div>

          <ChildPicker onSelect={handleChildSelect} selectedChild={selectedChild} title="Choose a child" />

          <div className="mt-4 text-center">
            <p className="text-sm text-purple-500 font-medium mb-3">— or —</p>
            {!parentUnlocked ? (
              <div className="max-w-sm mx-auto">
                <PinGate
                  title="Parent Upload"
                  subtitle="Enter your credentials to upload as parent"
                  onSuccess={handleParentUnlock}
                />
              </div>
            ) : (
              <button onClick={() => { setWhoType('parent'); setStep('subject'); }}
                className="px-6 py-3 bg-purple-500 text-white font-extrabold rounded-2xl shadow hover:bg-purple-600 transition-all">
                👨‍👩‍👧 Continue as Parent
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ── Step: Subject ──────────────────────────────────────────────────────
  if (step === 'subject') {
    const subjectsToShow: SubjectKey[] = whoType === 'child' && selectedChild
      ? (SUBJECTS_BY_CHILD[selectedChild] ?? Object.keys(SUBJECT_META) as SubjectKey[])
      : Object.keys(SUBJECT_META) as SubjectKey[];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <main className="max-w-xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setStep('who')} className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold">←</button>
            <div>
              <h1 className="text-xl font-extrabold text-purple-800">📚 Choose Subject</h1>
              {whoType === 'parent' && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-purple-500">Class:</span>
                  {([3,4,5] as const).map((c) => (
                    <button key={c} onClick={() => setSelectedClass(c)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-colors ${selectedClass === c ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                    >Class {c}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {subjectsToShow.map((s) => {
              const meta = SUBJECT_META[s];
              return (
                <button key={s} onClick={() => handleSubjectSelect(s)}
                  className={`${meta.color} flex flex-col items-center gap-2 p-4 rounded-3xl border-2 border-transparent hover:scale-[1.03] hover:shadow-lg active:scale-[0.97] shadow-md transition-all`}>
                  <span className="text-4xl">{meta.emoji}</span>
                  <span className="font-extrabold text-gray-800 text-sm text-center">{meta.label}</span>
                </button>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // ── Step: Activity types ───────────────────────────────────────────────
  if (step === 'activity' && selectedSubject) {
    const opts = ACTIVITY_OPTIONS[selectedSubject] ?? [];
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <main className="max-w-xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setStep('subject')} className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold">←</button>
            <h1 className="text-xl font-extrabold text-purple-800">🎯 Activity Setup</h1>
          </div>

          <div className="bg-white rounded-3xl border-2 border-purple-100 p-5 mb-4 shadow">
            <p className="font-bold text-purple-700 mb-3">What activities to create?</p>
            <div className="flex flex-col gap-2">
              {opts.map((act) => (
                <label key={act} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-purple-50 transition-colors">
                  <input type="checkbox" checked={selectedActivities.includes(act)} onChange={() => toggleActivity(act)}
                    className="w-5 h-5 rounded accent-purple-500" />
                  <span className="font-semibold text-purple-800">{act}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border-2 border-purple-100 p-5 mb-5 shadow">
            <p className="font-bold text-purple-700 mb-3">Number of questions:</p>
            <div className="flex gap-3">
              {Q_COUNT_OPTIONS.map((n) => (
                <button key={n} type="button" onClick={() => setQuestionCount(n)}
                  className={`flex-1 py-2.5 rounded-2xl font-extrabold transition-colors ${questionCount === n ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
                >{n}</button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border-2 border-purple-100 p-5 mb-5 shadow">
            <p className="text-sm font-extrabold text-purple-700 mb-2">🎯 Difficulty Level</p>
            <div className="flex gap-2">
              {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDifficulty(d)}
                  className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
                    selectedDifficulty === d
                      ? d === 'Easy' ? 'bg-green-400 text-white shadow-md' : d === 'Medium' ? 'bg-yellow-400 text-white shadow-md' : 'bg-red-400 text-white shadow-md'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {d === 'Easy' ? '🟢' : d === 'Medium' ? '🟡' : '🔴'} {d}
                </button>
              ))}
            </div>
          </div>

          <button type="button" onClick={() => setStep('scan')} disabled={selectedActivities.length === 0}
            className="w-full py-4 bg-orange-400 hover:bg-orange-500 disabled:opacity-50 text-white font-extrabold rounded-2xl text-lg shadow-lg transition-all active:scale-95">
            📷 Take Photo / Upload Image
          </button>
        </main>
      </div>
    );
  }

  // ── Step: Scan (OCR) ───────────────────────────────────────────────────
  if (step === 'scan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setStep('activity')} className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold">←</button>
            <h1 className="text-xl font-extrabold text-purple-800">📷 Scan & Extract</h1>
          </div>
          <PhotoTextContent />
          <div className="mt-4">
            <button
              onClick={handleSaveToLab}
              className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-extrabold rounded-2xl shadow-lg transition-all active:scale-95"
            >
              💾 Save to Lab 🧪
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
