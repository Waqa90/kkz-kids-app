'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@/lib/hooks/useChat';
import { type Story, type Question } from '@/lib/stories';
import toast from 'react-hot-toast';

interface ActivityResult {
  storyTitle: string;
  childName?: string;
  activity: string;
  score: number;
  total: number;
  dateTime: string;
}

interface GenerateStoryProps {
  activityResults: ActivityResult[];
}

const CLASSES = [
  { value: 'Class 3', label: 'Class 3', emoji: '3️⃣', description: 'Ages 8–9' },
  { value: 'Class 4', label: 'Class 4', emoji: '4️⃣', description: 'Ages 9–10' },
  { value: 'Class 5', label: 'Class 5', emoji: '5️⃣', description: 'Ages 10–11' },
];

const LEVELS = [
  { value: 'Easy', label: 'Easy', emoji: '🌱', color: 'bg-green-200 text-green-800', desc: 'Simple words, short sentences' },
  { value: 'Medium', label: 'Medium', emoji: '📖', color: 'bg-yellow-200 text-yellow-800', desc: 'Moderate vocabulary' },
  { value: 'Fun', label: 'Fun', emoji: '🎉', color: 'bg-pink-200 text-pink-800', desc: 'Playful, engaging themes' },
  { value: 'Hard', label: 'Hard', emoji: '🚀', color: 'bg-blue-200 text-blue-800', desc: 'Rich vocabulary, longer text' },
];

function parseGeneratedStory(raw: string, level: string): Omit<Story, 'id'> | null {
  try {
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) || raw.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : raw;
    const parsed = JSON.parse(jsonStr.trim());

    if (!parsed.title || !parsed.text || !Array.isArray(parsed.questions)) return null;

    const levelColorMap: Record<string, string> = {
      Easy: 'bg-green-200 text-green-800',
      Medium: 'bg-yellow-200 text-yellow-800',
      Fun: 'bg-pink-200 text-pink-800',
      Hard: 'bg-blue-200 text-blue-800',
    };
    const colorOptions = ['bg-orange-100', 'bg-blue-100', 'bg-cyan-100', 'bg-purple-100', 'bg-indigo-100', 'bg-teal-100', 'bg-rose-100'];
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];

    return {
      title: parsed.title,
      emoji: parsed.emoji || '📖',
      color: randomColor,
      level: level as Story['level'],
      levelColor: levelColorMap[level] || 'bg-gray-100 text-gray-600',
      text: parsed.text,
      questions: (parsed.questions as any[]).slice(0, 5).map((q: any) => ({
        question: q.question,
        options: [q.options[0], q.options[1], q.options[2]] as [string, string, string],
        correctIndex: (q.correctIndex ?? 0) as 0 | 1 | 2,
      })),
    };
  } catch {
    return null;
  }
}

