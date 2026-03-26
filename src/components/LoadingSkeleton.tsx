// Skeleton loading placeholder — animate-pulse for child-friendly loading state

import React from 'react';

interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export default function LoadingSkeleton({ lines = 4, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`} aria-label="Loading...">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-shimmer rounded-2xl"
          style={{
            height: '3rem',
            width: i % 3 === 0 ? '100%' : i % 3 === 1 ? '85%' : '70%',
          }}
        />
      ))}
    </div>
  );
}