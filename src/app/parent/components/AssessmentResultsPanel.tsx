'use client';

/**
 * AssessmentResultsPanel
 * Displays exam results in the Parent Dashboard.
 *
 * Visualisers chosen:
 * - RadarChart  → per-exam section breakdown (shows strengths/weaknesses across sections A/B/C/D)
 * - BarChart    → exam scores over time per child (consistent with existing activity chart style)
 */

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { getAssessmentResultsAsync, type AssessmentResult } from '@/lib/assessmentResults';

const CHILD_COLORS: Record<string, string> = {
  Kitty: '#a855f7',
  Karawa: '#f97316',
  Zech: '#22c55e',
  Unknown: '#94a3b8',
};

function starsForPct(pct: number): number {
  if (pct >= 100) return 5;
  if (pct >= 80) return 4;
  if (pct >= 60) return 3;
  if (pct >= 40) return 1;
  return 0;
}

function pctColor(pct: number): string {
  if (pct >= 80) return 'text-green-600';
  if (pct >= 60) return 'text-yellow-600';
  if (pct >= 40) return 'text-orange-500';
  return 'text-red-500';
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return iso; }
}

interface ChildSummary {
  child: string;
  totalExams: number;
  avgPct: number;
  bestPct: number;
  totalStars: number;
}

function buildSummary(results: AssessmentResult[]): ChildSummary[] {
  const map: Record<string, { pcts: number[]; stars: number }> = {};
  results.forEach((r) => {
    const pct = r.totalMarks > 0 ? Math.round((r.score / r.totalMarks) * 100) : 0;
    if (!map[r.childName]) map[r.childName] = { pcts: [], stars: 0 };
    map[r.childName].pcts.push(pct);
    map[r.childName].stars += starsForPct(pct);
  });
  return Object.entries(map).map(([child, { pcts, stars }]) => ({
    child,
    totalExams: pcts.length,
    avgPct: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
    bestPct: Math.max(...pcts),
    totalStars: stars,
  }));
}

function buildBarData(results: AssessmentResult[]): { data: any[]; children: string[] } {
  const childSet = new Set<string>();
  const dateMap: Record<string, Record<string, number>> = {};
  results.forEach((r) => {
    childSet.add(r.childName);
    const key = formatDate(r.dateTime);
    if (!dateMap[key]) dateMap[key] = {};
    const pct = r.totalMarks > 0 ? Math.round((r.score / r.totalMarks) * 100) : 0;
    // Keep highest score on same day per child
    if (!dateMap[key][r.childName] || pct > dateMap[key][r.childName]) {
      dateMap[key][r.childName] = pct;
    }
  });
  const data = Object.entries(dateMap)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, vals]) => ({ date, ...vals }));
  return { data, children: Array.from(childSet) };
}

function buildRadarData(result: AssessmentResult): { subject: string; score: number; fullMark: number }[] {
  return result.sections.map((s) => ({
    subject: `${s.label}: ${s.title || s.label}`,
    score: s.marks > 0 ? Math.round((s.score / s.marks) * 100) : 0,
    fullMark: 100,
  }));
}

