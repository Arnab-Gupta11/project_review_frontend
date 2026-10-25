'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, LucideIcon, Plus } from 'lucide-react';
import Link from 'next/link';

interface DynamicButtonProps {
  type?: 'submit' | 'button';
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'danger' | 'secondary';
  disabled?: boolean;
  isLoading?: boolean;
  icon?: LucideIcon | null;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
}

const DynamicActionButton = ({
  type = 'button',
  label,
  href,
  onClick,
  className,
  variant = 'default',
  disabled = false,
  isLoading = false,
  icon: Icon = Plus,
  showIcon = false,
  iconPosition = 'right',
}: DynamicButtonProps) => {
  const variantStyles = {
    default: 'bg-primary text-[#030f16] border-primary/90 hover:bg-primary/90 shadow-[0_0_20px_rgba(2,224,223,0.3)] hover:shadow-[0_0_30px_rgba(2,224,223,0.5)]',
    outline: 'bg-white/[0.04] backdrop-blur-md border-white/[0.12] text-primary-text hover:bg-white/[0.08] hover:border-primary/50 hover:text-primary shadow-xs',
    danger: 'bg-danger/90 text-white border-danger/80 hover:bg-danger shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    secondary: 'bg-white/[0.05] backdrop-blur-md border-primary/40 hover:bg-primary/10 text-primary shadow-[0_0_15px_rgba(2,224,223,0.15)]',
  };

  const combinedClasses = cn(
    'group relative h-11 text-xs sm:h-12 w-fit cursor-pointer sm:text-base transition-all duration-300 border px-8 active:scale-95 flex items-center justify-center gap-2 font-semibold overflow-hidden rounded-xl',
    variantStyles[variant],
    className,
  );

  const buttonContent = (
    <>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        showIcon && Icon && iconPosition === 'left' && <Icon size={18} strokeWidth={2.5} />
      )}
      <span className="relative z-10 text-sm">{label}</span>
      {!isLoading && showIcon && Icon && iconPosition === 'right' && (
        <Icon size={18} strokeWidth={2.5} />
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <Button asChild className={combinedClasses}>
        <Link href={href} className="flex items-center">
          {buttonContent}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type={type}
      onClick={onClick}
      className={combinedClasses}
      disabled={disabled || isLoading}
    >
      {buttonContent}
    </Button>
  );
};

export default DynamicActionButton;
