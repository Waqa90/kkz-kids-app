'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MATHS_SETS, type MathsSet, type MathsQuestion } from '@/lib/maths';
import { saveMathsResultAsync } from '@/lib/mathsResults';
import { isSubjectEnabled, getChildControls, getChildClassFromSettings } from '@/app/parent/components/SettingsPanel';
import { CHILD_NAMES, type ChildName } from '@/lib/childProfile';
import { playCorrectSound, playWrongSound, playAchievementSound, playGoodJobSound, playNumberTapSound } from '@/lib/sounds';
import { speak, stopSpeech } from '@/lib/speech';
import { playCelebrationVoiceForMaths } from '@/lib/celebrationVoice';
import MathsSetSelector from './MathsSetSelector';
import AppNav from '@/components/AppNav';

type Screen = 'selector' | 'quiz' | 'result';

export default function MathsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const childParam = searchParams.get('child');

  const [screen, setScreen] = useState<Screen>('selector');
  const [activeSet, setActiveSet] = useState<MathsSet | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const childName = (childParam && CHILD_NAMES.includes(childParam as ChildName)) ? (childParam as ChildName) : null;

  useEffect(() => {
    if (!childName) router.replace('/subjects');
  }, [childName, router]);

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
  const childClass = getChildClassFromSettings(childName);
  const filteredSets = MATHS_SETS.filter((s) => s.class === childClass);

  const startSet = (set: MathsSet) => {
    setActiveSet(set);
    setQIndex(0);
    setScore(0);
    setTypedAnswer('');
    setSelectedOpt(null);
    setFeedback(null);
    setShowHint(false);
    setScreen('quiz');
  };

  const handleAnswer = (answer: string) => {
    if (!activeSet || feedback !== null) return;
    const q = activeSet.questions[qIndex];
    const correct = answer.trim() === String(q.correctAnswer).trim();
    setSelectedOpt(answer);
    setFeedback(correct ? 'correct' : 'wrong');
    if (controls.soundEnabled) {
      const feedbackText = correct ? 'Correct!' : `The answer was ${q.correctAnswer}`;
      setTimeout(() => speak(feedbackText, { rate: 1.0, pitch: correct ? 1.4 : 0.9 }), 100);
    }
    const newScore = correct ? score + 1 : score;
    if (correct) { if (controls.soundEnabled) playCorrectSound(); }
    else { if (controls.soundEnabled) playWrongSound(); }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOpt(null);
      setTypedAnswer('');
      setShowHint(false);
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

  // ── Selector screen ────────────────────────────────────────────────────
  if (screen === 'selector') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => router.push(`/subjects?child=${childName}`)} className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold transition-colors">←</button>
            <div>
              <h1 className="text-2xl font-extrabold text-purple-800">🔢 Maths</h1>
              <p className="text-sm text-purple-500">Class {childClass} activities for {childName}</p>
            </div>
          </div>
          <MathsSetSelector sets={filteredSets} childName={childName} onSelect={startSet} />
        </main>
      </div>
    );
  }

  // ── Result screen ──────────────────────────────────────────────────────
  if (screen === 'result' && activeSet) {
    const pct = activeSet.questions.length > 0 ? Math.round((score / activeSet.questions.length) * 100) : 0;
    const stars = pct >= 100 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0 flex items-center justify-center">
        <AppNav />
        <div className="flex flex-col items-center gap-5 px-4 text-center max-w-sm mx-auto">
          <div className="text-7xl">{pct === 100 ? '🏆' : pct >= 70 ? '🎉' : '💪'}</div>
          <h2 className="text-2xl font-extrabold text-purple-800">{pct === 100 ? 'Perfect Score!' : pct >= 70 ? 'Great Job!' : 'Keep Practising!'}</h2>
          <p className="text-lg font-bold text-purple-600">{score} / {activeSet.questions.length} correct</p>
          <div className="flex gap-2 text-4xl">{[1,2,3].map((s) => <span key={s}>{s <= stars ? '⭐' : '☆'}</span>)}</div>
          <div className="flex gap-3 mt-2">
            <button onClick={() => startSet(activeSet)} className="px-5 py-3 bg-orange-400 hover:bg-orange-500 text-white font-extrabold rounded-2xl transition-all active:scale-95 shadow">🔄 Try Again</button>
            <button onClick={() => setScreen('selector')} className="px-5 py-3 bg-purple-500 hover:bg-purple-600 text-white font-extrabold rounded-2xl transition-all active:scale-95 shadow">Back to Sets</button>
          </div>
        </div>
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
      <main className="max-w-lg mx-auto px-4 py-4">
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
      </main>
    </div>
  );
}
