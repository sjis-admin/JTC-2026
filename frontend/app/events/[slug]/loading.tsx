import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function EventDetailLoading() {
  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Back button skeleton */}
      <Skeleton className="h-4 w-32 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
            <Skeleton className="h-10 w-4/5" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Rules Section Skeleton */}
          <div className="p-6 rounded-2xl bg-surface/50 border border-surface-border space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-4/5" />
            </div>
          </div>

          {/* Judging Criteria Skeleton */}
          <div className="p-6 rounded-2xl bg-surface/50 border border-surface-border space-y-4">
            <Skeleton className="h-6 w-44" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>
          </div>
        </div>

        {/* Sidebar Summary Card Skeleton (1 Col) */}
        <div>
          <div className="p-6 rounded-2xl bg-surface-elevated/80 border border-surface-border space-y-5 sticky top-28">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-9 w-36" />
            </div>

            <div className="space-y-3 pt-4 border-t border-surface-border">
              <Skeleton className="h-4 w-40" />
              <div className="flex gap-1.5">
                <Skeleton className="h-6 w-20 rounded" />
                <Skeleton className="h-6 w-20 rounded" />
              </div>
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="pt-4 border-t border-surface-border">
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
