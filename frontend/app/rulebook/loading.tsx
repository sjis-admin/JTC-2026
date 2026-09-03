import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function RulebookLoading() {
  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl shrink-0" />
      </div>

      {/* Cover Box Skeleton */}
      <div className="p-8 rounded-2xl bg-surface-elevated/90 border border-surface-border space-y-4">
        <div className="space-y-2 pb-4 border-b border-surface-border">
          <Skeleton className="h-3.5 w-64" />
          <Skeleton className="h-8 w-96 max-w-full" />
          <Skeleton className="h-3.5 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      {/* General Rules Box Skeleton */}
      <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
        <Skeleton className="h-6 w-56" />
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
        </div>
      </div>

      {/* Segment Cards Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-64 mb-4" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-surface/80 border border-surface-border space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
