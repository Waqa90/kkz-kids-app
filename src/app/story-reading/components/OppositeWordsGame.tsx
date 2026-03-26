'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { type Story } from '@/lib/stories';
import { saveOppositeWordsResult } from '@/lib/oppositeWordsResults';
import { speak } from '@/lib/speech';
import { playCorrectSound, playWrongSound, playAchievementSound, playGoodJobSound } from '@/lib/sounds';
import { playCelebrationVoice } from '@/lib/celebrationVoice';

interface OppositePair {
  word: string;
  opposite: string;
  wordEmoji: string;
  oppositeEmoji: string;
}

interface OppositeWordsGameProps {
  story: Story;
  childName?: string;
  slowMode?: boolean;
}

// ── Opposite pairs per story ──────────────────────────────────────────────────
const STORY_OPPOSITE_PAIRS: Record<string, OppositePair[]> = {
  'cat-and-hat': [
    { word: 'happy', opposite: 'sad', wordEmoji: '😄', oppositeEmoji: '😢' },
    { word: 'big', opposite: 'small', wordEmoji: '🐘', oppositeEmoji: '🐭' },
    { word: 'day', opposite: 'night', wordEmoji: '☀️', oppositeEmoji: '🌙' },
    { word: 'on', opposite: 'off', wordEmoji: '💡', oppositeEmoji: '🔦' },
    { word: 'ran', opposite: 'walked', wordEmoji: '🏃', oppositeEmoji: '🚶' },
    { word: 'liked', opposite: 'hated', wordEmoji: '❤️', oppositeEmoji: '💔' },
    { word: 'red', opposite: 'blue', wordEmoji: '🔴', oppositeEmoji: '🔵' },
  ],
  'dog-and-ball': [
    { word: 'fast', opposite: 'slow', wordEmoji: '🏎️', oppositeEmoji: '🐢' },
    { word: 'up', opposite: 'down', wordEmoji: '⬆️', oppositeEmoji: '⬇️' },
    { word: 'good', opposite: 'bad', wordEmoji: '⭐', oppositeEmoji: '💢' },
    { word: 'big', opposite: 'small', wordEmoji: '🐘', oppositeEmoji: '🐭' },
    { word: 'far', opposite: 'near', wordEmoji: '🏔️', oppositeEmoji: '🏠' },
    { word: 'happy', opposite: 'sad', wordEmoji: '😄', oppositeEmoji: '😢' },
    { word: 'ran', opposite: 'stopped', wordEmoji: '🏃', oppositeEmoji: '🛑' },
  ],
  'little-fish': [
    { word: 'little', opposite: 'big', wordEmoji: '🐟', oppositeEmoji: '🐋' },
    { word: 'bright', opposite: 'dark', wordEmoji: '☀️', oppositeEmoji: '🌑' },
    { word: 'found', opposite: 'lost', wordEmoji: '🔍', oppositeEmoji: '❓' },
    { word: 'pretty', opposite: 'ugly', wordEmoji: '🌸', oppositeEmoji: '🥀' },
    { word: 'hidden', opposite: 'visible', wordEmoji: '🕵️', oppositeEmoji: '👁️' },
    { word: 'swam', opposite: 'sank', wordEmoji: '🏊', oppositeEmoji: '⬇️' },
    { word: 'full', opposite: 'empty', wordEmoji: '🪣', oppositeEmoji: '🫙' },
  ],
  'rainy-day': [
    { word: 'rainy', opposite: 'sunny', wordEmoji: '🌧️', oppositeEmoji: '☀️' },
    { word: 'wet', opposite: 'dry', wordEmoji: '💧', oppositeEmoji: '🏜️' },
    { word: 'muddy', opposite: 'clean', wordEmoji: '🟤', oppositeEmoji: '✨' },
    { word: 'happy', opposite: 'sad', wordEmoji: '😄', oppositeEmoji: '😢' },
    { word: 'outside', opposite: 'inside', wordEmoji: '🏡', oppositeEmoji: '🛋️' },
    { word: 'cold', opposite: 'hot', wordEmoji: '🥶', oppositeEmoji: '🥵' },
    { word: 'loud', opposite: 'quiet', wordEmoji: '📢', oppositeEmoji: '🤫' },
  ],
  'stars-at-night': [
    { word: 'night', opposite: 'day', wordEmoji: '🌙', oppositeEmoji: '☀️' },
    { word: 'tiny', opposite: 'huge', wordEmoji: '🐜', oppositeEmoji: '🐘' },
    { word: 'bright', opposite: 'dark', wordEmoji: '💡', oppositeEmoji: '🌑' },
    { word: 'far', opposite: 'near', wordEmoji: '🏔️', oppositeEmoji: '🏠' },
    { word: 'up', opposite: 'down', wordEmoji: '⬆️', oppositeEmoji: '⬇️' },
    { word: 'amazing', opposite: 'boring', wordEmoji: '🤩', oppositeEmoji: '😴' },
    { word: 'old', opposite: 'new', wordEmoji: '🏚️', oppositeEmoji: '🏠' },
  ],
  'big-red-hen': [
    { word: 'big', opposite: 'small', wordEmoji: '🐘', oppositeEmoji: '🐭' },
    { word: 'red', opposite: 'blue', wordEmoji: '🔴', oppositeEmoji: '🔵' },
    { word: 'warm', opposite: 'cold', wordEmoji: '🔥', oppositeEmoji: '❄️' },
    { word: 'cracked', opposite: 'whole', wordEmoji: '🥚', oppositeEmoji: '⭕' },
    { word: 'cosy', opposite: 'uncomfortable', wordEmoji: '🛏️', oppositeEmoji: '🪨' },
    { word: 'happy', opposite: 'sad', wordEmoji: '😄', oppositeEmoji: '😢' },
    { word: 'new', opposite: 'old', wordEmoji: '🆕', oppositeEmoji: '📜' },
  ],
  'little-seed': [
    { word: 'little', opposite: 'big', wordEmoji: '🌱', oppositeEmoji: '🌳' },
    { word: 'down', opposite: 'up', wordEmoji: '⬇️', oppositeEmoji: '⬆️' },
    { word: 'dark', opposite: 'bright', wordEmoji: '🌑', oppositeEmoji: '☀️' },
    { word: 'slow', opposite: 'fast', wordEmoji: '🐢', oppositeEmoji: '🐇' },
    { word: 'proud', opposite: 'ashamed', wordEmoji: '🏆', oppositeEmoji: '😔' },
    { word: 'dry', opposite: 'wet', wordEmoji: '🏜️', oppositeEmoji: '💧' },
    { word: 'hard', opposite: 'soft', wordEmoji: '🪨', oppositeEmoji: '🧸' },
  ],
  'the-lost-sock': [
    { word: 'lost', opposite: 'found', wordEmoji: '❓', oppositeEmoji: '🔍' },
    { word: 'warm', opposite: 'cold', wordEmoji: '🔥', oppositeEmoji: '❄️' },
    { word: 'laughed', opposite: 'cried', wordEmoji: '😂', oppositeEmoji: '😭' },
    { word: 'behind', opposite: 'front', wordEmoji: '🔙', oppositeEmoji: '🔛' },
    { word: 'soft', opposite: 'hard', wordEmoji: '🧸', oppositeEmoji: '🪨' },
    { word: 'happy', opposite: 'sad', wordEmoji: '😄', oppositeEmoji: '😢' },
    { word: 'clean', opposite: 'dirty', wordEmoji: '✨', oppositeEmoji: '🟤' },
  ],
  'the-yellow-bus': [
    { word: 'yellow', opposite: 'purple', wordEmoji: '🟡', oppositeEmoji: '🟣' },
    { word: 'big', opposite: 'small', wordEmoji: '🚌', oppositeEmoji: '🚗' },
    { word: 'fast', opposite: 'slow', wordEmoji: '🏎️', oppositeEmoji: '🐢' },
    { word: 'full', opposite: 'empty', wordEmoji: '🪣', oppositeEmoji: '🫙' },
    { word: 'early', opposite: 'late', wordEmoji: '⏰', oppositeEmoji: '🕰️' },
    { word: 'loud', opposite: 'quiet', wordEmoji: '📢', oppositeEmoji: '🤫' },
    { word: 'happy', opposite: 'sad', wordEmoji: '😄', oppositeEmoji: '😢' },
  ],
  'the-apple-tree': [
    { word: 'sweet', opposite: 'sour', wordEmoji: '🍎', oppositeEmoji: '🍋' },
    { word: 'crunchy', opposite: 'soft', wordEmoji: '🍏', oppositeEmoji: '🧸' },
    { word: 'up', opposite: 'down', wordEmoji: '⬆️', oppositeEmoji: '⬇️' },
    { word: 'big', opposite: 'small', wordEmoji: '🐘', oppositeEmoji: '🐭' },
    { word: 'happy', opposite: 'sad', wordEmoji: '😄', oppositeEmoji: '😢' },
    { word: 'full', opposite: 'empty', wordEmoji: '🪣', oppositeEmoji: '🫙' },
    { word: 'old', opposite: 'new', wordEmoji: '🏚️', oppositeEmoji: '🏠' },
  ],
  'the-little-boat': [
    { word: 'little', opposite: 'big', wordEmoji: '⛵', oppositeEmoji: '🚢' },
    { word: 'floated', opposite: 'sank', wordEmoji: '🏊', oppositeEmoji: '⬇️' },
    { word: 'still', opposite: 'moving', wordEmoji: '🛑', oppositeEmoji: '🏃' },
    { word: 'happy', opposite: 'sad', wordEmoji: '😄', oppositeEmoji: '😢' },
    { word: 'fast', opposite: 'slow', wordEmoji: '🏎️', oppositeEmoji: '🐢' },
    { word: 'wet', opposite: 'dry', wordEmoji: '💧', oppositeEmoji: '🏜️' },
    { word: 'near', opposite: 'far', wordEmoji: '🏠', oppositeEmoji: '🏔️' },
  ],
  'the-sleepy-bear': [
    { word: 'sleepy', opposite: 'awake', wordEmoji: '😴', oppositeEmoji: '👀' },
    { word: 'cosy', opposite: 'cold', wordEmoji: '🛏️', oppositeEmoji: '❄️' },
    { word: 'winter', opposite: 'summer', wordEmoji: '❄️', oppositeEmoji: '☀️' },
    { word: 'dark', opposite: 'bright', wordEmoji: '🌑', oppositeEmoji: '💡' },
    { word: 'big', opposite: 'small', wordEmoji: '🐻', oppositeEmoji: '🐭' },
    { word: 'slow', opposite: 'fast', wordEmoji: '🐢', oppositeEmoji: '🐇' },
    { word: 'happy', opposite: 'sad', wordEmoji: '😄', oppositeEmoji: '😢' },
  ],
  'the-rainbow': [
    { word: 'bright', opposite: 'dark', wordEmoji: '🌈', oppositeEmoji: '🌑' },
    { word: 'wet', opposite: 'dry', wordEmoji: '🌧️', oppositeEmoji: '☀️' },
    { word: 'happy', opposite: 'sad', wordEmoji: '😄', oppositeEmoji: '😢' },
    { word: 'colourful', opposite: 'grey', wordEmoji: '🎨', oppositeEmoji: '🩶' },
    { word: 'high', opposite: 'low', wordEmoji: '⬆️', oppositeEmoji: '⬇️' },
    { word: 'wide', opposite: 'narrow', wordEmoji: '↔️', oppositeEmoji: '↕️' },
    { word: 'beautiful', opposite: 'plain', wordEmoji: '🌸', oppositeEmoji: '🪨' },
  ],
};