export default function GenerateStory({ activityResults }: GenerateStoryProps) {
  const [selectedClass, setSelectedClass] = useState<string>('Class 3');
  const [selectedLevel, setSelectedLevel] = useState<string>('Easy');
  const [generatedStory, setGeneratedStory] = useState<(Omit<Story, 'id'> & { id: string }) | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [addedStories, setAddedStories] = useState<string[]>([]);

  const { response, isLoading, error, sendMessage } = useChat('GROQ', 'llama-3.3-70b-versatile', false);

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  useEffect(() => {
    if (response && !isLoading) {
      const parsed = parseGeneratedStory(response, selectedLevel);
      if (parsed) {
        const id = `ai-generated-${Date.now()}`;
        setGeneratedStory({ ...parsed, id });
        setIsAdded(false);
      } else {
        toast.error('Could not parse the generated story. Please try again.');
      }
    }
  }, [response, isLoading, selectedLevel]);

  const handleGenerate = () => {
    const classInfo = CLASSES.find((c) => c.value === selectedClass)!;

    const prompt = `You are a children's reading story generator for a primary school reading app.

Generate a NEW, ORIGINAL reading story for ${classInfo.label} students (${classInfo.description}) at the "${selectedLevel}" difficulty level.

Difficulty guidelines:
- Easy: 8-10 short sentences, simple CVC words, familiar topics (animals, home, school)
- Medium: 10-12 sentences, slightly more complex vocabulary, mild plot
- Fun: 10-12 sentences, playful/funny theme, rhymes or wordplay welcome
- Hard: 12-15 sentences, richer vocabulary, more complex plot, descriptive language

Make the story age-appropriate and engaging for ${classInfo.label} students.

IMPORTANT: Return ONLY valid JSON in this exact format, no extra text:
{
  "title": "Story Title Here",
  "emoji": "🐱",
  "text": "Full story text here as one paragraph...",
  "questions": [
    { "question": "Question 1?", "options": ["Option A", "Option B", "Option C"], "correctIndex": 0 },
    { "question": "Question 2?", "options": ["Option A", "Option B", "Option C"], "correctIndex": 1 },
    { "question": "Question 3?", "options": ["Option A", "Option B", "Option C"], "correctIndex": 2 },
    { "question": "Question 4?", "options": ["Option A", "Option B", "Option C"], "correctIndex": 0 },
    { "question": "Question 5?", "options": ["Option A", "Option B", "Option C"], "correctIndex": 1 }
  ]
}`;

    sendMessage([{ role: 'user', content: prompt }], { temperature: 0.85, max_tokens: 1200 });
    setGeneratedStory(null);
    setIsAdded(false);
  };

  const handleAddToApp = () => {
    if (!generatedStory) return;
    const existing = JSON.parse(localStorage.getItem('ai_generated_stories') || '[]');
    const alreadyExists = existing.some((s: Story) => s.id === generatedStory.id);
    if (!alreadyExists) {
      existing.push(generatedStory);
      localStorage.setItem('ai_generated_stories', JSON.stringify(existing));
    }
    setIsAdded(true);
    setAddedStories((prev) => [...prev, generatedStory.id]);
    toast.success(`"${generatedStory.title}" added to the story library! 🎉`);
  };

  const classInfo = CLASSES.find((c) => c.value === selectedClass)!;

  return (
    <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-sm p-5 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">✨</span>
        <div>
          <h2 className="text-base font-extrabold text-purple-800">Generate New Story</h2>
          <p className="text-xs text-purple-400">AI creates a story tailored for the selected class</p>
        </div>
      </div>

      {/* Class selector */}
      <div className="mb-4">
        <label className="block text-xs font-extrabold text-purple-700 uppercase tracking-wide mb-2">Select Class</label>
        <div className="grid grid-cols-3 gap-2">
          {CLASSES.map((c) => (
            <button
              key={c.value}
              onClick={() => { setSelectedClass(c.value); setGeneratedStory(null); setIsAdded(false); }}
              className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border-2 font-bold text-sm transition-all ${
                selectedClass === c.value
                  ? 'bg-purple-50 border-purple-300 text-purple-800 shadow-sm scale-[1.02]'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{c.emoji}</span>
              <span>{c.label}</span>
              <span className="text-[10px] font-medium text-gray-400">{c.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Level selector */}
      <div className="mb-5">
        <label className="block text-xs font-extrabold text-purple-700 uppercase tracking-wide mb-2">Difficulty Level</label>
        <div className="grid grid-cols-2 gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.value}
              onClick={() => { setSelectedLevel(l.value); setGeneratedStory(null); setIsAdded(false); }}
              className={`flex items-center gap-2 py-2.5 px-3 rounded-2xl border-2 font-bold text-sm transition-all text-left ${
                selectedLevel === l.value
                  ? 'bg-purple-50 border-purple-300 text-purple-800 shadow-sm'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className="text-base">{l.emoji}</span>
              <div>
                <div className="text-xs font-extrabold leading-tight">{l.label}</div>
                <div className="text-[10px] font-medium text-gray-400 leading-tight">{l.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-purple-300 disabled:to-pink-300 text-white font-extrabold text-sm rounded-2xl transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Generating story…
          </>
        ) : (
          <>
            <span>✨</span>
            Generate Story for {classInfo.emoji} {selectedClass}
          </>
        )}
      </button>

      {/* Generated story preview */}
      {generatedStory && !isLoading && (
        <div className="mt-5 rounded-2xl border-2 border-purple-100 bg-purple-50/40 overflow-hidden">
          {/* Story header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-purple-100 bg-white">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{generatedStory.emoji}</span>
              <div>
                <div className="font-extrabold text-purple-900 text-sm">{generatedStory.title}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${generatedStory.levelColor}`}>
                    {generatedStory.level}
                  </span>
                  <span className="text-[10px] text-purple-400 font-semibold">
                    {generatedStory.questions.length} questions
                  </span>
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-400 bg-purple-100 px-2 py-1 rounded-full">AI Generated</span>
          </div>

          {/* Story text */}
          <div className="px-4 py-3">
            <p className="text-sm text-purple-900 leading-relaxed font-medium">{generatedStory.text}</p>
          </div>

          {/* Questions preview */}
          <div className="px-4 pb-3">
            <div className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wide mb-2">Comprehension Questions</div>
            <div className="flex flex-col gap-1.5">
              {generatedStory.questions.map((q, i) => (
                <div key={i} className="text-xs text-purple-700 bg-white rounded-xl px-3 py-2 border border-purple-100 font-medium">
                  <span className="font-extrabold text-purple-400 mr-1">{i + 1}.</span>
                  {q.question}
                </div>
              ))}
            </div>
          </div>

          {/* Add to app button */}
          <div className="px-4 pb-4 pt-1">
            {isAdded ? (
              <div className="flex items-center justify-center gap-2 py-2.5 bg-green-50 border-2 border-green-200 rounded-2xl text-green-700 font-extrabold text-sm">
                <span>✅</span> Added to Story Library!
              </div>
            ) : (
              <button
                onClick={handleAddToApp}
                className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white font-extrabold text-sm rounded-2xl transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
              >
                <span>📚</span> Add to Story Library
              </button>
            )}
          </div>
        </div>
      )}

      {/* Added stories count */}
      {addedStories.length > 0 && (
        <div className="mt-3 text-center text-xs text-purple-500 font-semibold">
          {addedStories.length} AI {addedStories.length === 1 ? 'story' : 'stories'} added to the library this session
        </div>
      )}
    </div>
  );
}
