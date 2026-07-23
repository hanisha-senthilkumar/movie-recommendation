import React from 'react';

export const SkeletonLoader = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-[var(--bg-panel)]/80 border border-white/5 overflow-hidden flex flex-col h-full animate-pulse"
        >
          <div className="aspect-[2/3] w-full bg-[var(--bg-hover)] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          </div>
          <div className="p-3.5 space-y-2">
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-[var(--bg-hover)] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};
