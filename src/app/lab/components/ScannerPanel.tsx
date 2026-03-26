'use client';

import React, { useState, useRef, useCallback } from 'react';
import { CHILD_NAMES, SUBJECT_META, SUBJECTS_BY_CHILD, type ChildName, type SubjectKey } from '@/lib/childProfile';
import { getChildClassFromSettings, loadParentSettings } from '@/app/parent/components/SettingsPanel';
import { saveLabNote, type LabNote } from '@/lib/labNotes';
import { cleanOcrText } from '@/lib/ocrUtils';
import toast from 'react-hot-toast';

type ScanStep = 'upload' | 'scanning' | 'setup' | 'done';

const SUBJECT_KEYS = Object.keys(SUBJECT_META) as SubjectKey[];

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

interface Props {
  onSaved: () => void;
}

export default function ScannerPanel({ onSaved }: Props) {
  const [step, setStep] = useState<ScanStep>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrMsg, setOcrMsg] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [ocrError, setOcrError] = useState('');

  // Setup form state
  const [selectedChild, setSelectedChild] = useState<ChildName | null>(null);
  const [isParent, setIsParent] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey>('english');
  const [selectedClass, setSelectedClass] = useState<3 | 4 | 5>(4);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(7);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const settings = loadParentSettings();

  const runOcr = useCallback(async (file: File, preview: string) => {
    setStep('scanning');
    setOcrProgress(0);
    setOcrMsg('Preparing…');
    setOcrError('');
    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng', 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'loading tesseract core') { setOcrMsg('Loading…'); setOcrProgress(10); }
          else if (m.status === 'loading language traineddata') { setOcrMsg('Loading dictionary…'); setOcrProgress(30); }
          else if (m.status === 'initializing api') { setOcrMsg('Initialising…'); setOcrProgress(50); }
          else if (m.status === 'recognizing text') {
            setOcrMsg('Reading text…');
            setOcrProgress(50 + Math.round(m.progress * 45));
          }
        },
      });
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const cleaned = cleanOcrText(data.text);
      if (!cleaned || cleaned.length < 4) {
        setOcrError("Couldn't read text from this image. Try a clearer photo with printed text.");
        setStep('upload');
        return;
      }
      setExtractedText(cleaned);
      setOcrProgress(100);
      setStep('setup');
    } catch (err) {
      console.error('OCR error:', err);
      setOcrError('OCR failed. Please try a clearer image.');
      setStep('upload');
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    runOcr(file, url);
  }, [runOcr]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) handleFile(f);
  };

  const handleChildSelect = (name: ChildName) => {
    setSelectedChild(name);
    setIsParent(false);
    const cls = getChildClassFromSettings(name);
    setSelectedClass(cls as 3 | 4 | 5);
    const opts = ACTIVITY_OPTIONS[selectedSubject] ?? [];
    setSelectedActivities([...opts]);
  };

  const handleSubjectChange = (s: SubjectKey) => {
    setSelectedSubject(s);
    const opts = ACTIVITY_OPTIONS[s] ?? [];
    setSelectedActivities([...opts]);
  };

  const toggleActivity = (act: string) => {
    setSelectedActivities((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    );
  };

  const handleSave = () => {
    if (!extractedText) return;
    const childName = isParent ? 'parent' : (selectedChild ?? 'parent');
    const note: LabNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      childName,
      subject: selectedSubject,
      class: selectedClass,
      title: `Scanned: ${SUBJECT_META[selectedSubject].label} — ${new Date().toLocaleDateString()}`,
      activityTypes: selectedActivities,
      questionCount,
      rawText: extractedText,
      extractedAt: new Date().toISOString(),
    };
    saveLabNote(note);
    toast.success('✅ Saved to Notes! Open Notes tab to build activities.');
    setStep('done');
    onSaved();
  };

  const handleReset = () => {
    setStep('upload');
    setImagePreview(null);
    setExtractedText('');
    setOcrError('');
    setOcrProgress(0);
    if (fileRef.current) fileRef.current.value = '';
    if (cameraRef.current) cameraRef.current.value = '';
  };

  // ── Upload ──
  if (step === 'upload' || step === 'scanning') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-3xl border-2 border-purple-100 p-5 shadow-sm">
          <h2 className="font-extrabold text-purple-800 text-lg mb-1">📷 Document Scanner</h2>
          <p className="text-sm text-purple-400 font-medium mb-4">Upload a photo of exam papers, worksheets, notes or textbook pages.</p>

          {ocrError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 font-semibold text-sm">
              {ocrError}
            </div>
          )}

          {step === 'scanning' ? (
            <div className="py-8 text-center">
              <div className="text-5xl mb-4 animate-pulse">🔍</div>
              <p className="font-extrabold text-purple-700 text-lg mb-2">{ocrMsg}</p>
              <div className="w-full bg-purple-100 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>
              <p className="text-purple-400 font-bold mt-2 text-sm">{ocrProgress}%</p>
            </div>
          ) : (
            <div
              className="border-4 border-dashed border-purple-200 rounded-3xl p-10 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
            >
              <div className="text-5xl mb-3">📄</div>
              <p className="font-extrabold text-purple-700 mb-1">Drag & drop or tap to upload</p>
              <p className="text-xs text-purple-400">Supports JPG, PNG, HEIC — printed & handwritten text</p>
            </div>
          )}

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

          {step !== 'scanning' && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex-1 py-3 bg-purple-100 text-purple-700 rounded-2xl font-bold hover:bg-purple-200 transition-all">
                🖼 Upload Image
              </button>
              <button
                onClick={() => cameraRef.current?.click()}
                className="flex-1 py-3 bg-orange-100 text-orange-700 rounded-2xl font-bold hover:bg-orange-200 transition-all">
                📷 Take Photo
              </button>
            </div>
          )}
        </div>

        {imagePreview && step !== 'scanning' && (
          <div className="bg-white rounded-3xl border-2 border-purple-100 p-4 shadow-sm">
            <img src={imagePreview} alt="Preview" className="w-full max-h-60 object-contain rounded-2xl" />
          </div>
        )}
      </div>
    );
  }

  // ── Setup ──
  if (step === 'setup') {
    const subjectsToShow = !isParent && selectedChild
      ? (SUBJECTS_BY_CHILD[selectedChild] ?? SUBJECT_KEYS)
      : SUBJECT_KEYS;

    return (
      <div className="space-y-4">
        {/* Image preview + extracted text */}
        <div className="bg-white rounded-3xl border-2 border-purple-100 p-4 shadow-sm">
          <div className="flex gap-3 items-start">
            {imagePreview && (
              <img src={imagePreview} alt="Scanned" className="w-20 h-20 object-cover rounded-2xl border border-purple-200 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-green-600 font-extrabold text-base mb-1">✅ Text extracted!</p>
              <p className="text-xs text-purple-500 font-medium line-clamp-4">{extractedText.slice(0, 200)}…</p>
            </div>
          </div>
          <button onClick={handleReset} className="mt-3 text-xs font-bold text-purple-400 hover:text-purple-600">
            ← Scan different image
          </button>
        </div>

        {/* Who */}
        <div className="bg-white rounded-3xl border-2 border-purple-100 p-4 shadow-sm">
          <p className="font-extrabold text-purple-700 mb-3">Who is this for?</p>
          <div className="flex flex-wrap gap-2">
            {CHILD_NAMES.map((name) => {
              const c = settings.children[name];
              return (
                <button key={name} onClick={() => handleChildSelect(name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${selectedChild === name && !isParent ? 'bg-purple-500 text-white shadow-md' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}>
                  {c?.photoUrl ? <img src={c.photoUrl} alt={name} className="w-6 h-6 rounded-full object-cover" /> : <span>{c?.emoji ?? '🐱'}</span>}
                  {name}
                </button>
              );
            })}
            <button onClick={() => { setIsParent(true); setSelectedChild(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${isParent ? 'bg-purple-500 text-white shadow-md' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}>
              👨‍👩‍👧 Parent
            </button>
          </div>
        </div>

        {/* Subject */}
        <div className="bg-white rounded-3xl border-2 border-purple-100 p-4 shadow-sm">
          <p className="font-extrabold text-purple-700 mb-3">Subject</p>
          <div className="grid grid-cols-3 gap-2">
            {subjectsToShow.map((s) => (
              <button key={s} onClick={() => handleSubjectChange(s)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 font-bold text-xs transition-all ${selectedSubject === s ? 'border-purple-400 bg-purple-50' : 'border-transparent bg-gray-50 hover:bg-purple-50'}`}>
                <span className="text-2xl">{SUBJECT_META[s].emoji}</span>
                <span className="text-gray-700">{SUBJECT_META[s].label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Class (shown for parent) */}
        {isParent && (
          <div className="bg-white rounded-3xl border-2 border-purple-100 p-4 shadow-sm">
            <p className="font-extrabold text-purple-700 mb-3">Class Level</p>
            <div className="flex gap-3">
              {([3, 4, 5] as const).map((c) => (
                <button key={c} onClick={() => setSelectedClass(c)}
                  className={`flex-1 py-2.5 rounded-2xl font-extrabold transition-all ${selectedClass === c ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}>
                  Class {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Activity types */}
        <div className="bg-white rounded-3xl border-2 border-purple-100 p-4 shadow-sm">
          <p className="font-extrabold text-purple-700 mb-3">Activity Types to Generate</p>
          <div className="space-y-2">
            {(ACTIVITY_OPTIONS[selectedSubject] ?? []).map((act) => (
              <label key={act} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-purple-50">
                <input type="checkbox" checked={selectedActivities.includes(act)} onChange={() => toggleActivity(act)}
                  className="w-5 h-5 rounded accent-purple-500" />
                <span className="font-semibold text-purple-800">{act}</span>
              </label>
            ))}
          </div>
          <div className="mt-4">
            <p className="font-bold text-purple-600 text-sm mb-2">Questions to generate:</p>
            <div className="flex gap-3">
              {Q_COUNT_OPTIONS.map((n) => (
                <button key={n} onClick={() => setQuestionCount(n)}
                  className={`flex-1 py-2 rounded-2xl font-extrabold text-sm transition-all ${questionCount === n ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p className="font-bold text-purple-600 text-sm mb-2">Difficulty:</p>
            <div className="flex gap-2">
              {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${difficulty === d
                    ? d === 'Easy' ? 'bg-green-400 text-white' : d === 'Medium' ? 'bg-yellow-400 text-white' : 'bg-red-400 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {d === 'Easy' ? '🟢' : d === 'Medium' ? '🟡' : '🔴'} {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={selectedActivities.length === 0 || (!selectedChild && !isParent)}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-extrabold rounded-2xl text-lg shadow-lg transition-all active:scale-95 disabled:opacity-50">
          💾 Save to Notes &amp; Build Activities
        </button>
      </div>
    );
  }

  // ── Done ──
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">✅</div>
      <h2 className="text-2xl font-extrabold text-purple-800 mb-2">Saved to Notes!</h2>
      <p className="text-purple-500 font-medium mb-6">Open the Notes tab to generate AI activities from your scan.</p>
      <button onClick={handleReset}
        className="px-8 py-3 bg-purple-500 text-white rounded-2xl font-bold hover:bg-purple-600 transition-all">
        📷 Scan Another Document
      </button>
    </div>
  );
}
