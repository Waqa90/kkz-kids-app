'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Question } from '@/lib/stories';
import { saveQuizResult } from '@/lib/quizResults';
import { playCorrectSound, playWrongSound, playAchievementSound, playGoodJobSound } from '@/lib/sounds';
import { playCelebrationVoice } from '@/lib/celebrationVoice';
import { speak } from '@/lib/speech';

interface ComprehensionQuestionsProps {
  questions: Question[];
  storyTitle: string;
  childName?: string;
  slowMode?: boolean;
}

const OPTION_LABELS = ['A', 'B', 'C'];

const OPTION_COLORS = [
  {
    base: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',
    correct: 'bg-green-100 border-green-400 text-green-800',
    wrong: 'bg-red-100 border-red-400 text-red-800',
    label: 'bg-blue-200 text-blue-800',
    labelCorrect: 'bg-green-400 text-white',
    labelWrong: 'bg-red-400 text-white',
  },
  {
    base: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100',
    correct: 'bg-green-100 border-green-400 text-green-800',
    wrong: 'bg-red-100 border-red-400 text-red-800',
    label: 'bg-purple-200 text-purple-800',
    labelCorrect: 'bg-green-400 text-white',
    labelWrong: 'bg-red-400 text-white',
  },
  {
    base: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100',
    correct: 'bg-green-100 border-green-400 text-green-800',
    wrong: 'bg-red-100 border-red-400 text-red-800',
    label: 'bg-orange-200 text-orange-800',
    labelCorrect: 'bg-green-400 text-white',
    labelWrong: 'bg-red-400 text-white',
  },
];

// Shuffle an array (Fisher-Yates) — returns a new array
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface ShuffledQuestion {
  question: string;
  options: string[];
  correctIndex: number; // index within the shuffled options array
}

function buildShuffledQuestions(questions: Question[]): ShuffledQuestion[] {
  // Shuffle the question order, then shuffle each question's options
  return shuffle(questions).map((q) => {
    const correctAnswer = q.options[q.correctIndex];
    const shuffledOptions = shuffle(q.options);
    return {
      question: q.question,
      options: shuffledOptions,
      correctIndex: shuffledOptions.indexOf(correctAnswer),
    };
  });
}

// Small speaker button component
function SpeakButton({ text, label, slowMode }: { text: string; label: string; slowMode?: boolean }) {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeaking(true);
    speak(text, { rate: slowMode ? 0.6 : 0.85, pitch: 1.2, volume: 1.0, onEnd: () => setSpeaking(false), onError: () => setSpeaking(false) });
  };

  return (
    <button
      onClick={handleSpeak}
      aria-label={`Hear ${label}`}
      title={`Hear ${label}`}
      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm border-2 ${
        speaking
          ? 'bg-yellow-300 border-yellow-400 text-yellow-800 animate-pulse' :'bg-white border-purple-200 text-purple-500 hover:bg-purple-50 hover:border-purple-400'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" />
      </svg>
    </button>
  );
}

