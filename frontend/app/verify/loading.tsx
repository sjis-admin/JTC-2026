import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function VerifyLoading() {
  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      {/* Header Skeleton */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <Skeleton className="h-6 w-44 rounded-full" />
        </div>
        <Skeleton className="h-10 w-80 mx-auto max-w-full" />
        <Skeleton className="h-4 w-96 mx-auto max-w-full" />
      </div>

      {/* Lookup Card Skeleton */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface/90 border border-surface-border space-y-4">
        <Skeleton className="h-4 w-52" />
        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 w-32 rounded-xl shrink-0" />
        </div>
      </div>
    </div>
  );
}
