import { Loader2 } from "lucide-react";

/** Base shimmer block — compose these into page/section wireframes. */
export const Skel = ({ className = "" }: { className?: string }) => (
  <div className={`skeleton ${className}`} />
);

/** Inline / full-area spinner. */
export const Spinner = ({ className = "", size = 22 }: { className?: string; size?: number }) => (
  <Loader2 size={size} className={`animate-spin text-primary ${className}`} />
);

export const PageSpinner = ({ label }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <Spinner size={26} />
    {label && <p className="text-sm text-gray-500">{label}</p>}
  </div>
);

/** A skeleton mimicking a stat/metric card. */
export const SkeletonStatCard = () => (
  <div className="portal-card p-5 border border-white/[0.08]">
    <Skel className="w-10 h-10 rounded-xl mb-4" />
    <Skel className="h-7 w-24 mb-2" />
    <Skel className="h-3.5 w-20 mb-1.5" />
    <Skel className="h-3 w-16" />
  </div>
);

/** A grid of stat-card skeletons. */
export const SkeletonStatGrid = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => <SkeletonStatCard key={i} />)}
  </div>
);

/** Repeated list rows (icon + two text lines + trailing value). */
export const SkeletonListRows = ({ rows = 5 }: { rows?: number }) => (
  <div className="divide-y divide-white/[0.05]">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-5 py-4">
        <Skel className="w-9 h-9 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skel className="h-3.5 w-2/5" />
          <Skel className="h-3 w-3/5" />
        </div>
        <Skel className="h-4 w-16 shrink-0" />
      </div>
    ))}
  </div>
);

/** Skeleton table: header row + N body rows. */
export const SkeletonTable = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="overflow-hidden">
    <div className="flex gap-4 px-5 py-3.5 border-b border-white/[0.07] bg-white/[0.02]">
      {Array.from({ length: cols }).map((_, i) => <Skel key={i} className="h-3.5 flex-1" />)}
    </div>
    <div className="divide-y divide-white/[0.05]">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 px-5 py-4">
          {Array.from({ length: cols }).map((_, c) => <Skel key={c} className="h-4 flex-1" />)}
        </div>
      ))}
    </div>
  </div>
);

export default Skel;
