'use client';

import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { StudentRoutes, MentorRoutes } from '../../sidebarRoutes';
import React from 'react';

function SidebarContentSection() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile, state } = useSidebar();
  const isExpanded = state === 'expanded';

  const isStudentPortal = pathname.startsWith('/student');
  const isMentorPortal = pathname.startsWith('/mentor');

  const { portalLabel, menuItems } = React.useMemo(() => {
    if (isMentorPortal) {
      return {
        portalLabel: 'MENTOR PORTAL',
        menuItems: MentorRoutes,
      };
    }
    return {
      portalLabel: 'STUDENT PORTAL',
      menuItems: StudentRoutes,
    };
  }, [isMentorPortal]);

  return (
    <SidebarContent className={`no-scrollbar pt-4 ${isExpanded ? 'px-3' : 'px-2'}`}>
      <div className="space-y-3">
        {isExpanded && (
          <div className="px-3 pb-1">
            <span className="text-[10px] font-bold tracking-widest text-primary/80 uppercase">
              {portalLabel}
            </span>
          </div>
        )}

        <SidebarMenu className="gap-2">
          {menuItems.map((item: any) => {
            const isActive =
              pathname === item?.url ||
              (item?.url === '/student/submit' && pathname === '/student') ||
              (item?.url === '/mentor/reviews' && pathname === '/mentor');
            const Icon = item?.icon;

            return (
              <SidebarMenuItem key={item?.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={!isExpanded ? item?.title : undefined}
                  className={`rounded-xl px-3.5 py-5.5! font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/25 to-primary/10 text-primary border border-primary/35 shadow-[0_0_20px_rgba(2,224,223,0.18)] font-semibold'
                      : 'text-primary-text/80 hover:text-white hover:bg-white/[0.05] hover:border-white/[0.08] border border-transparent'
                  }`}
                >
                  <Link
                    href={item?.url}
                    onClick={() => isMobile && setOpenMobile(false)}
                    className="flex items-center gap-3"
                  >
                    {Icon && (
                      <Icon
                        size={20}
                        className={`transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-primary' : 'text-primary-text/70'
                        }`}
                      />
                    )}
                    <span className="truncate">{item?.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </div>
    </SidebarContent>
  );
}

export default SidebarContentSection;
