'use client';

import { SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import { Logo } from '@/components/ui/Logo';

function SidebarHeaderSection() {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  return (
    <SidebarHeader className="border-b border-white/[0.08] py-4.5 flex items-center justify-center bg-transparent">
      <Logo compact={!isExpanded} className={!isExpanded ? 'justify-center w-full' : ''} />
    </SidebarHeader>
  );
}

export default SidebarHeaderSection;
