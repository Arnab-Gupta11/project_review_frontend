'use client';

import { SidebarFooter, SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export default function SidebarFooterSection() {
  const { state } = useSidebar();
  const isExpanded = state === 'expanded';

  return (
    <SidebarFooter
      className={cn(
        'border-t border-white/[0.08] bg-transparent transition-all duration-300',
        isExpanded ? 'px-4 py-4' : 'px-2 py-4',
      )}
    >
      <SidebarMenu>
        <SidebarMenuItem>
          {isExpanded ? (
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-xl px-3.5 py-3 shadow-inner">
              <p className="text-white/80 text-xs font-semibold">© 2026 Project Review</p>
              <p className="text-white/40 mt-0.5 text-[10px]">All rights reserved.</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="bg-primary/20 border border-primary/30 flex h-8 w-8 items-center justify-center rounded-lg shadow-[0_0_15px_rgba(2,224,223,0.2)]">
                <span className="text-xs font-black text-primary">P</span>
              </div>
            </div>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
