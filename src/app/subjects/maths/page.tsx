import React, { Suspense } from 'react';
import MathsContent from './components/MathsContent';

export default function MathsPage() {
  return (
    <Suspense>
      <MathsContent />
    </Suspense>
  );
}
