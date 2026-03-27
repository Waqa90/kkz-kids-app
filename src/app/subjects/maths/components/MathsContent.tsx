'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MATHS_SETS, type MathsSet, type MathsQuestion } from '@/lib/maths';
import { saveMathsResultAsync } from '@/lib/mathsResults';
import { isSubjectEnabled, getChildControls, getChildClassFromSettings } from '@/app/parent/components/SettingsPanel';
import { CHILD_NAMES, type ChildName } from '@/lib/childProfile';
import { getAllActivities, getUploadedActivitiesAsync, type SubjectActivity } from '@/lib/subjectContent';
import { saveSubjectResultAsync } from '@/lib/subjectResults';
import SubjectActivityRunner, { type SubjectQuestion } from '@/components/SubjectActivityRunner';
import { playCorrectSound, playWrongSound, playAchievementSound, playGoodJobSound, playNumberTapSound } from '@/lib/sounds';
import { speak, stopSpeech } from '@/lib/speech';
import { playCelebrationVoiceForMaths } from '@/lib/celebrationVoice';
import MathsSetSelector from './MathsSetSelector';
import AppNav from '@/components/AppNav';

type Screen = 'selector' | 'quiz' | 'result' | 'review';

interface QuestionResult {
  question: MathsQuestion;
  userAnswer: string;
  correct: boolean;
}

