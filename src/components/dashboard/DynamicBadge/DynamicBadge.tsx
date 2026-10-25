import { LucideIcon } from 'lucide-react';

interface IBadgeProps {
  text: string;
  color?: string;
  size?: 'xs' | 'sm' | 'base';
  icon?: LucideIcon;
  className?: string;
}

const DynamicBadge = ({
  text,
  color = '#02e0df',
  size = 'xs',
  icon: Icon,
  className = '',
}: IBadgeProps) => {
  const sizeClasses = {
    xs: 'px-2.5 py-0.5 text-[11px] gap-1',
    sm: 'px-3 py-1 text-xs gap-1.5',
    base: 'px-3.5 py-1.5 text-sm gap-2',
  };

  const iconSizes = {
    xs: 11,
    sm: 13,
    base: 15,
  };

  return (
    <div
      className={`inline-flex w-fit items-center justify-center rounded-full! font-medium tracking-wide capitalize backdrop-blur-md transition-all ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: `${color}1F`,
        borderColor: `${color}40`,
        borderWidth: '1px',
        borderStyle: 'solid',
        color: color,
        boxShadow: `0 0 12px ${color}1A`,
      }}
    >
      {Icon && <Icon size={iconSizes[size]} strokeWidth={2.5} />}

      <span>{text}</span>
    </div>
  );
};

export default DynamicBadge;
