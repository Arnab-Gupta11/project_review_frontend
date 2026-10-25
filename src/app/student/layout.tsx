'use client';

import DashboardLayoutWrapper from '@/components/dashboard/layout/DashboardLayout';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}

