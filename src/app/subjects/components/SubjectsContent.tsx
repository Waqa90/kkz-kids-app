'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CHILD_NAMES, SUBJECTS_BY_CHILD, SUBJECT_META, getSelectedChild, setSelectedChild, clearSelectedChild, type ChildName, type SubjectKey, type ChildClass,
} from '@/lib/childProfile';
import { loadParentSettings, isSubjectEnabled, getChildClassFromSettings } from '@/app/parent/components/SettingsPanel';
import { getAllActivities } from '@/lib/subjectContent';
import ChildPicker from '@/components/ChildPicker';
import Leaderboard from '@/components/Leaderboard';
import AppNav from '@/components/AppNav';

export default function SubjectsContent() {
  const router = useRouter();
  const [screen, setScreen] = useState<'picker' | 'subjects'>('picker');
  const [selectedChild, setSelectedChildState] = useState<ChildName | null>(null);
  const [childSettings, setChildSettings] = useState(() => loadParentSettings().children);
  const [mounted, setMounted] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ChildClass | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = getSelectedChild();
    if (saved) {
      setSelectedChildState(saved);
      setSelectedClass(getChildClassFromSettings(saved));
      setScreen('subjects');
    }
    const reload = () => setChildSettings(loadParentSettings().children);
    window.addEventListener('kitty_settings_changed', reload);
    return () => window.removeEventListener('kitty_settings_changed', reload);
  }, []);

  const handleSelect = (name: ChildName) => {
    setSelectedChild(name);
    setSelectedChildState(name);
    setSelectedClass(getChildClassFromSettings(name));
    setScreen('subjects');
  };

  const handleSwitch = () => {
    clearSelectedChild();
    setSelectedChildState(null);
    setScreen('picker');
  };

  const handleSubjectTap = (subject: SubjectKey) => {
    if (!selectedChild) return;
    if (!isSubjectEnabled(selectedChild, subject)) return;
    const clsParam = selectedClass ?? getChildClassFromSettings(selectedChild);
    router.push(`/subjects/${subject}?child=${selectedChild}&class=${clsParam}`);
  };

  if (!mounted) return null;

  // ── Screen A: Child Picker ──────────────────────────────────────────────
  if (screen === 'picker') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <ChildPicker onSelect={handleSelect} selectedChild={selectedChild} />
        </main>
      </div>
    );
  }

  // ── Screen B: Subject Grid ──────────────────────────────────────────────
  const child = selectedChild!;
  const childData = childSettings[child];
  const defaultClass = getChildClassFromSettings(child);
  const cls = selectedClass ?? defaultClass;
  const subjects = SUBJECTS_BY_CHILD[child] ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
      <AppNav />
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-300 bg-white flex items-center justify-center shadow">
              {childData?.photoUrl
                ? <img src={childData.photoUrl} alt={child} className="w-full h-full object-cover" />
                : <span className="text-2xl">{childData?.emoji ?? '🐱'}</span>}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-purple-800">Hi {childData?.name ?? child}! 📚</h1>
              <p className="text-xs text-purple-400 font-medium">Pick your subject below 👇</p>
            </div>
          </div>
          <button onClick={handleSwitch} className="text-xs font-bold text-purple-400 hover:text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-xl transition-colors min-h-[36px]">
            Switch 👋
          </button>
        </div>

        {/* Class selector */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xs font-bold text-purple-600">Class:</span>
          {([3, 4, 5] as const).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedClass(c)}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                cls === c
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-white border-2 border-purple-200 text-purple-500 hover:bg-purple-50'
              }`}
            >
              Class {c}
              {c === defaultClass && cls !== c && (
                <span className="ml-1 opacity-60">(default)</span>
              )}
            </button>
          ))}
        </div>

        {/* Subject grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {subjects.map((subject) => {
            const meta = SUBJECT_META[subject];
            const enabled = isSubjectEnabled(child, subject);
            const activityCount = getAllActivities(subject, cls).length;
            return (
              <button
                key={subject}
                onClick={() => handleSubjectTap(subject)}
                disabled={!enabled}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all duration-150 text-left
                  ${enabled
                    ? `${meta.color} border-transparent hover:scale-[1.03] hover:shadow-lg active:scale-[0.97] shadow-md`
                    : 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                  }`}
              >
                {!enabled && (
                  <span className="absolute top-2 right-2 text-xs bg-gray-200 text-gray-500 rounded-full px-2 py-0.5 font-bold">🔒</span>
                )}
                <span className="text-5xl">{meta.emoji}</span>
                <span className={`font-extrabold text-base text-center leading-tight ${enabled ? 'text-gray-800' : 'text-gray-400'}`}>{meta.label}</span>
                <span className={`text-xs text-center ${enabled ? 'text-gray-500' : 'text-gray-300'}`}>{meta.description}</span>
                {enabled && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.levelColor}`}>
                    {activityCount > 0 ? `${activityCount} activit${activityCount === 1 ? 'y' : 'ies'}` : 'No activities yet'}
                  </span>
                )}
                {!enabled && (
                  <span className="text-xs text-gray-400 font-medium">Ask parent to unlock</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Leaderboard */}
        <Leaderboard />
      </main>
    </div>
  );
}