// Fallback pairs using common opposites
function buildFallbackPairs(story: Story): OppositePair[] {
  const defaults: OppositePair[] = [
    { word: 'big', opposite: 'small', wordEmoji: '🐘', oppositeEmoji: '🐭' },
    { word: 'fast', opposite: 'slow', wordEmoji: '🏎️', oppositeEmoji: '🐢' },
    { word: 'hot', opposite: 'cold', wordEmoji: '🔥', oppositeEmoji: '❄️' },
    { word: 'day', opposite: 'night', wordEmoji: '☀️', oppositeEmoji: '🌙' },
    { word: 'happy', opposite: 'sad', wordEmoji: '😄', oppositeEmoji: '😢' },
    { word: 'up', opposite: 'down', wordEmoji: '⬆️', oppositeEmoji: '⬇️' },
    { word: 'full', opposite: 'empty', wordEmoji: '🪣', oppositeEmoji: '🫙' },
  ];
  return defaults;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function OppositeWordsGame({ story, childName, slowMode }: OppositeWordsGameProps) {
  const pairs: OppositePair[] = useMemo(
    () => STORY_OPPOSITE_PAIRS[story.id] ?? buildFallbackPairs(story),
    [story.id]
  );

  // Left side: words in fixed order; Right side: opposites shuffled
  const [rightItems, setRightItems] = useState<OppositePair[]>([]);
  // matches: leftIndex → rightIndex
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [saved, setSaved] = useState(false);
  const [speakingLeft, setSpeakingLeft] = useState<number | null>(null);
  const [speakingRight, setSpeakingRight] = useState<number | null>(null);
  const [correctPairs, setCorrectPairs] = useState<Set<number>>(new Set());
  const [wrongPairs, setWrongPairs] = useState<Set<number>>(new Set());

  // SVG arrow drawing
  const svgRef = useRef<SVGSVGElement>(null);
  const leftRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [arrows, setArrows] = useState<{ x1: number; y1: number; x2: number; y2: number; leftIdx: number }[]>([]);

  const init = useCallback(() => {
    setRightItems(shuffle(pairs));
    setMatches({});
    setSelectedLeft(null);
    setSubmitted(false);
    setScore(0);
    setCorrectPairs(new Set());
    setWrongPairs(new Set());
    setSaved(false);
    setArrows([]);
  }, [pairs]);

  useEffect(() => { init(); }, [init]);

  // Recompute arrow positions whenever matches change
  useEffect(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newArrows = Object.entries(matches).map(([leftIdxStr, rightIdx]) => {
      const leftIdx = parseInt(leftIdxStr);
      const leftEl = leftRefs.current[leftIdx];
      const rightEl = rightRefs.current[rightIdx];
      if (!leftEl || !rightEl) return null;
      const lRect = leftEl.getBoundingClientRect();
      const rRect = rightEl.getBoundingClientRect();
      return {
        leftIdx,
        x1: lRect.right - containerRect.left,
        y1: lRect.top + lRect.height / 2 - containerRect.top,
        x2: rRect.left - containerRect.left,
        y2: rRect.top + rRect.height / 2 - containerRect.top,
      };
    }).filter(Boolean) as { x1: number; y1: number; x2: number; y2: number; leftIdx: number }[];
    setArrows(newArrows);
  }, [matches]);

  const handleSpeakLeft = (idx: number) => {
    setSpeakingLeft(idx);
    speak(pairs[idx].word, {
      rate: slowMode ? 0.6 : 1.0,
      onEnd: () => setSpeakingLeft(null),
      onError: () => setSpeakingLeft(null),
    });
  };

  const handleSpeakRight = (idx: number) => {
    setSpeakingRight(idx);
    speak(rightItems[idx].opposite, {
      rate: slowMode ? 0.6 : 1.0,
      onEnd: () => setSpeakingRight(null),
      onError: () => setSpeakingRight(null),
    });
  };

  const handleLeftClick = (idx: number) => {
    if (submitted) return;
    if (selectedLeft === idx) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(idx);
    }
  };

  const handleRightClick = (rightIdx: number) => {
    if (submitted) return;
    if (selectedLeft === null) return;

    // Remove any existing match for this left item
    const newMatches = { ...matches };
    // Also remove if this right item was already matched to another left
    Object.keys(newMatches).forEach((k) => {
      if (newMatches[parseInt(k)] === rightIdx) delete newMatches[parseInt(k)];
    });
    newMatches[selectedLeft] = rightIdx;
    setMatches(newMatches);
    setSelectedLeft(null);
  };

  const handleSubmit = async () => {
    if (submitted) return;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let correct = 0;
    const correctSet = new Set<number>();
    const wrongSet = new Set<number>();

    pairs.forEach((pair, leftIdx) => {
      const matchedRightIdx = matches[leftIdx];
      if (matchedRightIdx === undefined) return;
      const matchedRight = rightItems[matchedRightIdx];
      if (matchedRight.opposite === pair.opposite) {
        correct++;
        correctSet.add(leftIdx);
        playCorrectSound();
      } else {
        wrongSet.add(leftIdx);
        playWrongSound();
      }
    });

    setScore(correct);
    setCorrectPairs(correctSet);
    setWrongPairs(wrongSet);
    setSubmitted(true);

    const total = pairs.length;
    if (correct === total) {
      playAchievementSound();
      setTimeout(() => playCelebrationVoice(childName, correct, total, 'word-match'), 600);
    } else {
      playGoodJobSound();
    }

    if (!saved) {
      setSaved(true);
      await saveOppositeWordsResult({
        storyTitle: story.title,
        childName,
        score: correct,
        total,
        attempts: newAttempts,
      });
    }
  };

  const allMatched = Object.keys(matches).length === pairs.length;
  const pct = pairs.length > 0 ? Math.round((score / pairs.length) * 100) : 0;

  // Arrow color based on result
  const getArrowColor = (leftIdx: number) => {
    if (!submitted) return '#8b5cf6';
    if (correctPairs.has(leftIdx)) return '#22c55e';
    if (wrongPairs.has(leftIdx)) return '#ef4444';
    return '#8b5cf6';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl p-4 text-white text-center shadow-md">
        <div className="text-3xl mb-1">🔄</div>
        <h2 className="text-xl font-extrabold">Opposite Words!</h2>
        <p className="text-sm font-semibold opacity-90 mt-0.5">
          Tap a word on the left, then tap its opposite on the right to draw an arrow!
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl px-4 py-3 text-center">
        <p className="text-amber-800 font-bold text-sm">
          {selectedLeft !== null
            ? `✅ Now tap the opposite of "${pairs[selectedLeft].word}" on the right!`
            : '👆 Tap a word on the LEFT to select it, then tap its opposite on the RIGHT'}
        </p>
      </div>

      {/* Game area */}
      <div
        ref={containerRef}
        className="relative bg-white rounded-3xl border-2 border-purple-100 shadow-sm p-4"
        style={{ minHeight: 420 }}
      >
        {/* SVG overlay for arrows */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
            </marker>
            <marker id="arrowhead-correct" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
            </marker>
            <marker id="arrowhead-wrong" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
            </marker>
          </defs>
          {arrows.map((arrow) => {
            const color = getArrowColor(arrow.leftIdx);
            const markerId = !submitted ? 'arrowhead' : correctPairs.has(arrow.leftIdx) ? 'arrowhead-correct' : wrongPairs.has(arrow.leftIdx) ? 'arrowhead-wrong' : 'arrowhead';
            return (
              <line
                key={arrow.leftIdx}
                x1={arrow.x1}
                y1={arrow.y1}
                x2={arrow.x2}
                y2={arrow.y2}
                stroke={color}
                strokeWidth="2.5"
                strokeDasharray={submitted ? 'none' : '6 3'}
                markerEnd={`url(#${markerId})`}
              />
            );
          })}
        </svg>

        <div className="flex gap-2">
          {/* Left column — words */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-center text-xs font-extrabold text-purple-600 uppercase tracking-wide mb-1">Words</div>
            {pairs.map((pair, idx) => {
              const isSelected = selectedLeft === idx;
              const isMatched = matches[idx] !== undefined;
              const isCorrect = submitted && correctPairs.has(idx);
              const isWrong = submitted && wrongPairs.has(idx);

              return (
                <div
                  key={idx}
                  ref={(el) => { leftRefs.current[idx] = el; }}
                  onClick={() => handleLeftClick(idx)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border-2 cursor-pointer transition-colors select-none
                    ${isSelected ? 'bg-amber-400 border-amber-500 text-white shadow-md' :
                      isCorrect ? 'bg-green-100 border-green-400 text-green-800': isWrong ?'bg-red-100 border-red-400 text-red-800': isMatched ?'bg-purple-100 border-purple-400 text-purple-800': 'bg-white border-purple-200 text-purple-800 hover:bg-purple-50 hover:border-purple-400'
                    }`}
                >
                  <span className="text-xl">{pair.wordEmoji}</span>
                  <span className="font-extrabold text-sm flex-1">{pair.word}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSpeakLeft(idx); }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all flex-shrink-0
                      ${speakingLeft === idx ? 'bg-orange-400 text-white animate-pulse' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
                    aria-label={`Hear word: ${pair.word}`}
                  >
                    🔊
                  </button>
                  {/* Dot connector */}
                  <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${isMatched ? 'bg-purple-500 border-purple-500' : 'bg-white border-purple-300'}`} />
                </div>
              );
            })}
          </div>

          {/* Spacer for arrows */}
          <div className="w-8 flex-shrink-0" />

          {/* Right column — opposites (shuffled) */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-center text-xs font-extrabold text-orange-600 uppercase tracking-wide mb-1">Opposites</div>
            {rightItems.map((item, rightIdx) => {
              // Check if this right item is matched
              const matchedLeftIdx = Object.entries(matches).find(([, ri]) => ri === rightIdx)?.[0];
              const isMatchedRight = matchedLeftIdx !== undefined;
              const leftIdx = matchedLeftIdx !== undefined ? parseInt(matchedLeftIdx) : -1;
              const isCorrectRight = submitted && leftIdx >= 0 && correctPairs.has(leftIdx);
              const isWrongRight = submitted && leftIdx >= 0 && wrongPairs.has(leftIdx);

              return (
                <div
                  key={rightIdx}
                  ref={(el) => { rightRefs.current[rightIdx] = el; }}
                  onClick={() => handleRightClick(rightIdx)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border-2 cursor-pointer transition-colors select-none
                    ${selectedLeft !== null && !submitted ? 'hover:bg-amber-50 hover:border-amber-400' : ''}
                    ${isCorrectRight ? 'bg-green-100 border-green-400 text-green-800': isWrongRight ?'bg-red-100 border-red-400 text-red-800': isMatchedRight ?'bg-purple-100 border-purple-400 text-purple-800': 'bg-white border-orange-200 text-orange-800'
                    }`}
                >
                  {/* Dot connector */}
                  <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${isMatchedRight ? 'bg-purple-500 border-purple-500' : 'bg-white border-orange-300'}`} />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSpeakRight(rightIdx); }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all flex-shrink-0
                      ${speakingRight === rightIdx ? 'bg-orange-400 text-white animate-pulse' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
                    aria-label={`Hear word: ${item.opposite}`}
                  >
                    🔊
                  </button>
                  <span className="font-extrabold text-sm flex-1 text-right">{item.opposite}</span>
                  <span className="text-xl">{item.oppositeEmoji}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit / Result */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allMatched}
          className={`w-full py-4 rounded-2xl font-extrabold text-lg transition-all active:scale-95 shadow-md
            ${allMatched
              ? 'bg-amber-400 hover:bg-amber-500 text-white' :'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
            }`}
        >
          {allMatched ? '✅ Check My Answers!' : `Match all ${pairs.length} pairs to continue (${Object.keys(matches).length}/${pairs.length})`}
        </button>
      ) : (
        <div className="space-y-3">
          {/* Score card */}
          <div className={`rounded-3xl p-5 text-center border-2 ${
            pct === 100 ? 'bg-green-50 border-green-300' :
            pct >= 60 ? 'bg-yellow-50 border-yellow-300': 'bg-red-50 border-red-300'
          }`}>
            <div className="text-4xl mb-2">
              {pct === 100 ? '🏆' : pct >= 60 ? '⭐' : '💪'}
            </div>
            <div className={`text-3xl font-extrabold mb-1 ${
              pct === 100 ? 'text-green-700' : pct >= 60 ? 'text-yellow-700' : 'text-red-700'
            }`}>
              {score}/{pairs.length}
            </div>
            <div className="text-base font-bold text-purple-700">
              {pct === 100
                ? '🎉 Perfect! You know all the opposites!'
                : pct >= 60
                ? '⭐ Great job! Keep practising!' :'💪 Good try! Let\'s try again!'}
            </div>
            <div className="text-sm text-purple-500 mt-1">Attempt #{attempts}</div>
          </div>

          {/* Answer key */}
          <div className="bg-white rounded-2xl border-2 border-purple-100 p-4">
            <p className="text-xs font-extrabold text-purple-700 uppercase tracking-wide mb-3">Answer Key</p>
            <div className="grid grid-cols-2 gap-2">
              {pairs.map((pair, idx) => (
                <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold
                  ${correctPairs.has(idx) ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <span>{pair.wordEmoji}</span>
                  <span>{pair.word}</span>
                  <span className="text-purple-400">→</span>
                  <span>{pair.oppositeEmoji}</span>
                  <span>{pair.opposite}</span>
                  <span className="ml-auto">{correctPairs.has(idx) ? '✅' : '❌'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Try again */}
          <button
            onClick={init}
            className="w-full py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-extrabold text-base transition-all active:scale-95 shadow-md"
          >
            🔄 Try Again
          </button>
        </div>
      )}
    </div>
  );
}
