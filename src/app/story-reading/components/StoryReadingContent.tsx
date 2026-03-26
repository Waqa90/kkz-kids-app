'use client';

/**
 * StoryReadingContent — full story reading experience
 * - Story selector carousel
 * - Tokenized word-tap reader
 * - Slow mode + Sentence mode toggles
 * - Save word (long-press or tap active word + ⭐ button)
 * - Speaking indicator
 * - Comprehension Q&A tab
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { STORIES, tokenizeText, cleanWordForSpeech, type Story } from '@/lib/stories';
import { speak, stopSpeech, isSpeechSupported } from '@/lib/speech';
import { addSavedWord, loadSavedWords } from '@/lib/savedWords';
import { getWordIllustration } from '@/lib/wordIllustrations';
import { playWordTapSound, playSentenceReadSound } from '@/lib/sounds';
import WordToken from '@/components/WordToken';
import SpeakingIndicator from '@/components/SpeakingIndicator';
import SaveWordToast from '@/components/SaveWordToast';
import StorySelector from './StorySelector';
import type { StoryStars } from './StorySelector';
import ReadingControls from './ReadingControls';
import ComprehensionQuestions from './ComprehensionQuestions';
import FillInTheBlanks from './FillInTheBlanks';
import WordMatchGame from './WordMatchGame';
import RhymeMatchGame from './RhymeMatchGame';
import OppositeWordsGame from './OppositeWordsGame';
import NounVerbAdjectiveSortGame from './NounVerbAdjectiveSortGame';
import { getSelectedChild, setSelectedChild, CHILD_NAMES, type ChildName, CLASS_ALLOWED_LEVELS } from '@/lib/childProfile';
import { loadParentSettings, getChildClassFromSettings } from '@/app/parent/components/SettingsPanel';
import { getQuizResultsAsync } from '@/lib/quizResults';
import { getFillInBlanksResultsAsync } from '@/lib/fillInBlanksResults';
import { getWordMatchResultsAsync } from '@/lib/wordMatchResults';
import { getOppositeWordsResultsAsync } from '@/lib/oppositeWordsResults';



type Tab = 'read' | 'questions' | 'fill-blanks' | 'word-match' | 'rhyme-match' | 'opposites' | 'sort';

export default function StoryReadingContent() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [allStories, setAllStories] = useState<Story[]>(STORIES);
  const [selectedChild, setSelectedChildState] = useState<ChildName | null>(null);
  const [storyStars, setStoryStars] = useState<Record<string, StoryStars>>({});
  const [activeTab, setActiveTab] = useState<Tab>('read');
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [activeWordIndex, setActiveWordIndex] = useState<{ s: number; w: number } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [slowMode, setSlowMode] = useState(false);
  const [sentenceMode, setSentenceMode] = useState(false);
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());
  const [toastWord, setToastWord] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [childSettings, setChildSettings] = useState<Record<string, import('@/app/parent/components/SettingsPanel').ChildProfileData>>({
    Kitty: { name: 'Kitty', emoji: '🐱', photoUrl: null, class: 4 },
    Karawa: { name: 'Karawa', emoji: '🦊', photoUrl: null, class: 5 },
    Zech: { name: 'Zech', emoji: '🦁', photoUrl: null, class: 3 },
  });
  const [isMounted, setIsMounted] = useState(false);

  // After hydration, load real settings from localStorage
  useEffect(() => {
    setIsMounted(true);
    setChildSettings(loadParentSettings().children);
    const words = loadSavedWords();
    setSavedWords(new Set(words.map((w) => w.word.toLowerCase())));
  }, []);

  // Load AI-generated stories from localStorage
  useEffect(() => {
    const loadAIStories = () => {
      try {
        const aiStories: Story[] = JSON.parse(localStorage.getItem('ai_generated_stories') || '[]');
        if (aiStories.length > 0) {
          setAllStories([...STORIES, ...aiStories]);
        } else {
          setAllStories(STORIES);
        }
      } catch {
        setAllStories(STORIES);
      }
    };
    loadAIStories();
    // Listen for storage changes (when parent adds a story)
    window.addEventListener('storage', loadAIStories);
    return () => window.removeEventListener('storage', loadAIStories);
  }, []);

  // Reload child settings when they change
  useEffect(() => {
    const handleSettingsChange = () => {
      setChildSettings(loadParentSettings().children);
    };
    window.addEventListener('kitty_settings_changed', handleSettingsChange);
    return () => window.removeEventListener('kitty_settings_changed', handleSettingsChange);
  }, []);

  // Helper to get child avatar (photo or emoji) from settings
  const getChildAvatar = (name: string) => {
    const child = childSettings[name];
    if (!child) return null;
    return child.photoUrl || null;
  };

  const getChildEmoji = (name: string) => {
    const child = childSettings[name];
    return child?.emoji || '👤';
  };

  const getChildDisplayName = (name: string) => {
    const child = childSettings[name];
    return child?.name || name;
  };

  // Sentence-mode: track which sentence is active
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number | null>(null);
  const sentenceTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sentenceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [illustrationTop, setIllustrationTop] = useState<number>(0);
  const storyContainerRef = useRef<HTMLDivElement | null>(null);

  const tokenizedStory = selectedStory ? tokenizeText(selectedStory.text) : [];

  // ── Speak a single word ───────────────────────────────────
  const handleWordTap = useCallback(
    (word: string, sentenceIdx: number, wordIdx: number) => {
      const clean = cleanWordForSpeech(word);
      if (!clean) return;
      playWordTapSound();
      setActiveWord(clean);
      setActiveWordIndex({ s: sentenceIdx, w: wordIdx });
      setIsSpeaking(true);
      speak(clean, {
        rate: slowMode ? 0.6 : 1.0,
        onEnd: () => {
          setIsSpeaking(false);
          setActiveWord(null);
          setActiveWordIndex(null);
        },
        onError: () => {
          setIsSpeaking(false);
          setActiveWord(null);
          setActiveWordIndex(null);
        },
      });
    },
    [slowMode]
  );

  // ── Save word to practice list ────────────────────────────
  const handleSaveWord = useCallback(
    (word: string) => {
      const updated = addSavedWord(word, 'story', selectedStory?.title);
      setSavedWords(new Set(updated.map((w) => w.word.toLowerCase())));
      setToastWord(word);
      setToastVisible(false);
      // Force re-trigger by toggling off/on
      setTimeout(() => setToastVisible(true), 50);
    },
    [selectedStory]
  );

  // ── Sentence read-aloud mode ──────────────────────────────
  const handleSentenceRead = useCallback(
    (sentenceIdx: number) => {
      if (!selectedStory) return;
      // Clear any existing timeouts
      sentenceTimeouts.current.forEach(clearTimeout);
      sentenceTimeouts.current = [];
      stopSpeech();
      playSentenceReadSound();
      const sentence = tokenizedStory[sentenceIdx]?.join(' ') ?? '';
      setActiveSentenceIdx(sentenceIdx);
      setIsSpeaking(true);
      speak(sentence, {
        rate: slowMode ? 0.55 : 0.85,
        onEnd: () => {
          setIsSpeaking(false);
          setActiveSentenceIdx(null);
        },
        onError: () => {
          setIsSpeaking(false);
          setActiveSentenceIdx(null);
        },
      });
    },
    [selectedStory, tokenizedStory, slowMode]
  );

  // ── Read whole story ──────────────────────────────────────
  const handleReadAll = useCallback(() => {
    if (!selectedStory) return;
    stopSpeech();
    setIsSpeaking(true);

    const sentences = tokenizedStory;
    let currentIdx = 0;

    const readNext = () => {
      if (currentIdx >= sentences.length) {
        setIsSpeaking(false);
        setActiveSentenceIdx(null);
        return;
      }
      const idx = currentIdx;
      setActiveSentenceIdx(idx);
      const sentence = sentences[idx].join(' ');
      speak(sentence, {
        rate: slowMode ? 0.55 : 0.85,
        onEnd: () => {
          currentIdx++;
          readNext();
        },
        onError: () => {
          setIsSpeaking(false);
          setActiveSentenceIdx(null);
        },
      });
    };

    readNext();
  }, [selectedStory, tokenizedStory, slowMode]);

  // ── Stop speech ───────────────────────────────────────────
  const handleStop = useCallback(() => {
    stopSpeech();
    setIsSpeaking(false);
    setActiveWord(null);
    setActiveWordIndex(null);
    setActiveSentenceIdx(null);
  }, []);

  // Reset state when story changes
  useEffect(() => {
    handleStop();
    setActiveTab('read');
  }, [selectedStory, handleStop]);

  useEffect(() => {
    setSpeechSupported(isSpeechSupported);
    // Restore previously selected child
    const saved = getSelectedChild();
    if (saved) setSelectedChildState(saved);
  }, []);

  // Fetch results and compute star badges whenever selected child changes
  useEffect(() => {
    if (!selectedChild) {
      setStoryStars({});
      return;
    }
    async function computeStars() {
      const [quizResults, fillResults, wordResults, oppositeResults] = await Promise.all([
        getQuizResultsAsync(),
        getFillInBlanksResultsAsync(),
        getWordMatchResultsAsync(),
        getOppositeWordsResultsAsync(),
      ]);

      const stars: Record<string, StoryStars> = {};

      // Questions: perfect = score === total (and total > 0), filtered by child
      quizResults
        .filter((r) => r.childName === selectedChild && r.total > 0 && r.score === r.total)
        .forEach((r) => {
          if (!stars[r.storyTitle]) stars[r.storyTitle] = { questions: false, fillBlanks: false, wordMatch: false };
          stars[r.storyTitle].questions = true;
        });

      // Fill in the Blanks: perfect = score === total
      fillResults
        .filter((r) => r.childName === selectedChild && r.total > 0 && r.score === r.total)
        .forEach((r) => {
          if (!stars[r.storyTitle]) stars[r.storyTitle] = { questions: false, fillBlanks: false, wordMatch: false };
          stars[r.storyTitle].fillBlanks = true;
        });

      // Word Match: perfect = score === total
      wordResults
        .filter((r) => r.childName === selectedChild && r.total > 0 && r.score === r.total)
        .forEach((r) => {
          if (!stars[r.storyTitle]) stars[r.storyTitle] = { questions: false, fillBlanks: false, wordMatch: false };
          stars[r.storyTitle].wordMatch = true;
        });

      // Opposites: perfect = score === total
      oppositeResults
        .filter((r) => r.childName === selectedChild && r.total > 0 && r.score === r.total)
        .forEach((r) => {
          if (!stars[r.storyTitle]) stars[r.storyTitle] = { questions: false, fillBlanks: false, wordMatch: false };
          stars[r.storyTitle].wordMatch = stars[r.storyTitle].wordMatch || true;
        });

      setStoryStars(stars);
    }
    computeStars();
  }, [selectedChild]);

  const handleSelectChild = (name: ChildName) => {
    setSelectedChild(name);
    setSelectedChildState(name);
  };

  // Update illustration position when active sentence changes
  useEffect(() => {
    if (activeSentenceIdx === null) return;
    const el = sentenceRefs.current[activeSentenceIdx];
    const container = storyContainerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIllustrationTop(elRect.top - containerRect.top + container.scrollTop);
    }
  }, [activeSentenceIdx]);

  // ── Render story selector ─────────────────────────────────
  if (!selectedStory) {
    // Filtered stories based on child's class (auto-detected from parent settings)
    const childClass = selectedChild ? getChildClassFromSettings(selectedChild) : null;
    const filteredStories = selectedChild && childClass
      ? allStories.filter((s) => CLASS_ALLOWED_LEVELS[childClass].includes(s.level))
      : allStories;

    return (
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 animate-float inline-block">📚</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800 mb-2">
            Pick a Story!
          </h1>
          <p className="text-xl text-purple-500 font-semibold">
            Tap a story to start reading 👇
          </p>
        </div>

        {/* ── Child Selector ─────────────────────────────────── */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-sm p-5">
            <p className="text-center text-lg font-extrabold text-purple-700 mb-4">
              👋 Who is reading today?
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {CHILD_NAMES.map((name) => {
                const colors: Record<string, string> = {
                  Kitty: selectedChild === name
                    ? 'bg-pink-500 text-white border-pink-500 shadow-lg scale-105'
                    : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
                  Karawa: selectedChild === name
                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg scale-105'
                    : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
                  Zech: selectedChild === name
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg scale-105'
                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
                };
                const avatarUrl = getChildAvatar(name);
                const emoji = getChildEmoji(name);
                const displayName = getChildDisplayName(name);
                return (
                  <button
                    key={name}
                    onClick={() => handleSelectChild(name)}
                    className={`flex flex-col items-center gap-2 px-8 py-4 rounded-2xl border-2 font-extrabold text-lg transition-all active:scale-95 ${colors[name]}`}
                    aria-label={`Select ${displayName}`}
                    aria-pressed={selectedChild === name}
                  >
                    <span className="text-4xl">
                      {isMounted && avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <span>{emoji}</span>
                      )}
                    </span>
                    <span>{displayName}</span>
                    {selectedChild === name && (
                      <span className="text-xs font-bold opacity-80">✓ Selected</span>
                    )}
                  </button>
                );
              })}
            </div>
            {!selectedChild && (
              <p className="text-center text-sm text-purple-400 font-semibold mt-3">
                Please select your name to start reading!
              </p>
            )}
          </div>
        </div>

        {/* Story grid — shown immediately after child is selected (class auto-detected) */}
        {selectedChild && childClass ? (
          <>
            <div className="mb-4 flex items-center gap-2 justify-center">
              <span className="px-4 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                📚 Class {childClass} stories for {getChildDisplayName(selectedChild)}
              </span>
            </div>
            <StorySelector stories={filteredStories} onSelect={setSelectedStory} storyStars={storyStars} />
          </>
        ) : !selectedChild ? (
          <div className="flex flex-col items-center justify-center py-12 opacity-40 pointer-events-none select-none">
            <div className="text-6xl mb-3">📖</div>
            <p className="text-xl font-bold text-purple-400">Select your name above to see stories</p>
          </div>
        ) : null}

        {!speechSupported && (
          <div className="mt-6 p-4 bg-yellow-100 border-2 border-yellow-300 rounded-2xl text-center">
            <p className="text-yellow-800 font-bold text-lg">
              ⚠️ Your browser doesn&apos;t support voice reading.
              Try Chrome or Safari for the best experience!
            </p>
          </div>
        )}
      </div>
    );
  }

  // ── Render reading view ───────────────────────────────────
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      {/* Back button + story title */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setSelectedStory(null)}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border-2 border-purple-200 font-bold text-purple-700 text-base hover:bg-purple-50 transition-all active:scale-95"
          aria-label="Go back to story list"
        >
          <span className="text-xl">←</span>
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-4xl">{selectedStory.emoji}</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-purple-800 truncate">
            {selectedStory.title}
          </h1>
          <span
            className={`hidden sm:inline-flex px-3 py-1 rounded-full text-sm font-bold ${selectedStory.levelColor}`}
          >
            {selectedStory.level}
          </span>
        </div>

        {isSpeaking && <SpeakingIndicator isActive={isSpeaking} />}
      </div>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button
          onClick={() => setActiveTab('read')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base transition-all active:scale-95 border-2 ${
            activeTab === 'read' ?'bg-purple-500 text-white border-purple-500 shadow-md' :'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'
          }`}
          aria-label="Read story tab"
        >
          <span>📖</span>
          <span>Read</span>
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base transition-all active:scale-95 border-2 ${
            activeTab === 'questions' ?'bg-orange-400 text-white border-orange-400 shadow-md' :'bg-white text-orange-600 border-orange-200 hover:bg-orange-50'
          }`}
          aria-label="Comprehension questions tab"
        >
          <span>🧠</span>
          <span>Questions</span>
        </button>
        <button
          onClick={() => setActiveTab('fill-blanks')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base transition-all active:scale-95 border-2 ${
            activeTab === 'fill-blanks' ? 'bg-teal-500 text-white border-teal-500 shadow-md' : 'bg-white text-teal-600 border-teal-200 hover:bg-teal-50'
          }`}
          aria-label="Fill in the blanks tab"
        >
          <span>✏️</span>
          <span>Fill Blanks</span>
        </button>
        <button
          onClick={() => setActiveTab('word-match')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base transition-all active:scale-95 border-2 ${
            activeTab === 'word-match' ? 'bg-violet-500 text-white border-violet-500 shadow-md' : 'bg-white text-violet-600 border-violet-200 hover:bg-violet-50'
          }`}
          aria-label="Word match game tab"
        >
          <span>🔤</span>
          <span>Word Match</span>
        </button>
        <button
          onClick={() => setActiveTab('rhyme-match')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base transition-all active:scale-95 border-2 ${
            activeTab === 'rhyme-match' ? 'bg-purple-500 text-white border-purple-500 shadow-md' : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'
          }`}
          aria-label="Rhyme match game tab"
        >
          <span>🎶</span>
          <span>Rhyme Match</span>
        </button>
        <button
          onClick={() => setActiveTab('opposites')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base transition-all active:scale-95 border-2 ${
            activeTab === 'opposites' ? 'bg-amber-400 text-white border-amber-400 shadow-md' : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'
          }`}
          aria-label="Opposite words game tab"
        >
          <span>🔄</span>
          <span>Opposites</span>
        </button>
        <button
          onClick={() => setActiveTab('sort')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-base transition-all active:scale-95 border-2 ${
            activeTab === 'sort' ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
          }`}
          aria-label="Noun verb adjective sort tab"
        >
          <span>🔤</span>
          <span>Sort Words</span>
        </button>
      </div>

      {/* ── Read Tab ─────────────────────────────────────────── */}
      {activeTab === 'read' && (
        <>
          {/* Reading controls */}
          <ReadingControls
            isSpeaking={isSpeaking}
            slowMode={slowMode}
            sentenceMode={sentenceMode}
            onToggleSlowMode={() => setSlowMode((v) => !v)}
            onToggleSentenceMode={() => setSentenceMode((v) => !v)}
            onReadAll={handleReadAll}
            onStop={handleStop}
          />

          {/* Hint bar */}
          <div className="mt-4 mb-5 px-5 py-3 bg-orange-50 border-2 border-orange-200 rounded-2xl">
            <p className="text-orange-700 font-bold text-base md:text-lg text-center">
              {sentenceMode
                ? '👆 Tap the 🔊 button to hear a whole sentence!' :'👆 Tap any word to hear it out loud! Long-press to save ⭐'}
            </p>
          </div>

          {/* Story text — tokenized */}
          <div
            className="bg-white rounded-3xl border-2 border-purple-100 shadow-kitty p-6 md:p-8 relative"
            role="article"
            aria-label={`Story: ${selectedStory.title}`}
            ref={storyContainerRef}
          >
            {/* Illustration panel — floats to the right, slides to active sentence */}
            {selectedStory.sentenceIllustrations && activeSentenceIdx !== null && (
              <div
                className="hidden md:flex absolute right-4 items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-100 to-orange-100 border-3 border-orange-300 shadow-lg text-5xl select-none pointer-events-none z-10"
                style={{
                  top: illustrationTop,
                  transition: 'top 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  border: '3px solid #fb923c',
                }}
                aria-hidden="true"
              >
                <span className="leading-none">
                  {selectedStory.sentenceIllustrations[activeSentenceIdx] ?? selectedStory.emoji}
                </span>
              </div>
            )}

            {/* Mobile inline illustration — shows above active sentence */}
            {selectedStory.sentenceIllustrations && activeSentenceIdx !== null && (
              <div
                className="flex md:hidden justify-center mb-3 animate-bounce-in"
                aria-hidden="true"
              >
                <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-100 to-orange-100 border-3 border-orange-300 shadow-lg text-4xl"
                  style={{ border: '3px solid #fb923c' }}
                >
                  {selectedStory.sentenceIllustrations[activeSentenceIdx] ?? selectedStory.emoji}
                </div>
              </div>
            )}

            {tokenizedStory.map((sentence, sIdx) => (
              <div
                key={sIdx}
                ref={(el) => { sentenceRefs.current[sIdx] = el; }}
                className={`mb-3 flex flex-wrap items-center gap-x-0 gap-y-1 rounded-2xl transition-all duration-300 ${
                  activeSentenceIdx === sIdx ? 'bg-orange-50 px-3 py-2 -mx-3' : ''
                } md:pr-28`}
              >
                {/* Sentence read button (sentence mode) */}
                {sentenceMode && (
                  <button
                    onClick={() => handleSentenceRead(sIdx)}
                    className={`mr-2 flex items-center justify-center w-9 h-9 rounded-full font-bold text-base transition-all active:scale-95
                      ${activeSentenceIdx === sIdx
                        ? 'bg-orange-400 text-white shadow-md'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                      }`}
                    aria-label={`Read sentence ${sIdx + 1} aloud`}
                  >
                    🔊
                  </button>
                )}

                {/* Words */}
                {sentence.map((word, wIdx) => {
                  const clean = cleanWordForSpeech(word);
                  const isActive =
                    activeWordIndex?.s === sIdx && activeWordIndex?.w === wIdx;
                  const isSaved = savedWords.has(clean.toLowerCase());
                  const wordEmoji = isActive ? getWordIllustration(clean) : undefined;

                  return (
                    <span key={`${sIdx}-${wIdx}`} className="relative inline-flex flex-col items-center">
                      {/* Inline illustration bubble above the tapped word */}
                      {wordEmoji && (
                        <span
                          className="absolute -top-10 left-1/2 -translate-x-1/2 text-2xl z-20 pointer-events-none select-none
                            animate-bounce-in bg-white border-2 border-orange-300 rounded-2xl px-2 py-0.5 shadow-md"
                          aria-hidden="true"
                        >
                          {wordEmoji}
                        </span>
                      )}
                      <WordToken
                        word={word}
                        cleanWord={clean}
                        isActive={isActive}
                        isSaved={isSaved}
                        onTap={(w) => handleWordTap(w, sIdx, wIdx)}
                        onLongPress={handleSaveWord}
                      />
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Active word display */}
          {activeWord && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex items-center gap-4 bg-orange-400 text-white px-8 py-5 rounded-3xl shadow-word">
                <span className="text-4xl md:text-5xl font-extrabold tracking-wide">
                  {activeWord}
                </span>
                {/* Word illustration bubble */}
                {getWordIllustration(activeWord) && (
                  <span
                    className="text-5xl md:text-6xl animate-bounce-in select-none"
                    aria-hidden="true"
                    title={`Illustration for: ${activeWord}`}
                  >
                    {getWordIllustration(activeWord)}
                  </span>
                )}
                <SpeakingIndicator isActive={isSpeaking} color="bg-white" />
              </div>
              <button
                onClick={() => handleSaveWord(activeWord)}
                disabled={savedWords.has(activeWord.toLowerCase())}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-base transition-all active:scale-95
                  ${savedWords.has(activeWord.toLowerCase())
                    ? 'bg-purple-100 text-purple-400 cursor-not-allowed border-2 border-purple-200' :'bg-purple-500 text-white hover:bg-purple-600 shadow-md'
                  }`}
              >
                <span>⭐</span>
                <span>
                  {savedWords.has(activeWord.toLowerCase())
                    ? 'Already saved!' :'Save to Practice'}
                </span>
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Questions Tab ─────────────────────────────────────── */}
      {activeTab === 'questions' && (
        <ComprehensionQuestions
          questions={selectedStory.questions}
          storyTitle={selectedStory.title}
          childName={selectedChild ?? undefined}
          slowMode={slowMode}
        />
      )}

      {/* ── Fill in the Blanks Tab ────────────────────────────── */}
      {activeTab === 'fill-blanks' && (
        <FillInTheBlanks story={selectedStory} childName={selectedChild ?? undefined} slowMode={slowMode} />
      )}

      {/* ── Word Match Tab ────────────────────────────────────── */}
      {activeTab === 'word-match' && (
        <WordMatchGame story={selectedStory} childName={selectedChild ?? undefined} slowMode={slowMode} />
      )}

      {/* ── Rhyme Match Tab ────────────────────────────────────── */}
      {activeTab === 'rhyme-match' && (
        <RhymeMatchGame story={selectedStory} childName={selectedChild ?? undefined} slowMode={slowMode} />
      )}

      {/* ── Opposite Words Tab ────────────────────────────────── */}
      {activeTab === 'opposites' && (
        <OppositeWordsGame story={selectedStory} childName={selectedChild ?? undefined} slowMode={slowMode} />
      )}

      {/* ── Noun Verb Adjective Sort Tab ──────────────────────── */}
      {activeTab === 'sort' && (
        <NounVerbAdjectiveSortGame story={selectedStory} childName={selectedChild ?? undefined} slowMode={slowMode} />
      )}

      {/* Save toast */}
      <SaveWordToast word={toastWord} visible={toastVisible} />
    </div>
  );
}