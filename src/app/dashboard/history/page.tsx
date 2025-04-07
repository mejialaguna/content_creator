import { redirect } from 'next/navigation';

import { getUserGeneratedContent } from '@/actions/getUserGeneratedContent';
import { HistoryList } from '@/components/historyList';
import { auth } from '@/lib/auth-no-edge';

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user) redirect('/');

  const userId = session.user.id;
  const { ok, userContent } = await getUserGeneratedContent(userId as string);

  const contentHistory = [...userContent];

  return (
    <div className='space-y-8 p-2 md:p-4'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Content History</h1>
        <p className='text-gray-500 dark:text-gray-400'>
          View and manage your previously generated content.
        </p>
      </div>

      <HistoryList contentHistory={contentHistory} ok={ok}/>
    </div>
  );
}
