'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { setSelectedChild, CHILD_NAMES, type ChildName } from '@/lib/childProfile';
import StoryReadingContent from '@/app/story-reading/components/StoryReadingContent';
import AppNav from '@/components/AppNav';

function EnglishPageInner() {
  const searchParams = useSearchParams();
  const childParam = searchParams.get('child');

  useEffect(() => {
    if (childParam && CHILD_NAMES.includes(childParam as ChildName)) {
      setSelectedChild(childParam as ChildName);
    }
  }, [childParam]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 pb-24 md:pb-0">
      <AppNav />
      <StoryReadingContent />
    </div>
  );
}

export default function EnglishPage() {
  return (
    <Suspense>
      <EnglishPageInner />
    </Suspense>
  );
}
