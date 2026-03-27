'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SUBJECT_META, CHILD_NAMES, type ChildName, type SubjectKey } from '@/lib/childProfile';
import { isSubjectEnabled, getChildControls, getChildClassFromSettings, loadParentSettings } from '@/app/parent/components/SettingsPanel';
import { getAllActivities, getUploadedActivitiesAsync, type SubjectActivity } from '@/lib/subjectContent';
import { saveSubjectResultAsync } from '@/lib/subjectResults';
import SubjectActivityRunner, { type SubjectQuestion } from '@/components/SubjectActivityRunner';
import AppNav from '@/components/AppNav';

const VALID_SUBJECTS: SubjectKey[] = ['english', 'maths', 'science', 'social-studies', 'healthy-living', 'mce', 'fijian'];

interface SubjectContentProps {
  subject: string;
  child?: string;
  classOverride?: string;
}

export default function SubjectContent({ subject, child: childParam, classOverride }: SubjectContentProps) {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState<SubjectActivity | null>(null);
  const [childSettings, setChildSettings] = useState(() => loadParentSettings().children);

  const [, forceUpdate] = React.useState(0);

  useEffect(() => {
    const reload = () => setChildSettings(loadParentSettings().children);
    window.addEventListener('kitty_settings_changed', reload);
    // Sync uploaded activities from Supabase on mount
    getUploadedActivitiesAsync().then(() => forceUpdate(n => n + 1)).catch(() => {});
    return () => window.removeEventListener('kitty_settings_changed', reload);
  }, []);

  // Redirect to /subjects/english for english subject
  useEffect(() => {
    if (subject === 'english' && childParam) {
      router.replace(`/subjects/english?child=${childParam}`);
    }
  }, [subject, childParam, router]);

  const isValidSubject = VALID_SUBJECTS.includes(subject as SubjectKey);
  if (!isValidSubject) {
    router.replace('/subjects');
    return null;
  }

  const subjectKey = subject as SubjectKey;
  const childName = (childParam && CHILD_NAMES.includes(childParam as ChildName)) ? (childParam as ChildName) : null;
  if (!childName) {
    router.replace('/subjects');
    return null;
  }

  const enabled = isSubjectEnabled(childName, subjectKey);
  const meta = SUBJECT_META[subjectKey];
  const controls = getChildControls(childName);
  const defaultClass = getChildClassFromSettings(childName);
  const parsedOverride = classOverride ? parseInt(classOverride) : null;
  const childClass = (parsedOverride === 3 || parsedOverride === 4 || parsedOverride === 5) ? parsedOverride : defaultClass;
  const activities = getAllActivities(subjectKey, childClass);
  const childData = childSettings[childName];

  if (!enabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-extrabold text-purple-800">{meta.label} is Locked</h2>
          <p className="text-purple-500">Ask your parent to unlock {meta.label} in Settings.</p>
          <button onClick={() => router.back()} className="px-6 py-3 bg-purple-500 text-white rounded-2xl font-bold">← Go Back</button>
        </div>
      </div>
    );
  }

  // If an activity is running
  if (selectedActivity) {
    const questions: SubjectQuestion[] = selectedActivity.questions.map((q) => ({
      id: q.id,
      question: q.question,
      type: q.type === 'match' ? 'multiple-choice' : q.type === 'short-answer' ? 'typed' : q.type,
      options: q.options,
      correctAnswer: q.correctAnswer,
      correctIndex: q.correctIndex,
      hint: q.hint,
      emoji: q.emoji,
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
        <AppNav />
        <SubjectActivityRunner
          questions={questions}
          childName={childName}
          subjectKey={subjectKey}
          activityTitle={selectedActivity.title}
          onComplete={(score, total) => {
            saveSubjectResultAsync({
              activityId: selectedActivity.id,
              activityTitle: selectedActivity.title,
              subject: subjectKey,
              activityType: selectedActivity.activityType,
              childName,
              class: childClass,
              score,
              total,
            });
            setSelectedActivity(null);
          }}
          onBack={() => setSelectedActivity(null)}
          showHints={controls.showHints}
          soundEnabled={controls.soundEnabled}
        />
      </div>
    );
  }

  // Activity selector
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
      <AppNav />
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => router.push(`/subjects?child=${childName}`)} className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600 font-bold transition-colors">←</button>
          <div className="text-3xl sm:text-4xl">{meta.emoji}</div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-purple-800">{meta.label}</h1>
            <p className="text-sm text-purple-500">Class {childClass} · {childName}</p>
          </div>
        </div>

        {/* Activity grid */}
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-purple-600 font-bold">No activities available for Class {childClass} yet.</p>
            <p className="text-purple-400 text-sm mt-2">Parents can add activities via the Lab tab! 🧪</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activities.map((activity) => (
              <div key={activity.id} className={`${activity.color} rounded-3xl border-2 border-transparent p-5 shadow-md hover:shadow-xl transition-all`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{activity.emoji}</span>
                  <div className="flex gap-1">
                    {activity.source === 'uploaded' && <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 font-bold">📤 New</span>}
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${activity.levelColor}`}>Class {activity.class}</span>
                  </div>
                </div>
                <h3 className="font-extrabold text-gray-800 text-base mb-1">{activity.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{activity.questions.length} questions · {activity.activityType.replace('-', ' ')}</p>
                <button
                  onClick={() => setSelectedActivity(activity)}
                  className="w-full py-2.5 bg-orange-400 hover:bg-orange-500 text-white font-extrabold rounded-2xl transition-all active:scale-95 shadow-sm"
                >
                  Start! 🚀
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
