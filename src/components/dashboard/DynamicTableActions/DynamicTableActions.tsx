'use client';

import {
  Ban,
  Check,
  Eye,
  Loader2,
  MessageCircle,
  Pencil,
  Trash2,
  Mail,
  X,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

export type ActionType =
  'edit' | 'delete' | 'view' | 'save' | 'close' | 'suspend' | 'message' | 'activate' | 'deactivate' | 'email';

interface ActionItem {
  type: ActionType;
  label?: string;
  onClick?: () => void;
  href?: string;
  isLoading?: boolean;
  className?: string;
}

interface DynamicTableActionsProps {
  actions: ActionItem[];
}

const DynamicTableActions = ({ actions }: DynamicTableActionsProps) => {
  const iconMap = {
    edit: {
      icon: Pencil,
      defaultLabel: 'Edit',
      color: '#34796f',
    },
    delete: {
      icon: Trash2,
  Mail,
      defaultLabel: 'Delete',
      color: '#dc3545',
    },
    view: {
      icon: Eye,
      defaultLabel: 'View',
      color: '#64748b',
    },
    save: {
      icon: Check,
      defaultLabel: 'Save',
      color: '#28a745',
    },
    close: {
      icon: X,
      defaultLabel: 'Cancel',
      color: '#64748b',
    },
    suspend: {
      icon: Ban,
      defaultLabel: 'Suspend',
      color: '#dc3545',
    },
    message: {
      icon: MessageCircle,
      defaultLabel: 'Message',
      color: '#34796f',
    },
    activate: {
      icon: CheckCircle,
      defaultLabel: 'Activate',
      color: '#10b981',
    },
    deactivate: {
      icon: Ban,
      defaultLabel: 'Deactivate',
      color: '#ff8a4c',
    },
    email: {
      icon: Mail,
      defaultLabel: 'Email',
      color: '#3b82f6',
    },
  };

  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => {
        const config = iconMap[action.type];

        if (!config) return null;

        const Icon = config.icon;

        const dynamicStyle = {
          color: config.color,
          backgroundColor: `${config.color}20`,
          borderColor: `${config.color}40`,
        };

        const commonClass = `group flex items-center gap-1.5 px-3 py-1.5 rounded-lg! border text-xs font-medium backdrop-blur-md transition-all shadow-xs ${
          action.isLoading
            ? 'opacity-50 cursor-not-allowed select-none'
            : 'cursor-pointer hover:brightness-125 hover:shadow-[0_0_12px_rgba(255,255,255,0.1)] active:scale-95'
        } ${action.className || ''}`;

        const content = (
          <>
            {action.isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Icon size={14} className="transition-transform group-hover:scale-110" />
            )}
            <span>{action.label || config.defaultLabel}</span>
          </>
        );

        if (action.href) {
          return (
            <Link
              key={index}
              href={action.isLoading ? '#' : action.href}
              className={commonClass}
              style={dynamicStyle}
              onClick={(e) => {
                if (action.isLoading) e.preventDefault();
              }}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={index}
            type="button"
            disabled={action.isLoading}
            onClick={(e) => {
              e.stopPropagation();
              if (!action.isLoading) {
                action.onClick?.();
              }
            }}
            className={commonClass}
            style={dynamicStyle}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
};

export default DynamicTableActions;
