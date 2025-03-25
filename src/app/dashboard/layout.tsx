import { DashboardNav } from '@/components/dashboard-nav';

import type React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <DashboardNav />
      <div className='flex-1 container py-8 self-center'>{children}</div>
    </div>
  );
}
