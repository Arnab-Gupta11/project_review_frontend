'use client';

import { cn } from '@/lib/utils';
import { FileX, LucideIcon } from 'lucide-react';

interface NotFoundProps {
  title?: string;
  description?: string;
  className?: string;
  icon?: LucideIcon;
  actionButton?: React.ReactNode;
}

const EmptyState = ({
  title = 'No Data Found',
  description = 'There is currently no data available to display here.',
  className,
  icon: Icon = FileX,
  actionButton,
}: NotFoundProps) => {
  return (
    <div
      className={cn(
        'border border-white/[0.09] bg-[rgba(6,28,38,0.55)] backdrop-blur-xl flex flex-col items-center justify-center rounded-2xl border-dashed p-12 sm:p-16 text-center shadow-xl',
        'transition-all duration-300',
        className,
      )}
    >
      <div className="relative mb-5">
        <div className="bg-primary/20 absolute -inset-1 animate-pulse rounded-full blur"></div>
        <div className="bg-primary/5 relative flex items-center justify-center rounded-full p-4 shadow-sm">
          <Icon size={45} strokeWidth={1.5} className="text-primary" />
        </div>
      </div>

      <div className="max-w-sm space-y-2">
        <h3 className="text-primary-text text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="text-secondary-text text-sm leading-relaxed">{description}</p>
      </div>

      {actionButton && <div className="mt-6">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
