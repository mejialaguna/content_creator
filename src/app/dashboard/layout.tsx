import { redirect } from 'next/navigation';

import { DashboardNav } from '@/components/dashboard-nav';
import { auth } from '@/lib/auth-no-edge';

import type React from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  if (!session?.user) redirect('/');

  return (
    <div className='flex min-h-screen flex-col'>
      <DashboardNav/>
      <div className='flex-1 container py-8 self-center'>{children}</div>
    </div>
  );
}
