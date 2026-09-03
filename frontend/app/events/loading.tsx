import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function EventsLoading() {
  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="flex justify-center">
          <Skeleton className="h-6 w-36 rounded-full" />
        </div>
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-5/6 mx-auto" />
      </div>

      {/* Category Filter Pills Skeleton */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-xl" />
        ))}
      </div>

      {/* Events Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-surface/80 border border-surface-border/60 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
            <Skeleton className="h-7 w-4/5" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
            </div>
            <div className="pt-4 border-t border-surface-border/50 flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
