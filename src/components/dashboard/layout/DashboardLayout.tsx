'use client';

import { Suspense } from 'react';
import NavigationBar from '@/components/dashboard/navigationBar/NavigationBar';
import { AppSidebar } from '@/components/dashboard/sidebar/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-transparent">
        <NavigationBar />
        <main className="text-primary-text relative min-h-[calc(100vh-65px)] w-full p-4 sm:p-6 lg:p-8">
          <Suspense
            fallback={
              <div className="flex min-h-[400px] items-center justify-center p-8 text-center">
                <div className="border-primary/20 border-t-primary h-8 w-8 animate-spin rounded-full border-2" />
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

