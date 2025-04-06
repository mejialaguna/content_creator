export const revalidate = 60; 

import {
  getUserStatsAndContent,
} from '@/actions/getUserGeneratedContent';
import { UserStats } from '@/components/userStats';
import { UserStatsTabs } from '@/components/userStatsTabs';

export default async function DashboardPage() {
  const { userContent, userStats } = await getUserStatsAndContent('1');

  return (
    <div className='space-y-8 px-5'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
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
