'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@/lib/hooks/useChat';
import toast from 'react-hot-toast';
import { loadParentSettings, type ParentSettings } from './SettingsPanel';

// Unified activity result shape (all activities share these fields)
export interface ActivityResult {
  id: string;
  storyTitle: string;
  childName?: string;
  activity: 'Questions' | 'Fill in the Blanks' | 'Word Match' | 'Rhyme Match' | 'Opposites' | 'Word Sort' | 'Maths' | 'Subject';
  score: number;
  total: number;
  attempts?: number;
  dateTime: string;
}

interface AIRecommendationsProps {
  results: ActivityResult[];
}

const CHILD_COLORS: Record<string, { color: string; btnColor: string }> = {
  Kitty:  { color: 'bg-pink-50 border-pink-200',   btnColor: 'bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300' },
  Karawa: { color: 'bg-orange-50 border-orange-200', btnColor: 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300' },
  Zech:   { color: 'bg-blue-50 border-blue-200',   btnColor: 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300' },
};

const ACTIVITY_LABELS: Record<string, string> = {
  'Questions': '❓ Questions',
  'Fill in the Blanks': '✏️ Fill in the Blanks',
  'Word Match': '🔤 Word Match',
  'Rhyme Match': '🎵 Rhyme Match',
  'Opposites': '🔄 Opposites',
  'Word Sort': '🔤 Word Sort',
  'Maths': '🔢 Maths',
  'Subject': '📚 Subject Activity',
};

interface ChildPanelProps {
  childName: string;
  displayName: string;
  emoji: string;
  photoUrl: string | null;
  results: ActivityResult[];
}

function buildActivitySummary(results: ActivityResult[]): string {
  const activities: Record<string, ActivityResult[]> = {
    'Questions': [],
    'Fill in the Blanks': [],
    'Word Match': [],
    'Rhyme Match': [],
    'Opposites': [],
    'Word Sort': [],
    'Maths': [],
    'Subject': [],
  };

  results.forEach((r) => {
    if (activities[r.activity]) activities[r.activity].push(r);
  });

  const lines: string[] = [];

  Object.entries(activities).forEach(([activityName, actResults]) => {
    if (actResults.length === 0) return;
    const avg = Math.round(
      (actResults.reduce((sum, r) => sum + (r.total > 0 ? r.score / r.total : 0), 0) / actResults.length) * 100
    );
    const perfect = actResults.filter((r) => r.total > 0 && r.score === r.total).length;
    const recent = actResults.slice(0, 3).map((r) => {
      const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
      return `"${r.storyTitle}" ${r.score}/${r.total} (${pct}%)`;
    }).join(', ');
    lines.push(`  ${ACTIVITY_LABELS[activityName]}: ${actResults.length} attempt${actResults.length !== 1 ? 's' : ''}, avg ${avg}%, ${perfect} perfect. Recent: ${recent}`);
  });

  return lines.join('\n');
}

function ChildPanel({ childName, displayName, emoji, photoUrl, results }: ChildPanelProps) {
  const [recommendation, setRecommendation] = useState<string>('');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const colors = CHILD_COLORS[childName] ?? { color: 'bg-purple-50 border-purple-200', btnColor: 'bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300' };

  const { response, isLoading, error, sendMessage } = useChat(
    'GROQ',
    'llama-3.3-70b-versatile',
    false
  );

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  useEffect(() => {
    if (response && !isLoading) {
      setRecommendation(response);
    }
  }, [response, isLoading]);

  const analyzePerformance = () => {
    if (results.length === 0) return;

    const totalAttempts = results.length;
    const overallAvg = Math.round(
      (results.reduce((sum, r) => sum + (r.total > 0 ? r.score / r.total : 0), 0) / results.length) * 100
    );
    const perfectCount = results.filter((r) => r.total > 0 && r.score === r.total).length;

    const activitySummary = buildActivitySummary(results);

    // Identify strongest and weakest activities
    const activityAvgs: { name: string; avg: number; count: number }[] = [];
    ['Questions', 'Fill in the Blanks', 'Word Match', 'Rhyme Match', 'Opposites', 'Word Sort', 'Maths', 'Subject'].forEach((act) => {
      const actResults = results.filter((r) => r.activity === act);
      if (actResults.length > 0) {
        const avg = Math.round(
          (actResults.reduce((sum, r) => sum + (r.total > 0 ? r.score / r.total : 0), 0) / actResults.length) * 100
        );
        activityAvgs.push({ name: act, avg, count: actResults.length });
      }
    });
    activityAvgs.sort((a, b) => b.avg - a.avg);
    const strongest = activityAvgs[0];
    const weakest = activityAvgs[activityAvgs.length - 1];

    const messages = [
      {
        role: 'system',
        content: `You are a friendly and encouraging children's learning coach helping a parent understand their child ${displayName}'s overall academic progress.
${displayName} is a young learner using a multi-subject learning app covering: English reading (Questions, Fill in the Blanks, Word Match, Rhyme Match, Opposites, Word Sort), Maths (addition, subtraction, multiplication, division, word problems), and other subjects (Science, Social Studies, Healthy Living, MCE, Fijian language).
Your job is to analyse performance across ALL subjects and activities and give warm, actionable recommendations covering their overall academic progress — not just reading.
Keep your response concise (4-6 sentences max), positive, and easy for a parent to understand.
Format your response with:
1. A brief overall performance summary across all activities (1-2 sentences)
2. Highlight the strongest activity and the one needing most improvement (1-2 sentences)
3. A clear recommendation for what to focus on next (1-2 sentences)
4. One specific encouragement tip for ${displayName} (1 sentence)
Use simple language and include 1-2 relevant emojis to keep it friendly.`,
      },
      {
        role: 'user',
        content: `Please analyse ${displayName}'s learning performance across all subjects and activities and suggest what they should focus on next.

Overall stats:
- Total activity attempts: ${totalAttempts}
- Overall average score: ${overallAvg}%
- Perfect scores: ${perfectCount} out of ${totalAttempts}
${strongest ? `- Strongest activity: ${strongest.name} (avg ${strongest.avg}%)` : ''}
${weakest && weakest !== strongest ? `- Activity needing most practice: ${weakest.name} (avg ${weakest.avg}%)` : ''}

Breakdown by all subjects and activities:
${activitySummary}

Based on this data, what should ${displayName} focus on to improve across all subjects, and do you have any personalised recommendations?`,
      },
    ];

    setHasAnalyzed(true);
    setRecommendation('');
    sendMessage(messages, {
      temperature: 0.7,
      max_tokens: 350,
    });
  };

  return (
    <div className={`rounded-2xl border-2 p-4 ${colors.color}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <span className="text-2xl">{emoji}</span>
          )}
          <div>
            <h3 className="text-sm font-extrabold text-purple-800">{displayName}</h3>
            <p className="text-xs text-purple-400">{results.length} activity attempt{results.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button
          onClick={analyzePerformance}
          disabled={isLoading || results.length === 0}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-extrabold rounded-xl transition-all active:scale-95 shadow-sm ${colors.btnColor}`}
        >
          {isLoading ? (
            <>
              <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing…
            </>
          ) : (
            <>✨ {hasAnalyzed ? 'Re-analyze' : 'Analyze'}</>
          )}
        </button>
      </div>

      {/* Activity breakdown badges */}
      {results.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {(['Questions', 'Fill in the Blanks', 'Word Match', 'Rhyme Match', 'Opposites', 'Word Sort', 'Maths', 'Subject'] as const).map((act) => {
            const count = results.filter((r) => r.activity === act).length;
            if (count === 0) return null;
            const actResults = results.filter((r) => r.activity === act);
            const avg = Math.round(
              (actResults.reduce((sum, r) => sum + (r.total > 0 ? r.score / r.total : 0), 0) / actResults.length) * 100
            );
            const badgeColors: Record<string, string> = {
              'Questions': 'bg-purple-100 text-purple-700',
              'Fill in the Blanks': 'bg-teal-100 text-teal-700',
              'Word Match': 'bg-violet-100 text-violet-700',
              'Rhyme Match': 'bg-pink-100 text-pink-700',
              'Opposites': 'bg-amber-100 text-amber-700',
              'Word Sort': 'bg-indigo-100 text-indigo-700',
              'Maths': 'bg-green-100 text-green-700',
              'Subject': 'bg-blue-100 text-blue-700',
            };
            return (
              <span key={act} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColors[act]}`}>
                {ACTIVITY_LABELS[act]} · {avg}%
              </span>
            );
          })}
        </div>
      )}

      {results.length === 0 && (
        <div className="bg-white/60 rounded-xl px-3 py-2 text-xs text-purple-400 font-medium text-center">
          No activity results yet for {displayName}
        </div>
      )}

      {results.length > 0 && !hasAnalyzed && !isLoading && (
        <div className="bg-white/60 rounded-xl px-3 py-2 text-xs text-purple-500 font-medium text-center">
          Tap <strong>Analyze</strong> to get AI Coach's recommendations for {displayName} 📚
        </div>
      )}

      {isLoading && (
        <div className="bg-white/60 rounded-xl px-3 py-3 flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-purple-500 font-medium">AI Coach is reviewing {displayName}'s activity history…</span>
        </div>
      )}

      {recommendation && !isLoading && (
        <div className="bg-white/80 rounded-xl px-3 py-3 border border-purple-100">
          <p className="text-xs text-purple-900 font-medium leading-relaxed whitespace-pre-wrap">
            {recommendation}
          </p>
        </div>
      )}
    </div>
  );
}

export default function AIRecommendations({ results }: AIRecommendationsProps) {
  const CHILD_KEYS = ['Kitty', 'Karawa', 'Zech'];

  const [settings, setSettings] = useState<ParentSettings>(() => loadParentSettings());

  useEffect(() => {
    const handleSettingsChange = () => {
      setSettings(loadParentSettings());
    };
    window.addEventListener('kitty_settings_changed', handleSettingsChange);
    return () => window.removeEventListener('kitty_settings_changed', handleSettingsChange);
  }, []);

  // Group results by child name (using original key names for matching)
  const byChild: Record<string, ActivityResult[]> = {};
  CHILD_KEYS.forEach(key => {
    const childData = settings.children[key];
    const displayName = childData?.name ?? key;
    byChild[key] = results.filter(r => r.childName === key || r.childName === displayName);
  });

  const hasAnyResults = results.length > 0;

  if (!hasAnyResults) return null;

  return (
    <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-sm p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🤖</span>
        <div>
          <h2 className="text-base font-extrabold text-purple-800">AI Training Coach</h2>
          <p className="text-xs text-purple-400">Powered by AI Coach · Analyses all subjects &amp; activities per child</p>
        </div>
      </div>

      <div className="space-y-3">
        {CHILD_KEYS.map(key => {
          const childData = settings.children[key];
          return (
            <ChildPanel
              key={key}
              childName={key}
              displayName={childData?.name ?? key}
              emoji={childData?.emoji ?? '👤'}
              photoUrl={childData?.photoUrl ?? null}
              results={byChild[key] ?? []}
            />
          );
        })}
      </div>
    </div>
  );
}
