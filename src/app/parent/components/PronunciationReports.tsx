'use client';

import React, { useState, useEffect } from 'react';
import { getPronunciationReports, type PronunciationReport } from '@/lib/pronunciationReports';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'bg-green-100 text-green-700'
      : score >= 50
      ? 'bg-yellow-100 text-yellow-700' :'bg-red-100 text-red-700';
  return (
    <span className={`inline-block px-3 py-1 rounded-full font-extrabold text-xs ${color}`}>
      {score}%
    </span>
  );
}

export default function PronunciationReports() {
  const [reports, setReports] = useState<PronunciationReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getPronunciationReports()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border-2 border-purple-100 p-8 text-center shadow-sm mb-6">
        <div className="flex justify-center mb-3">
          <div className="w-8 h-8 rounded-full border-4 border-purple-300 border-t-purple-600 animate-spin" />
        </div>
        <p className="text-purple-500 font-semibold text-sm">Loading Teacher X reports…</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🤖</span>
        <div>
          <h2 className="text-lg font-extrabold text-purple-800">Teacher X Reports</h2>
          <p className="text-xs text-purple-400 font-semibold">Pronunciation assessments by Claude AI</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-purple-100 p-8 text-center shadow-sm">
          <div className="text-4xl mb-3">🎓</div>
          <p className="text-base font-bold text-purple-700">No Teacher X sessions yet!</p>
          <p className="text-sm text-purple-400 mt-1">
            Kitty can start a Teacher X session from the story reading page.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border-2 border-purple-100 shadow-sm overflow-hidden"
            >
              {/* Report summary row */}
              <button
                onClick={() => setExpanded(expanded === report.id ? null : report.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-purple-50 transition-all text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl flex-shrink-0">📖</span>
                  <div className="min-w-0">
                    <p className="font-extrabold text-purple-900 text-sm truncate">{report.storyTitle}</p>
                    <p className="text-xs text-purple-400 font-semibold">{formatDate(report.sessionDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <ScoreBadge score={report.overallScore} />
                  <span className="text-purple-400 text-sm">{expanded === report.id ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded detail */}
              {expanded === report.id && (
                <div className="border-t-2 border-purple-50 px-5 py-4 flex flex-col gap-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-purple-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-extrabold text-purple-700">{report.wordsAttempted}</p>
                      <p className="text-xs text-purple-400 font-bold">Words Tried</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-extrabold text-green-600">{report.wordsCorrect}</p>
                      <p className="text-xs text-green-400 font-bold">Correct</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3 text-center">
                      <p className="text-xl font-extrabold text-red-500">
                        {report.wordsAttempted - report.wordsCorrect}
                      </p>
                      <p className="text-xs text-red-400 font-bold">Needs Work</p>
                    </div>
                  </div>

                  {/* Teacher feedback */}
                  {report.teacherFeedback && (
                    <div className="flex items-start gap-2 bg-purple-50 rounded-xl p-3">
                      <span className="text-xl flex-shrink-0">🤖</span>
                      <p className="text-purple-700 text-sm font-semibold italic">{report.teacherFeedback}</p>
                    </div>
                  )}

                  {/* Strengths */}
                  {report.strengths && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <p className="text-xs font-extrabold text-green-600 uppercase tracking-wide mb-1">✅ Strengths</p>
                      <p className="text-green-800 text-sm font-semibold">{report.strengths}</p>
                    </div>
                  )}

                  {/* Improvements needed */}
                  {report.improvementsNeeded && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                      <p className="text-xs font-extrabold text-orange-600 uppercase tracking-wide mb-1">📈 Improvements Needed</p>
                      <p className="text-orange-800 text-sm font-semibold">{report.improvementsNeeded}</p>
                    </div>
                  )}

                  {/* Weak words */}
                  {report.weakWords.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-xs font-extrabold text-red-600 uppercase tracking-wide mb-2">🔤 Words to Practise</p>
                      <div className="flex flex-col gap-2">
                        {report.weakWords.map((ww, i) => (
                          <div key={i} className="bg-white rounded-lg border border-red-100 px-3 py-2">
                            <span className="font-extrabold text-red-700 text-sm">&ldquo;{ww.word}&rdquo;</span>
                            {ww.issue && (
                              <span className="text-red-400 text-xs ml-2">— {ww.issue}</span>
                            )}
                            {ww.tip && (
                              <p className="text-gray-500 text-xs mt-0.5 italic">{ww.tip}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pronunciation issues */}
                  {report.pronunciationIssues.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                      <p className="text-xs font-extrabold text-yellow-700 uppercase tracking-wide mb-2">⚠️ Pronunciation Patterns</p>
                      <div className="flex flex-col gap-2">
                        {report.pronunciationIssues.map((issue, i) => (
                          <div key={i}>
                            <p className="text-yellow-800 text-sm font-bold">{issue.category}</p>
                            <p className="text-yellow-700 text-xs">{issue.description}</p>
                            {issue.examples?.length > 0 && (
                              <p className="text-yellow-600 text-xs mt-0.5">
                                Examples: {issue.examples.join(', ')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
