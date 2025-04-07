export const revalidate = 0;

import { redirect } from 'next/navigation';

import {
  getUserStatsAndContent,
} from '@/actions/getUserGeneratedContent';
import { UserStats } from '@/components/userStats';
import { UserStatsTabs } from '@/components/userStatsTabs';
import { auth } from '@/lib/auth-no-edge';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/');

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userId = session.user.id!;

  const { userContent, userStats } = await getUserStatsAndContent(userId);

  return (
    <div className='space-y-8 px-5'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{session?.user?.name} Dashboard</h1>
          <p className='text-gray-500 dark:text-gray-400'>
            Manage your content and track your usage.
          </p>
        </div>
      </div>

      <UserStats userStats={userStats} />
      <UserStatsTabs userContent={userContent} />
    </div>
  );
}
