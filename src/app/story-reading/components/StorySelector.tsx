'use client';

// Grid of story cards for the story picker screen

import React from 'react';
import type { Story } from '@/lib/stories';

export interface StoryStars {
  questions: boolean;   // 5/5 on comprehension questions
  fillBlanks: boolean;  // 5/5 on fill in the blanks
  wordMatch: boolean;   // all correct on word match
}

interface StorySelectorProps {
  stories: Story[];
  onSelect: (story: Story) => void;
  storyStars?: Record<string, StoryStars>; // keyed by story.title
}

export default function StorySelector({ stories, onSelect, storyStars = {} }: StorySelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {stories.map((story) => {
        const stars = storyStars[story.title];
        const starList = stars
          ? [
              { earned: stars.questions, label: 'Questions', icon: '⭐' },
              { earned: stars.fillBlanks, label: 'Fill in the Blanks', icon: '⭐' },
              { earned: stars.wordMatch, label: 'Word Match', icon: '⭐' },
            ].filter((s) => s.earned)
          : [];

        return (
          <button
            key={story.id}
            onClick={() => onSelect(story)}
            className="story-card text-left group relative"
            aria-label={`Read ${story.title}`}
          >
            {/* Star badges — top-right corner */}
            {starList.length > 0 && (
              <div className="absolute top-3 right-3 flex gap-1 z-10">
                {starList.map((s, i) => (
                  <span
                    key={i}
                    title={`Perfect score: ${s.label}`}
                    className="text-xl drop-shadow-md animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1.2s' }}
                    role="img"
                    aria-label={`Star for perfect ${s.label}`}
                  >
                    {s.icon}
                  </span>
                ))}
              </div>
            )}

            {/* Emoji cover */}
            <div
              className={`w-full flex items-center justify-center rounded-2xl mb-4 py-6 ${story.color} group-hover:scale-105 transition-transform duration-200`}
            >
              <span className="text-7xl" role="img" aria-hidden="true">
                {story.emoji}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl font-extrabold text-purple-800 mb-2 text-center">
              {story.title}
            </h2>

            {/* Level badge */}
            <div className="flex justify-center">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${story.levelColor}`}>
                {story.level}
              </span>
            </div>

            {/* Preview text */}
            <p className="mt-3 text-sm text-purple-400 font-semibold text-center line-clamp-2 px-2">
              {story.text.slice(0, 60)}…
            </p>

            {/* CTA */}
            <div className="mt-4 w-full flex justify-center">
              <span className="btn-primary text-base px-6 py-3 w-full justify-center">
                <span>📖</span> Read Now!
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}