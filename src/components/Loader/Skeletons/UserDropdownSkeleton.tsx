import { Skeleton } from '@/components/ui/skeleton';

export function UserDropdownSkeleton() {
  return (
    <div className="border-border bg-card flex items-center gap-2.5 rounded-sm border px-3 py-2">
      <Skeleton className="h-7 w-7 rounded-full" />

      <div className="hidden flex-col gap-1.5 md:flex">
        <Skeleton className="h-4 w-24" />
      </div>

      <Skeleton className="hidden h-3.5 w-3.5 rounded-sm md:block" />
    </div>
  );
}
