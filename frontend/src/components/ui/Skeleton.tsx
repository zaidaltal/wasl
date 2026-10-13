import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-shimmer rounded-xl bg-[length:200%_100%]',
        'bg-[linear-gradient(90deg,rgb(var(--sunken))_0%,rgb(var(--line))_50%,rgb(var(--sunken))_100%)]',
        className
      )}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2.5', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3.5', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <div style={{ width: size, height: size }} className="shrink-0">
      <Skeleton className={cn('h-full w-full rounded-[32%]', className)} />
    </div>
  );
}

/** Matches the shape of JobCard / FreelancerCard so loading does not shift layout. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('shell', className)}>
      <div className="core p-6">
        <div className="mb-5 flex items-center gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-[32%]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <SkeletonText lines={2} />
        <div className="mt-5 flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