export default function ComprehensionQuestions({
  questions,
  storyTitle,
  childName,
  slowMode,
}: ComprehensionQuestionsProps) {
  // Build shuffled questions once on mount (client-side only)
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [mounted, setMounted] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);

  useEffect(() => {
    const sq = buildShuffledQuestions(questions);
    setShuffledQuestions(sq);
    setAnswers(sq.map(() => null));
    setMounted(true);
    setResultSaved(false);
  }, [questions]);

  const handleAnswer = (qIdx: number, optIdx: number) => {
    if (answers[qIdx] !== null) return;
    const isCorrect = optIdx === shuffledQuestions[qIdx]?.correctIndex;
    if (isCorrect) {
      playCorrectSound();
      speak("Great job! That's correct!", { rate: slowMode ? 0.6 : 0.85 });
    } else {
      playWrongSound();
      const correctAnswer = shuffledQuestions[qIdx]?.options[shuffledQuestions[qIdx].correctIndex];
      speak(`Wrong. The correct answer was: ${correctAnswer}`, { rate: slowMode ? 0.6 : 0.85 });
    }
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  };

  const handleReset = useCallback(() => {
    const sq = buildShuffledQuestions(questions);
    setShuffledQuestions(sq);
    setAnswers(sq.map(() => null));
    setResultSaved(false);
  }, [questions]);

  if (!mounted || shuffledQuestions.length === 0) {
    return (
      <div className="mt-2 flex justify-center py-10">
        <div className="w-10 h-10 rounded-full border-4 border-purple-300 border-t-purple-600 animate-spin" />
      </div>
    );
  }

  const allAnswered = answers.length > 0 && answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === shuffledQuestions[i]?.correctIndex).length;

  // Save result once when all answered
  if (allAnswered && !resultSaved) {
    setResultSaved(true);
    saveQuizResult({ storyTitle, childName, score, total: shuffledQuestions.length });
    // Play achievement sound based on score
    if (score === shuffledQuestions.length) {
      playAchievementSound();
      playCelebrationVoice(childName, score, shuffledQuestions.length, 'questions');
    } else if (score >= shuffledQuestions.length / 2) {
      playGoodJobSound();
      playCelebrationVoice(childName, score, shuffledQuestions.length, 'questions');
    }
  }

  return (
    <div className="mt-2">
      {/* Intro banner */}
      <div className="mb-5 px-5 py-3 bg-purple-50 border-2 border-purple-200 rounded-2xl text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <p className="text-purple-700 font-bold text-base md:text-lg">
            🧠 Answer the questions about{' '}
            <span className="text-purple-900">{storyTitle}</span>!
          </p>
          <SpeakButton
            text={`Answer the questions about ${storyTitle}!`}
            label="activity instruction"
            slowMode={slowMode}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-6">
        {shuffledQuestions.map((q, qIdx) => {
          const chosen = answers[qIdx];
          const isAnswered = chosen !== null;
          const colorSet = OPTION_COLORS[qIdx % OPTION_COLORS.length];

          return (
            <div
              key={qIdx}
              className="bg-white rounded-3xl border-2 border-purple-100 shadow-kitty p-5 md:p-6"
            >
              {/* Question number + text + speak button */}
              <div className="flex items-start gap-3 mb-4">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-purple-500 text-white font-extrabold text-lg flex items-center justify-center shadow">
                  {qIdx + 1}
                </span>
                <p className="text-lg md:text-xl font-bold text-purple-900 leading-snug pt-1 flex-1">
                  {q.question}
                </p>
                <SpeakButton text={q.question} label="question" slowMode={slowMode} />
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {q.options.map((opt, optIdx) => {
                  const isChosen = chosen === optIdx;
                  const isCorrect = optIdx === q.correctIndex;

                  let btnClass = `flex items-center gap-3 w-full px-4 py-3 rounded-2xl border-2 font-semibold text-base md:text-lg text-left transition-all active:scale-95 `;
                  let labelClass = `flex-shrink-0 w-8 h-8 rounded-full font-extrabold text-sm flex items-center justify-center `;

                  if (!isAnswered) {
                    btnClass += colorSet.base;
                    labelClass += colorSet.label;
                  } else if (isCorrect) {
                    btnClass += colorSet.correct + ' cursor-default';
                    labelClass += colorSet.labelCorrect;
                  } else if (isChosen && !isCorrect) {
                    btnClass += colorSet.wrong + ' cursor-default';
                    labelClass += colorSet.labelWrong;
                  } else {
                    btnClass += 'bg-gray-50 border-gray-200 text-gray-400 cursor-default';
                    labelClass += 'bg-gray-200 text-gray-500';
                  }

                  return (
                    <div key={optIdx} className="flex items-center gap-2">
                      <button
                        onClick={() => handleAnswer(qIdx, optIdx)}
                        disabled={isAnswered}
                        className={btnClass + ' flex-1'}
                        aria-label={`Option ${OPTION_LABELS[optIdx]}: ${opt}`}
                      >
                        <span className={labelClass}>{OPTION_LABELS[optIdx]}</span>
                        <span className="flex-1">{opt}</span>
                        {isAnswered && isCorrect && (
                          <span className="text-xl ml-auto">✅</span>
                        )}
                        {isAnswered && isChosen && !isCorrect && (
                          <span className="text-xl ml-auto">❌</span>
                        )}
                      </button>
                      <SpeakButton text={opt} label={`option ${OPTION_LABELS[optIdx]}`} slowMode={slowMode} />
                    </div>
                  );
                })}
              </div>

              {/* Feedback */}
              {isAnswered && (
                <div
                  className={`mt-3 px-4 py-2 rounded-xl text-sm font-bold text-center ${
                    chosen === q.correctIndex
                      ? 'bg-green-100 text-green-700' :'bg-red-50 text-red-600'
                  }`}
                >
                  {chosen === q.correctIndex
                    ? "🎉 Great job! That's correct!"
                    : `The correct answer was: ${q.options[q.correctIndex]}`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Score card — shown when all answered */}
      {allAnswered && (
        <div className="mt-6 bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 rounded-3xl p-6 text-center shadow-kitty">
          <div className="text-5xl mb-2">
            {score === shuffledQuestions.length
              ? '🏆'
              : score >= shuffledQuestions.length / 2
              ? '⭐' :'💪'}
          </div>
          <p className="text-2xl font-extrabold text-purple-800 mb-1">
            You got {score} out of {shuffledQuestions.length}!
          </p>
          <p className="text-base font-semibold text-purple-600 mb-4">
            {score === shuffledQuestions.length
              ? 'Perfect score! Amazing reading! 🎉'
              : score >= shuffledQuestions.length / 2
              ? 'Good work! Keep reading! 📚' :'Nice try! Read the story again and try once more! 🌟'}
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-purple-500 text-white font-bold text-base rounded-2xl hover:bg-purple-600 transition-all active:scale-95 shadow-md"
          >
            🔄 Try Again with New Questions
          </button>
        </div>
      )}
    </div>
  );
}