export default function MathsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const childParam = searchParams.get('child');

  const [screen, setScreen] = useState<Screen>('selector');
  const [activeSet, setActiveSet] = useState<MathsSet | null>(null);
  const [selectedUploadedActivity, setSelectedUploadedActivity] = useState<SubjectActivity | null>(null);
  const [, forceUpdate] = React.useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const childName = (childParam && CHILD_NAMES.includes(childParam as ChildName)) ? (childParam as ChildName) : null;

  useEffect(() => {
    if (!childName) router.replace('/subjects');
  }, [childName, router]);

  useEffect(() => {
    getUploadedActivitiesAsync().then(() => forceUpdate((n) => n + 1)).catch(() => {});
  }, []);

  useEffect(() => {
    if (screen === 'quiz' && activeSet && childName && getChildControls(childName).soundEnabled) {
      const q = activeSet.questions[qIndex];
      if (q) {
        stopSpeech();
        setIsSpeaking(true);
        speak(q.display, { rate: 0.85, onEnd: () => setIsSpeaking(false), onError: () => setIsSpeaking(false) });
      }
    }
    return () => stopSpeech();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, screen]);

  if (!childName) return null;

  const enabled = isSubjectEnabled(childName, 'maths');
  if (!enabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-extrabold text-purple-800">Maths is Locked</h2>
          <p className="text-purple-500 text-center">Ask your parent to unlock Maths in Settings.</p>
          <button onClick={() => router.back()} className="px-6 py-3 bg-purple-500 text-white rounded-2xl font-bold">← Go Back</button>
        </div>
      </div>
    );
  }

  const controls = getChildControls(childName);
  const defaultClass = getChildClassFromSettings(childName);
  const parsedOverride = searchParams.get('class') ? parseInt(searchParams.get('class')!) : null;
  const childClass = (parsedOverride === 3 || parsedOverride === 4 || parsedOverride === 5) ? parsedOverride : defaultClass;
  const filteredSets = MATHS_SETS.filter((s) => s.class === childClass);
  const uploadedMathsActivities = getAllActivities('maths', childClass).filter((a) => a.source === 'uploaded');

  const startSet = (set: MathsSet) => {
    setActiveSet(set);
    setQIndex(0);
    setScore(0);
    setTypedAnswer('');
    setSelectedOpt(null);
    setFeedback(null);
    setShowHint(false);
    setQuestionResults([]);
    setScreen('quiz');
  };

  // Canvas drawing handlers
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) { ctx.clearRect(0, 0, canvas.width, canvas.height); }
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#6b21a8';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => setIsDrawing(false);

  const handleAnswer = (answer: string) => {
    if (!activeSet || feedback !== null) return;
    const q = activeSet.questions[qIndex];
    const correct = answer.trim() === String(q.correctAnswer).trim();
    setSelectedOpt(answer);
    setFeedback(correct ? 'correct' : 'wrong');

    // Voice reads back their answer as-is (no right/wrong clue)
    if (controls.soundEnabled) {
      setTimeout(() => speak(`Your answer is ${answer}`, { rate: 1.0, pitch: 1.0 }), 100);
    }

    // Store result for review
    setQuestionResults((prev) => [...prev, { question: q, userAnswer: answer, correct }]);

    const newScore = correct ? score + 1 : score;
    if (correct) { if (controls.soundEnabled) playCorrectSound(); }
    else { if (controls.soundEnabled) playWrongSound(); }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOpt(null);
      setTypedAnswer('');
      setShowHint(false);
      clearCanvas();
      if (qIndex + 1 >= activeSet.questions.length) {
        setScore(newScore);
        setScreen('result');
        saveMathsResultAsync({ mathsSetId: activeSet.id, mathsSetTitle: activeSet.title, childName, class: childClass, topic: activeSet.topic, score: newScore, total: activeSet.questions.length });
        if (controls.soundEnabled) {
          if (newScore === activeSet.questions.length) playAchievementSound();
          else playGoodJobSound();
        }
        playCelebrationVoiceForMaths(childName, newScore, activeSet.questions.length);
      } else {
        setQIndex((i) => i + 1);
      }
    }, 1000);
  };

  const handleTypedSubmit = () => {
    if (!typedAnswer.trim()) return;
    handleAnswer(typedAnswer.trim());
  };

  // ── Uploaded practice card runner ──────────────────────────────────────
  if (selectedUploadedActivity) {
    const questions: SubjectQuestion[] = selectedUploadedActivity.questions.map((q) => ({
      id: q.id,
      question: q.question,
      type: q.type === 'match' ? 'multiple-choice' : q.type === 'short-answer' ? 'typed' : q.type,
      options: q.options,
      correctAnswer: q.correctAnswer,
      correctIndex: q.correctIndex,
      hint: q.hint,
      emoji: q.emoji,
    }));
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <SubjectActivityRunner
          questions={questions}
          childName={childName}
          subjectKey="maths"
          activityTitle={selectedUploadedActivity.title}
          onComplete={(score, total) => {
            saveSubjectResultAsync({
              activityId: selectedUploadedActivity.id,
              activityTitle: selectedUploadedActivity.title,
              subject: 'maths',
              activityType: selectedUploadedActivity.activityType,
              childName,
              class: childClass,
              score,
              total,
            });
            setSelectedUploadedActivity(null);
          }}
          onBack={() => setSelectedUploadedActivity(null)}
          showHints={controls.showHints}
          soundEnabled={controls.soundEnabled}
        />
      </div>
    );
  }

  // ── Selector screen ────────────────────────────────────────────────────
  if (screen === 'selector') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <main className="max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => router.push(`/subjects?child=${childName}`)} className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold transition-colors">←</button>
            <div>
              <h1 className="text-2xl font-extrabold text-purple-800">🔢 Maths</h1>
              <p className="text-sm text-purple-500">Class {childClass} · {childName}</p>
            </div>
          </div>
          <MathsSetSelector sets={filteredSets} childName={childName} onSelect={startSet} />
          {uploadedMathsActivities.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-extrabold text-purple-500 uppercase tracking-wide mb-3">📤 Practice Cards</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedMathsActivities.map((activity) => (
                  <div key={activity.id} className={`${activity.color} rounded-3xl border-2 border-transparent p-5 shadow-md hover:shadow-xl transition-all`}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-4xl">{activity.emoji}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activity.levelColor}`}>Class {activity.class}</span>
                    </div>
                    <h3 className="font-extrabold text-gray-800 text-base mb-1">{activity.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">{activity.questions.length} questions · practice card</p>
                    <button
                      onClick={() => setSelectedUploadedActivity(activity)}
                      className="w-full py-2.5 bg-orange-400 hover:bg-orange-500 text-white font-extrabold rounded-2xl transition-all active:scale-95 shadow-sm"
                    >
                      Start! 🚀
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ── Result screen ──────────────────────────────────────────────────────
  if (screen === 'result' && activeSet) {
    const pct = activeSet.questions.length > 0 ? Math.round((score / activeSet.questions.length) * 100) : 0;
    const stars = pct >= 100 ? 3 : pct >= 80 ? 2 : pct >= 60 ? 1 : 0;
    const wrongCount = questionResults.filter((r) => !r.correct).length;
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0 flex items-center justify-center">
        <AppNav />
        <div className="flex flex-col items-center gap-5 px-4 text-center max-w-sm mx-auto">
          <div className="text-7xl">{pct === 100 ? '🏆' : pct >= 80 ? '🎉' : '💪'}</div>
          <h2 className="text-2xl font-extrabold text-purple-800">{pct === 100 ? 'Perfect Score!' : pct >= 80 ? 'Great Job!' : 'Keep Practising!'}</h2>
          <p className="text-lg font-bold text-purple-600">{score} / {activeSet.questions.length} correct</p>
          <div className="flex gap-2 text-4xl">{[1,2,3].map((s) => <span key={s}>{s <= stars ? '⭐' : '☆'}</span>)}</div>
          <div className="flex gap-3 mt-2 flex-wrap justify-center">
            {wrongCount > 0 && (
              <button onClick={() => setScreen('review')} className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-extrabold rounded-2xl transition-all active:scale-95 shadow">📖 Review ({wrongCount} wrong)</button>
            )}
            <button onClick={() => startSet(activeSet)} className="px-5 py-3 bg-orange-400 hover:bg-orange-500 text-white font-extrabold rounded-2xl transition-all active:scale-95 shadow">🔄 Try Again</button>
            <button onClick={() => setScreen('selector')} className="px-5 py-3 bg-purple-500 hover:bg-purple-600 text-white font-extrabold rounded-2xl transition-all active:scale-95 shadow">Back to Sets</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Review screen ─────────────────────────────────────────────────────
  if (screen === 'review' && activeSet) {
    const wrongResults = questionResults.filter((r) => !r.correct);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setScreen('result')} className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold">←</button>
            <h2 className="text-xl font-extrabold text-purple-800">📖 Review — {wrongResults.length} to practice</h2>
          </div>
          <div className="space-y-6">
            {wrongResults.map((r, i) => (
              <div key={i} className="flex gap-4 flex-col md:flex-row">
                {/* Question + Answers */}
                <div className="flex-1 bg-white rounded-2xl border-2 border-red-100 p-5 shadow-sm">
                  <p className="text-sm text-purple-500 font-bold mb-2">Question {questionResults.indexOf(r) + 1}</p>
                  <p className="text-xl font-extrabold text-purple-900 mb-4">{r.question.display}</p>
                  <div className="flex gap-4 items-center flex-wrap">
                    <div className="px-4 py-2 bg-red-50 border-2 border-red-200 rounded-xl">
                      <p className="text-xs text-red-500 font-bold">Your Answer</p>
                      <p className="text-lg font-extrabold text-red-600">{r.userAnswer}</p>
                    </div>
                    <div className="px-4 py-2 bg-green-50 border-2 border-green-200 rounded-xl">
                      <p className="text-xs text-green-500 font-bold">Correct Answer</p>
                      <p className="text-lg font-extrabold text-green-600">{String(r.question.correctAnswer)}</p>
                    </div>
                  </div>
                  {r.question.hint && (
                    <p className="mt-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">💡 {r.question.hint}</p>
                  )}
                </div>
                {/* Working space */}
                <div className="w-full md:w-64 bg-white rounded-2xl border-2 border-dashed border-purple-200 p-3 flex flex-col items-center">
                  <p className="text-xs text-purple-400 font-bold mb-2">Working Space</p>
                  <canvas width={230} height={160} className="border border-purple-100 rounded-xl bg-purple-50/30 cursor-crosshair touch-none"
                    onMouseDown={(e) => {
                      const ctx = e.currentTarget.getContext('2d');
                      if (ctx) { ctx.beginPath(); ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); ctx.strokeStyle = '#6b21a8'; ctx.lineWidth = 2; ctx.lineCap = 'round'; }
                      e.currentTarget.dataset.drawing = 'true';
                    }}
                    onMouseMove={(e) => {
                      if (e.currentTarget.dataset.drawing !== 'true') return;
                      const ctx = e.currentTarget.getContext('2d');
                      if (ctx) { ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); ctx.stroke(); }
                    }}
                    onMouseUp={(e) => { e.currentTarget.dataset.drawing = 'false'; }}
                    onMouseLeave={(e) => { e.currentTarget.dataset.drawing = 'false'; }}
                  />
                  <button onClick={(e) => {
                    const canvas = (e.currentTarget.previousElementSibling as HTMLCanvasElement);
                    const ctx = canvas?.getContext('2d');
                    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                  }} className="mt-2 text-xs text-purple-400 hover:text-purple-600 font-bold">Clear</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-3 justify-center">
            <button onClick={() => startSet(activeSet)} className="px-5 py-3 bg-orange-400 hover:bg-orange-500 text-white font-extrabold rounded-2xl shadow">🔄 Try Again</button>
            <button onClick={() => setScreen('selector')} className="px-5 py-3 bg-purple-500 hover:bg-purple-600 text-white font-extrabold rounded-2xl shadow">Back to Sets</button>
          </div>
        </main>
      </div>
    );
  }

  // ── Quiz screen ─────────────────────────────────────────────────────────
  if (!activeSet) return null;
  const q: MathsQuestion = activeSet.questions[qIndex];
  const progress = (qIndex / activeSet.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
      <AppNav />
      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setScreen('selector')} className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold">←</button>
          <div className="flex-1">
            <p className="text-xs font-bold text-purple-500 mb-1">{activeSet.title} — Q{qIndex + 1}/{activeSet.questions.length}</p>
            <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <span className="text-sm font-extrabold text-orange-500">{score} ⭐</span>
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          {/* Left: Question + Answers */}
          <div className="flex-1">
            {/* Question card */}
            <div className={`relative bg-white rounded-3xl border-4 p-6 shadow-lg mb-4 transition-all duration-300 ${
              feedback === 'correct' ? 'border-green-400 bg-green-50' : feedback === 'wrong' ? 'border-red-400 bg-red-50' : 'border-purple-100'
            }`}>
              {q.emoji && <div className="text-4xl text-center mb-3">{q.emoji}</div>}
              <button
                type="button"
                onClick={() => { if (controls.soundEnabled) { stopSpeech(); speak(q.display, { rate: 0.85 }); } }}
                title="Read question aloud"
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 hover:bg-purple-200 text-purple-500 transition-all"
              >
                🔊
              </button>
              <p className="text-2xl font-extrabold text-purple-900 text-center">{q.display}</p>
              {feedback && (
                <p className={`text-center font-extrabold mt-2 text-lg ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                  {feedback === 'correct' ? '✅ Correct!' : `❌ Answer: ${q.correctAnswer}`}
                </p>
              )}
            </div>

            {/* Hint */}
            {controls.showHints && q.hint && (
              <div className="text-center mb-3">
                {!showHint
                  ? <button onClick={() => setShowHint(true)} className="text-xs text-purple-400 hover:text-purple-600 font-semibold">💡 Hint?</button>
                  : <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-700 text-sm font-semibold">💡 {q.hint}</div>}
              </div>
            )}

            {/* Multiple choice */}
            {q.type === 'multiple-choice' && q.options && (
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt)} disabled={feedback !== null}
                    className={`min-h-[64px] px-4 py-3 rounded-2xl font-extrabold text-lg transition-all active:scale-95 border-2 ${
                      selectedOpt === opt
                        ? feedback === 'correct' ? 'bg-green-400 border-green-400 text-white' : 'bg-red-400 border-red-400 text-white'
                        : 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
                    }`}
                  >{opt}</button>
                ))}
              </div>
            )}

            {/* Number pad for typed */}
            {(q.type === 'addition' || q.type === 'subtraction' || q.type === 'division' || q.type === 'mixed') && (
              <div className="flex flex-col gap-3">
                <div className="w-full h-14 bg-purple-50 rounded-2xl border-2 border-purple-200 flex items-center px-4">
                  <span className="text-2xl font-extrabold text-purple-800">{typedAnswer || <span className="text-purple-300 text-base">Type your answer…</span>}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['1','2','3','4','5','6','7','8','9','⌫','0','✓'].map((k) => (
                    <button key={k} disabled={feedback !== null}
                      onClick={() => {
                        if (k === '⌫') { if (controls.soundEnabled) playNumberTapSound(); setTypedAnswer((p) => p.slice(0,-1)); }
                        else if (k === '✓') handleTypedSubmit();
                        else { if (controls.soundEnabled) playNumberTapSound(); setTypedAnswer((p) => p + k); }
                      }}
                      className={`min-h-[56px] rounded-2xl font-extrabold text-xl transition-all active:scale-95 ${
                        k === '✓' ? 'bg-orange-400 text-white hover:bg-orange-500' :
                        k === '⌫' ? 'bg-red-100 text-red-600 hover:bg-red-200' :
                        'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      }`}
                    >{k}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Working Space Canvas */}
          <div className="w-full md:w-72 bg-white rounded-2xl border-2 border-dashed border-purple-200 p-4 flex flex-col items-center">
            <p className="text-sm text-purple-500 font-extrabold mb-3">✏️ Working Space</p>
            <canvas
              ref={canvasRef}
              width={250}
              height={300}
              className="border-2 border-purple-100 rounded-xl bg-purple-50/30 cursor-crosshair touch-none w-full"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
            <button onClick={clearCanvas} className="mt-3 px-4 py-2 text-xs text-purple-500 hover:text-purple-700 font-bold bg-purple-50 rounded-xl hover:bg-purple-100 transition">
              🗑️ Clear
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
