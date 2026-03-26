'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { speak, stopSpeech } from '@/lib/speech';
import { playCorrectSound, playWrongSound, playAchievementSound, playGoodJobSound } from '@/lib/sounds';
import type { SubjectKey } from '@/lib/childProfile';

export interface SubjectQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'typed' | 'match';
  options?: string[];
  correctAnswer: string;
  correctIndex?: number;
  hint?: string;
  emoji?: string;
}

interface ActivityRunnerProps {
  questions: SubjectQuestion[];
  childName: string;
  subjectKey: SubjectKey;
  activityTitle: string;
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
  showHints?: boolean;
  soundEnabled?: boolean;
}

export default function SubjectActivityRunner({
  questions, childName, subjectKey, activityTitle, onComplete, onBack, showHints = true, soundEnabled = true,
}: ActivityRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [done, setDone] = useState(false);
  const [showHintText, setShowHintText] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const speakQuestion = useCallback((text: string) => {
    if (!soundEnabled) return;
    stopSpeech();
    setIsSpeaking(true);
    speak(text, {
      rate: 0.9,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, [soundEnabled]);

  const q = questions[currentIndex];

  useEffect(() => {
    if (q && soundEnabled) {
      speakQuestion(q.question);
    }
    return () => stopSpeech();
    // Only trigger when the question index changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);
  const progress = ((currentIndex) / questions.length) * 100;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const stars = pct >= 100 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;

  const handleAnswer = useCallback((answer: string) => {
    if (feedback !== null) return;
    const correct = answer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
    setSelected(answer);
    setFeedback(correct ? 'correct' : 'wrong');
    const feedbackText = correct ? 'Correct!' : `The answer was ${q.correctAnswer}`;
    setTimeout(() => { if (soundEnabled) speak(feedbackText, { rate: 1.0, pitch: correct ? 1.4 : 0.9 }); }, 100);
    if (correct) {
      if (soundEnabled) playCorrectSound();
      setScore((s) => s + 1);
    } else {
      if (soundEnabled) playWrongSound();
    }
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      setTypedAnswer('');
      setShowHintText(false);
      if (currentIndex + 1 >= questions.length) {
        setDone(true);
        const newScore = correct ? score + 1 : score;
        if (soundEnabled) {
          if (newScore === questions.length) playAchievementSound();
          else playGoodJobSound();
        }
        setTimeout(() => onComplete(newScore, questions.length), 800);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 1200);
  }, [feedback, q, currentIndex, questions.length, score, soundEnabled, onComplete]);

  const handleTypedSubmit = () => {
    if (!typedAnswer.trim()) return;
    handleAnswer(typedAnswer.trim());
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12 px-4">
        <div className="text-6xl">{pct === 100 ? '🏆' : pct >= 70 ? '🎉' : '💪'}</div>
        <h2 className="text-2xl font-extrabold text-purple-800">
          {pct === 100 ? 'Perfect Score!' : pct >= 70 ? 'Great Job!' : 'Keep Practising!'}
        </h2>
        <p className="text-purple-600 font-bold">{score} / {questions.length} correct</p>
        <div className="flex gap-1 text-3xl">
          {[1,2,3].map((s) => <span key={s}>{s <= stars ? '⭐' : '☆'}</span>)}
        </div>
        <button onClick={onBack} className="w-full sm:w-auto px-8 py-3 bg-orange-400 hover:bg-orange-500 text-white font-extrabold rounded-2xl transition-all active:scale-95 shadow-md">
          Back to Activities
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto px-4 sm:px-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold transition-colors">← Back</button>
        <div className="flex-1">
          <p className="text-xs font-bold text-purple-500 mb-1">{activityTitle} — {currentIndex + 1} of {questions.length}</p>
          <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="text-sm font-extrabold text-orange-500">{score} ⭐</div>
      </div>

      {/* Question card */}
      <div className={`relative bg-white rounded-3xl border-4 p-6 shadow-lg transition-all duration-300 ${
        feedback === 'correct' ? 'border-green-400 bg-green-50 scale-[1.01]' : feedback === 'wrong' ? 'border-red-400 bg-red-50 animate-[shake_0.3s_ease]' : 'border-purple-100'
      }`}>
        {q.emoji && <div className="text-4xl text-center mb-3">{q.emoji}</div>}
        <button
          type="button"
          onClick={() => speakQuestion(q.question)}
          title="Read question aloud"
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition-all ${isSpeaking ? 'bg-purple-500 text-white animate-pulse' : 'bg-purple-100 hover:bg-purple-200 text-purple-500'}`}
        >
          🔊
        </button>
        <p className="text-lg md:text-xl font-extrabold text-purple-900 text-center leading-snug">{q.question}</p>
        {feedback && (
          <p className={`text-center font-extrabold mt-2 ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback === 'correct' ? '✅ Correct!' : `❌ The answer was: ${q.correctAnswer}`}
          </p>
        )}
      </div>

      {/* Hint */}
      {showHints && q.hint && (
        <div className="text-center">
          {!showHintText
            ? <button onClick={() => setShowHintText(true)} className="text-xs text-purple-400 hover:text-purple-600 font-semibold">💡 Need a hint?</button>
            : <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-700 text-sm font-semibold">💡 {q.hint}</div>
          }
        </div>
      )}

      {/* Answer area */}
      {(q.type === 'multiple-choice') && (
        <div className="grid grid-cols-2 gap-3">
          {q.options?.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(opt)} disabled={feedback !== null}
              className={`min-h-[64px] px-4 py-3 rounded-2xl font-bold text-base transition-all active:scale-95 border-2 ${
                selected === opt
                  ? feedback === 'correct' ? 'bg-green-400 border-green-400 text-white' : 'bg-red-400 border-red-400 text-white'
                  : 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
              }`}
            >{opt}</button>
          ))}
        </div>
      )}

      {(q.type === 'true-false') && (
        <div className="grid grid-cols-2 gap-4">
          {['True', 'False'].map((opt) => (
            <button key={opt} onClick={() => handleAnswer(opt)} disabled={feedback !== null}
              className={`min-h-[72px] text-2xl font-extrabold rounded-2xl border-2 transition-all active:scale-95 ${
                selected === opt
                  ? feedback === 'correct' ? 'bg-green-400 border-green-400 text-white' : 'bg-red-400 border-red-400 text-white'
                  : opt === 'True' ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
              }`}
            >{opt === 'True' ? '✅ True' : '❌ False'}</button>
          ))}
        </div>
      )}

      {(q.type === 'typed') && (
        <div className="flex flex-col gap-3">
          <div className="w-full h-14 bg-purple-50 rounded-2xl border-2 border-purple-200 flex items-center px-4">
            <span className="text-2xl font-extrabold text-purple-800 tracking-widest">{typedAnswer || <span className="text-purple-300">Type your answer…</span>}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['1','2','3','4','5','6','7','8','9','⌫','0','✓'].map((k) => (
              <button key={k} disabled={feedback !== null}
                onClick={() => {
                  if (k === '⌫') setTypedAnswer((p) => p.slice(0, -1));
                  else if (k === '✓') handleTypedSubmit();
                  else setTypedAnswer((p) => p + k);
                }}
                className={`min-h-[56px] rounded-2xl font-extrabold text-xl transition-all active:scale-95 ${
                  k === '✓' ? 'bg-orange-400 text-white hover:bg-orange-500 col-span-1' :
                  k === '⌫' ? 'bg-red-100 text-red-600 hover:bg-red-200' :
                  'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
              >{k}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