export default function AssessmentResultsPanel() {
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterChild, setFilterChild] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getAssessmentResultsAsync().then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, []);

  const allChildren = Array.from(new Set(results.map((r) => r.childName)));
  const filtered = filterChild ? results.filter((r) => r.childName === filterChild) : results;
  const summaries = buildSummary(filtered);
  const { data: barData, children: barChildren } = buildBarData(filtered);

  return (
    <div className="bg-white rounded-3xl border-2 border-orange-100 shadow-sm p-5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-extrabold text-purple-800">📝 Assessment Exam Results</h2>
          <p className="text-xs text-purple-400 mt-0.5">Timed exams completed in the Assessment tab</p>
        </div>
        {allChildren.length > 1 && (
          <select
            value={filterChild}
            onChange={(e) => setFilterChild(e.target.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border-2 border-orange-200 text-purple-700 bg-orange-50 focus:outline-none"
          >
            <option value="">All Children</option>
            {allChildren.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {loading ? (
        <div className="py-10 text-center">
          <div className="w-8 h-8 rounded-full border-4 border-purple-300 border-t-purple-600 animate-spin mx-auto mb-3" />
          <p className="text-purple-400 font-semibold text-sm">Loading exam results…</p>
        </div>
      ) : results.length === 0 ? (
        <div className="py-10 text-center">
          <div className="text-5xl mb-3">📝</div>
          <p className="font-bold text-purple-700 text-base mb-1">No exams taken yet</p>
          <p className="text-sm text-purple-400">
            Once your children complete a timed exam in the Assessment tab, their results will appear here with detailed section breakdowns.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center text-xs font-bold text-purple-400">
            <span>1. Go to 🧪 Lab → Exam Builder → create an exam</span>
            <span>2. Child opens 📝 Assessment tab → takes the exam</span>
            <span>3. Results appear here automatically</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">

          {/* ── Summary Cards per Child ── */}
          {summaries.length > 0 && (
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(summaries.length, 3)}, minmax(0, 1fr))` }}>
              {summaries.map(({ child, totalExams, avgPct, bestPct, totalStars }) => (
                <div key={child} className="rounded-2xl border-2 p-4 text-center"
                  style={{ borderColor: `${CHILD_COLORS[child] ?? '#f97316'}40`, background: `${CHILD_COLORS[child] ?? '#f97316'}0d` }}>
                  <p className="font-extrabold text-base mb-2" style={{ color: CHILD_COLORS[child] ?? '#7c3aed' }}>{child}</p>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-2xl font-extrabold text-purple-800">{totalExams}</p>
                      <p className="text-[10px] font-bold text-purple-400">Exams</p>
                    </div>
                    <div>
                      <p className={`text-2xl font-extrabold ${pctColor(avgPct)}`}>{avgPct}%</p>
                      <p className="text-[10px] font-bold text-purple-400">Avg Score</p>
                    </div>
                    <div>
                      <p className={`text-2xl font-extrabold ${pctColor(bestPct)}`}>{bestPct}%</p>
                      <p className="text-[10px] font-bold text-purple-400">Best</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-yellow-500">{'⭐'.repeat(Math.min(totalStars, 5))}</p>
                      <p className="text-[10px] font-bold text-purple-400">{totalStars} Stars</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Bar Chart: Exam Scores Over Time ── */}
          {barData.length > 0 && (
            <div>
              <p className="text-xs font-extrabold text-purple-700 uppercase tracking-wide mb-3">📈 Exam Scores Over Time</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} margin={{ top: 4, right: 8, left: -10, bottom: 20 }} barCategoryGap="20%" barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#7c3aed', fontWeight: 600 }} angle={-40} textAnchor="end" height={50} tickLine={false} axisLine={{ stroke: '#fde68a' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#7c3aed', fontWeight: 600 }} tickLine={false} axisLine={{ stroke: '#fde68a' }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '2px solid #fde68a', fontSize: 12, fontWeight: 600 }} formatter={(v: number, name: string) => [`${v}%`, name]} />
                  <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: 4 }} />
                  {barChildren.map((child) => (
                    <Bar key={child} dataKey={child} fill={CHILD_COLORS[child] ?? '#94a3b8'} radius={[4, 4, 0, 0]} maxBarSize={20} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── Exam Cards List ── */}
          <div>
            <p className="text-xs font-extrabold text-purple-700 uppercase tracking-wide mb-3">📋 All Exam Results</p>
            <div className="space-y-3">
              {filtered.slice(0, 20).map((r) => {
                const pct = r.totalMarks > 0 ? Math.round((r.score / r.totalMarks) * 100) : 0;
                const stars = starsForPct(pct);
                const isExpanded = expandedId === r.id;
                const radarData = buildRadarData(r);
                const hasMultipleSections = r.sections.length > 1;

                return (
                  <div key={r.id} className="border-2 border-orange-100 rounded-2xl overflow-hidden">
                    {/* Card header */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-orange-50 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : r.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-extrabold text-purple-800 text-sm">{r.assessmentTitle}</span>
                          <span className="text-xs bg-orange-100 text-orange-600 rounded-full px-2 font-bold">{r.term}</span>
                          <span className="text-xs bg-purple-100 text-purple-600 rounded-full px-2 font-bold">{r.subject}</span>
                          <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 font-bold">Class {r.classLevel}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs text-purple-400 font-bold">{r.childName} · {formatDate(r.dateTime)}</span>
                          <span className="text-xs text-yellow-500 font-bold">{'⭐'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <div className="text-right">
                          <p className={`text-2xl font-extrabold ${pctColor(pct)}`}>{pct}%</p>
                          <p className="text-xs text-purple-400 font-bold">{r.score}/{r.totalMarks} marks</p>
                        </div>
                        <span className={`text-purple-400 text-sm transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                      </div>
                    </div>

                    {/* Expanded: section breakdown + radar chart */}
                    {isExpanded && (
                      <div className="border-t-2 border-orange-100 p-4 bg-orange-50 space-y-4">

                        {/* Section breakdown table */}
                        <div>
                          <p className="text-xs font-extrabold text-purple-600 mb-2">Section Breakdown</p>
                          <div className="space-y-2">
                            {r.sections.map((s, i) => {
                              const sPct = s.marks > 0 ? Math.round((s.score / s.marks) * 100) : 0;
                              return (
                                <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2">
                                  <span className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full font-extrabold text-sm flex-shrink-0">
                                    {s.label}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-purple-800 truncate">{s.title || `Section ${s.label}`}</p>
                                    {/* Progress bar */}
                                    <div className="mt-1 w-full bg-gray-100 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full transition-all ${sPct >= 80 ? 'bg-green-400' : sPct >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                        style={{ width: `${sPct}%` }}
                                      />
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className={`text-sm font-extrabold ${pctColor(sPct)}`}>{sPct}%</p>
                                    <p className="text-[10px] text-purple-400 font-bold">{s.score}/{s.marks}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Radar chart — only if 3+ sections */}
                        {hasMultipleSections && radarData.length >= 3 && (
                          <div>
                            <p className="text-xs font-extrabold text-purple-600 mb-1">Performance Radar</p>
                            <p className="text-[10px] text-purple-400 mb-2">Shows strength in each section — the larger the shape, the better the performance</p>
                            <ResponsiveContainer width="100%" height={220}>
                              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                                <PolarGrid stroke="#e9d5ff" />
                                <PolarAngleAxis
                                  dataKey="subject"
                                  tick={{ fontSize: 10, fill: '#7c3aed', fontWeight: 600 }}
                                />
                                <Radar
                                  name={r.childName}
                                  dataKey="score"
                                  stroke={CHILD_COLORS[r.childName] ?? '#f97316'}
                                  fill={CHILD_COLORS[r.childName] ?? '#f97316'}
                                  fillOpacity={0.25}
                                  strokeWidth={2}
                                />
                                <Tooltip
                                  contentStyle={{ borderRadius: '12px', border: '2px solid #e9d5ff', fontSize: 12, fontWeight: 600 }}
                                  formatter={(v: number) => [`${v}%`, 'Score']}
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
