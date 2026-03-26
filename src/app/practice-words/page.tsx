// Practice Words page — server shell

import AppNav from '@/components/AppNav';
import PracticeWordsContent from './components/PracticeWordsContent';

export default function PracticeWordsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppNav />
      <main className="flex-1 pb-24 md:pb-8">
        <PracticeWordsContent />
      </main>
    </div>
  );
}