// Story Reading page — server component shell

import AppNav from '@/components/AppNav';
import StoryReadingContent from './components/StoryReadingContent';

export default function StoryReadingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppNav />
      <main className="flex-1 pb-24 md:pb-8">
        <StoryReadingContent />
      </main>
    </div>
  );
}