'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useChat } from '@/lib/hooks/useChat';
import { savePronunciationReport, type WeakWord, type PronunciationIssue } from '@/lib/pronunciationReports';
import { speak, stopSpeech } from '@/lib/speech';
import toast from 'react-hot-toast';
import type { Story } from '@/lib/stories';

interface TeacherXProps {
  story: Story;
  onClose: () => void;
}

type SessionPhase = 'intro' | 'reading' | 'assessing' | 'done';

interface WordAttempt {
  word: string;
  sentenceIdx: number;
  wordIdx: number;
  userSaid: string;
  correct: boolean;
}

interface AssessmentResult {
  overallScore: number;
  wordsAttempted: number;
  wordsCorrect: number;
  weakWords: WeakWord[];
  pronunciationIssues: PronunciationIssue[];
  strengths: string;
  improvementsNeeded: string;
  teacherFeedback: string;
}

function tokenizeStory(text: string): string[][] {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0)
    .map((sentence) =>
      sentence
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 0)
    );
}

function cleanWord(word: string): string {
  return word.replace(/[^a-zA-Z'-]/g, '').toLowerCase();
}

/** Fuzzy match: checks if heard word is close enough to target */
function isWordMatch(heard: string, target: string): boolean {
  const h = heard.replace(/[^a-z'-]/g, '');
  const t = target.replace(/[^a-z'-]/g, '');
  if (!h || !t) return false;
  if (h === t) return true;
  if (h.includes(t) || t.includes(h)) return true;
  // Allow 1-char difference for short words, 2-char for longer
  const maxDiff = t.length <= 4 ? 1 : 2;
  if (Math.abs(h.length - t.length) > maxDiff) return false;
  let diff = 0;
  const shorter = h.length < t.length ? h : t;
  const longer = h.length < t.length ? t : h;
  for (let i = 0; i < shorter.length; i++) {
    if (shorter[i] !== longer[i]) diff++;
  }
  diff += longer.length - shorter.length;
  return diff <= maxDiff;
}

export default function TeacherX({ story, onClose }: TeacherXProps) {
  const [phase, setPhase] = useState<SessionPhase>('intro');
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [wordAttempts, setWordAttempts] = useState<WordAttempt[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [teacherMessage, setTeacherMessage] = useState('');
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [autoListenPending, setAutoListenPending] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speakTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentences = tokenizeStory(story.text);
  const totalWords = sentences.flat().filter((w) => cleanWord(w).length > 0).length;

  const { response, isLoading, error, sendMessage } = useChat(
    'ANTHROPIC',
    'claude-sonnet-4-5-20250929',
    false
  );

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      recognitionRef.current?.abort();
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
    };
  }, []);

  /**
   * Teacher speaks — sets isSpeaking=true while talking, then auto-triggers
   * listening if autoListen=true after speech ends.
   */
  const teacherSpeak = useCallback((text: string, autoListen = false) => {
    // Stop any active recognition before Teacher X speaks
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setIsListening(false);
    setIsSpeaking(true);
    setTeacherMessage(text);
    stopSpeech();

    // Estimate speech duration: ~100ms per character, min 1.5s, max 8s
    const estimatedMs = Math.min(Math.max(text.length * 75, 1500), 8000);

    speak(text, { rate: 0.85 });

    if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
    speakTimeoutRef.current = setTimeout(() => {
      setIsSpeaking(false);
      if (autoListen) {
        setAutoListenPending(true);
      }
    }, estimatedMs);
  }, []);

  // Auto-listen trigger
  useEffect(() => {
    if (autoListenPending && !isSpeaking && phase === 'reading') {
      setAutoListenPending(false);
      startListeningFn();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoListenPending, isSpeaking, phase]);

  // Start intro
  useEffect(() => {
    if (phase === 'intro') {
      teacherSpeak(
        `Hi Kitty! I am Teacher X. Today we will read "${story.title}" together. I will listen to you read each word. Tap Start Reading when you are ready!`
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListeningFn = useCallback(() => {
    if (isListening || isSpeaking) return;

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in your browser. Please use Chrome!');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 5;
    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = Array.from(event.results[0]).map((r) => (r as SpeechRecognitionResultEntry).transcript.toLowerCase().trim());
      const heard = results[0] || '';
      setTranscript(heard);
      setIsListening(false);
      recognitionRef.current = null;

      // Use current state via functional updater pattern
      setCurrentSentenceIdx((sIdx) => {
        setCurrentWordIdx((wIdx) => {
          const currentSentence = sentences[sIdx];
          const currentWord = cleanWord(currentSentence?.[wIdx] || '');

          // Check all alternatives with fuzzy matching
          const isCorrect = results.some((alt) => isWordMatch(alt, currentWord));

          const attempt: WordAttempt = {
            word: currentWord,
            sentenceIdx: sIdx,
            wordIdx: wIdx,
            userSaid: heard,
            correct: isCorrect,
          };

          setWordAttempts((prev) => [...prev, attempt]);

          if (isCorrect) {
            // Advance immediately after brief positive feedback
            setTimeout(() => {
              advanceWordFn(sIdx, wIdx, sentences);
            }, 300);
            teacherSpeak(`Great! "${currentWord}" — well done!`, false);
          } else {
            teacherSpeak(`Good try! The word is "${currentWord}". Let us keep going!`, false);
            setTimeout(() => {
              advanceWordFn(sIdx, wIdx, sentences);
            }, 1800);
          }

          return wIdx;
        });
        return sIdx;
      });
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      recognitionRef.current = null;
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        toast.error('Could not hear you clearly. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setIsListening(true);
    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, isSpeaking, sentences, teacherSpeak]);

  const advanceWordFn = useCallback(
    (sIdx: number, wIdx: number, sents: string[][]) => {
      const sentence = sents[sIdx];
      let nextWIdx = wIdx + 1;
      let nextSIdx = sIdx;

      // Skip punctuation-only tokens
      while (nextWIdx < sentence.length && cleanWord(sentence[nextWIdx]).length === 0) {
        nextWIdx++;
      }

      if (nextWIdx >= sentence.length) {
        nextSIdx = sIdx + 1;
        nextWIdx = 0;

        if (nextSIdx >= sents.length) {
          setPhase('assessing');
          return;
        }

        // Skip to first real word in next sentence
        while (nextWIdx < sents[nextSIdx].length && cleanWord(sents[nextSIdx][nextWIdx]).length === 0) {
          nextWIdx++;
        }

        const nextSentenceText = sents[nextSIdx].join(' ');
        const firstWord = cleanWord(sents[nextSIdx][nextWIdx] || '');
        setCurrentSentenceIdx(nextSIdx);
        setCurrentWordIdx(nextWIdx);
        teacherSpeak(`Next sentence: "${nextSentenceText}". Read the first word: "${firstWord}"`, true);
        return;
      }

      const nextWord = cleanWord(sents[nextSIdx][nextWIdx] || '');
      setCurrentSentenceIdx(nextSIdx);
      setCurrentWordIdx(nextWIdx);
      teacherSpeak(`Now say: "${nextWord}"`, true);
    },
    [teacherSpeak]
  );

  // When phase becomes 'assessing', send to Claude
  useEffect(() => {
    if (phase !== 'assessing') return;

    const wrongWords = wordAttempts.filter((a) => !a.correct);
    const correctCount = wordAttempts.filter((a) => a.correct).length;
    const score = wordAttempts.length > 0 ? Math.round((correctCount / wordAttempts.length) * 100) : 0;

    teacherSpeak('Wonderful! You finished reading. Let me check your pronunciation now. Just a moment!');

    const prompt = `You are Teacher X, a friendly children's reading coach. Kitty (a young child) just read the story "${story.title}".

Here are her reading attempts:
- Total words attempted: ${wordAttempts.length}
- Words read correctly: ${correctCount}
- Score: ${score}%
- Words she struggled with: ${wrongWords.map((w) => `"${w.word}" (she said: "${w.userSaid}")`).join(', ') || 'none'}

Please provide a JSON assessment with this exact structure (no markdown, just JSON):
{
  "weakWords": [{"word": "...", "issue": "...", "tip": "..."}],
  "pronunciationIssues": [{"category": "...", "description": "...", "examples": ["..."]}],
  "strengths": "...",
  "improvementsNeeded": "...",
  "teacherFeedback": "A warm, encouraging 2-sentence message for Kitty"
}

Keep it child-friendly and encouraging. Focus on the most important 3-5 weak words maximum.`;

    sendMessage([
      { role: 'system', content: 'You are a children\'s reading coach. Always respond with valid JSON only, no markdown.' },
      { role: 'user', content: prompt },
    ], { max_tokens: 1000, temperature: 0.3 });

    setAssessment({
      overallScore: score,
      wordsAttempted: wordAttempts.length,
      wordsCorrect: correctCount,
      weakWords: [],
      pronunciationIssues: [],
      strengths: '',
      improvementsNeeded: '',
      teacherFeedback: '',
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Parse Claude response
  useEffect(() => {
    if (!response || isLoading || phase !== 'assessing') return;

    try {
      const jsonStr = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(jsonStr);

      const wrongWords = wordAttempts.filter((a) => !a.correct);
      const correctCount = wordAttempts.filter((a) => a.correct).length;
      const score = wordAttempts.length > 0 ? Math.round((correctCount / wordAttempts.length) * 100) : 0;

      const result: AssessmentResult = {
        overallScore: score,
        wordsAttempted: wordAttempts.length,
        wordsCorrect: correctCount,
        weakWords: parsed.weakWords || [],
        pronunciationIssues: parsed.pronunciationIssues || [],
        strengths: parsed.strengths || '',
        improvementsNeeded: parsed.improvementsNeeded || '',
        teacherFeedback: parsed.teacherFeedback || 'Great job reading today!',
      };

      setAssessment(result);
      setPhase('done');
      teacherSpeak(result.teacherFeedback);
    } catch {
      const wrongWords = wordAttempts.filter((a) => !a.correct);
      const correctCount = wordAttempts.filter((a) => a.correct).length;
      const score = wordAttempts.length > 0 ? Math.round((correctCount / wordAttempts.length) * 100) : 0;

      const fallback: AssessmentResult = {
        overallScore: score,
        wordsAttempted: wordAttempts.length,
        wordsCorrect: correctCount,
        weakWords: wrongWords.slice(0, 5).map((w) => ({
          word: w.word,
          issue: 'Pronunciation needs practice',
          tip: `Try saying "${w.word}" slowly, one sound at a time.`,
        })),
        pronunciationIssues: [],
        strengths: correctCount > 0 ? `Kitty read ${correctCount} words correctly!` : 'Kitty tried her best!',
        improvementsNeeded: wrongWords.length > 0 ? `Practice these words: ${wrongWords.map((w) => w.word).join(', ')}` : 'Keep reading every day!',
        teacherFeedback: 'Great effort today, Kitty! Keep practising and you will get even better!',
      };
      setAssessment(fallback);
      setPhase('done');
      teacherSpeak(fallback.teacherFeedback);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, isLoading]);

  const handleSaveReport = async () => {
    if (!assessment) return;
    setIsSaving(true);
    const result = await savePronunciationReport({
      profileKey: 'kitty',
      storyId: story.id,
      storyTitle: story.title,
      sessionDate: new Date().toISOString(),
      overallScore: assessment.overallScore,
      wordsAttempted: assessment.wordsAttempted,
      wordsCorrect: assessment.wordsCorrect,
      weakWords: assessment.weakWords,
      pronunciationIssues: assessment.pronunciationIssues,
      strengths: assessment.strengths,
      improvementsNeeded: assessment.improvementsNeeded,
      teacherFeedback: assessment.teacherFeedback,
    });
    setIsSaving(false);
    if (result) {
      setSaved(true);
      toast.success('Report saved to Parent dashboard! 📊');
    } else {
      toast.error('Could not save report. Please try again.');
    }
  };

  const currentSentence = sentences[currentSentenceIdx] || [];
  const currentWord = cleanWord(currentSentence[currentWordIdx] || '');

  const scoreColor =
    (assessment?.overallScore ?? 0) >= 80
      ? 'text-green-600'
      : (assessment?.overallScore ?? 0) >= 50
      ? 'text-yellow-600' :'text-red-600';

  const wordsAttemptedCount = wordAttempts.length;
  const progressPct = totalWords > 0 ? Math.round((wordsAttemptedCount / totalWords) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-purple-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <div>
              <h2 className="text-white font-extrabold text-lg leading-tight">Teacher X</h2>
              <p className="text-purple-100 text-xs font-semibold">AI Reading Coach</p>
            </div>
          </div>
          {/* Status pill */}
          <div className="flex items-center gap-2">
            {isSpeaking && (
              <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse" />
                Speaking…
              </span>
            )}
            {isListening && (
              <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-ping" />
                Listening…
              </span>
            )}
            <button
              onClick={() => { stopSpeech(); recognitionRef.current?.abort(); onClose(); }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-lg transition-all"
              aria-label="Close Teacher X"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {/* Teacher message bubble */}
          {teacherMessage && (
            <div className="flex items-start gap-3">
              <span className={`text-2xl flex-shrink-0 ${isSpeaking ? 'animate-bounce' : ''}`}>🤖</span>
              <div className={`border-2 rounded-2xl rounded-tl-none px-4 py-3 font-semibold text-sm leading-relaxed transition-all ${
                isSpeaking
                  ? 'bg-purple-100 border-purple-400 text-purple-900 shadow-md'
                  : 'bg-purple-50 border-purple-200 text-purple-800'
              }`}>
                {teacherMessage}
                {isSpeaking && (
                  <span className="inline-flex gap-0.5 ml-2 align-middle">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
              </div>
            </div>
          )}

          {/* INTRO phase */}
          {phase === 'intro' && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="text-6xl animate-bounce">{story.emoji}</div>
              <h3 className="text-xl font-extrabold text-purple-800 text-center">{story.title}</h3>
              <p className="text-purple-500 text-sm text-center font-semibold">
                Teacher X will guide you word by word. Just read what Teacher X asks!
              </p>
              {/* Only show Start button when Teacher X is done speaking */}
              {!isSpeaking && (
                <button
                  onClick={() => {
                    const firstWord = cleanWord(sentences[0]?.[0] || '');
                    setPhase('reading');
                    setCurrentSentenceIdx(0);
                    setCurrentWordIdx(0);
                    teacherSpeak(`Let us start! Read this word: "${firstWord}"`, true);
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-extrabold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  🎓 Start Reading!
                </button>
              )}
            </div>
          )}

          {/* READING phase */}
          {phase === 'reading' && (
            <div className="flex flex-col gap-4">
              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-purple-500 mb-1">
                  <span>Sentence {currentSentenceIdx + 1} of {sentences.length}</span>
                  <span>{wordAttempts.filter((a) => a.correct).length} ✅ / {wordAttempts.filter((a) => !a.correct).length} ❌</span>
                </div>
                <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Current sentence */}
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
                <p className="text-xs font-bold text-orange-500 mb-2 uppercase tracking-wide">Current Sentence</p>
                <p className="text-base font-semibold text-orange-900 leading-relaxed">
                  {currentSentence.map((word, idx) => {
                    const clean = cleanWord(word);
                    const isCurrentWord = idx === currentWordIdx;
                    const attempt = wordAttempts.find(
                      (a) => a.sentenceIdx === currentSentenceIdx && a.wordIdx === idx
                    );
                    return (
                      <span
                        key={idx}
                        className={`mr-1 px-1 rounded transition-all ${
                          isCurrentWord
                            ? 'bg-orange-400 text-white font-extrabold rounded-lg px-2'
                            : attempt?.correct
                            ? 'text-green-600 font-bold'
                            : attempt
                            ? 'text-red-500 font-bold line-through' :'text-orange-800'
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </p>
              </div>

              {/* Word to read */}
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm font-bold text-purple-600">Read this word:</p>
                <div
                  className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl px-10 py-5 text-4xl font-extrabold text-purple-800 tracking-wide shadow-md"
                  style={{ border: '3px solid #a855f7' }}
                >
                  {currentWord}
                </div>

                {transcript && !isListening && (
                  <p className="text-xs text-gray-500 font-semibold">
                    I heard: &ldquo;<span className="text-purple-600">{transcript}</span>&rdquo;
                  </p>
                )}

                {/* Mic button — HIDDEN while Teacher X is speaking */}
                {!isSpeaking ? (
                  <button
                    onClick={startListeningFn}
                    disabled={isListening}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-lg transition-all active:scale-95 shadow-md ${
                      isListening
                        ? 'bg-red-400 text-white animate-pulse cursor-not-allowed' :'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-lg'
                    }`}
                  >
                    <span className="text-2xl">{isListening ? '🎙️' : '🎤'}</span>
                    <span>{isListening ? 'Listening…' : 'Say the Word!'}</span>
                  </button>
                ) : (
                  /* Placeholder while Teacher X speaks — keeps layout stable */
                  <div className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-purple-50 border-2 border-purple-200 text-purple-400 font-bold text-base">
                    <span className="text-xl">🤖</span>
                    <span>Teacher X is speaking…</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ASSESSING phase */}
          {phase === 'assessing' && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-16 h-16 rounded-full border-4 border-purple-300 border-t-purple-600 animate-spin" />
              <p className="text-purple-700 font-bold text-lg text-center">
                Teacher X is checking your reading…
              </p>
              <p className="text-purple-400 text-sm text-center">
                Analysing pronunciation and preparing your report 📊
              </p>
            </div>
          )}

          {/* DONE phase */}
          {phase === 'done' && assessment && (
            <div className="flex flex-col gap-4">
              {/* Score card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-5 text-center">
                <p className="text-xs font-bold text-purple-500 uppercase tracking-wide mb-1">Overall Score</p>
                <p className={`text-5xl font-extrabold ${scoreColor}`}>{assessment.overallScore}%</p>
                <p className="text-sm text-purple-500 mt-1 font-semibold">
                  {assessment.wordsCorrect} / {assessment.wordsAttempted} words correct
                </p>
              </div>

              {/* Strengths */}
              {assessment.strengths && (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">✅ Strengths</p>
                  <p className="text-green-800 text-sm font-semibold">{assessment.strengths}</p>
                </div>
              )}

              {/* Improvements */}
              {assessment.improvementsNeeded && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-1">📈 Needs Improvement</p>
                  <p className="text-orange-800 text-sm font-semibold">{assessment.improvementsNeeded}</p>
                </div>
              )}

              {/* Weak words */}
              {assessment.weakWords.length > 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-3">🔤 Words to Practise</p>
                  <div className="flex flex-col gap-2">
                    {assessment.weakWords.map((ww, i) => (
                      <div key={i} className="bg-white rounded-xl border border-red-100 px-3 py-2">
                        <span className="font-extrabold text-red-700 text-sm">&ldquo;{ww.word}&rdquo;</span>
                        <span className="text-red-500 text-xs ml-2">— {ww.issue}</span>
                        {ww.tip && <p className="text-gray-500 text-xs mt-0.5 italic">{ww.tip}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save button */}
              <button
                onClick={handleSaveReport}
                disabled={isSaving || saved}
                className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all active:scale-95 shadow-md ${
                  saved
                    ? 'bg-green-100 text-green-600 border-2 border-green-200 cursor-not-allowed' :'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Saving…
                  </span>
                ) : saved ? (
                  '✅ Report Saved to Parent Dashboard!'
                ) : (
                  '📊 Save Report to Parent Dashboard'
                )}
              </button>

              <button
                onClick={() => { stopSpeech(); recognitionRef.current?.abort(); onClose(); }}
                className="w-full py-3 rounded-2xl font-bold text-base text-purple-600 border-2 border-purple-200 hover:bg-purple-50 transition-all"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
