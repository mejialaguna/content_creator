import { redirect } from 'next/navigation';

import { getUserGeneratedContent } from '@/actions/getUserGeneratedContent';
import { HistoryList } from '@/components/historyList';
import { auth } from '@/lib/auth-no-edge';

interface HistoryPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function HistoryPage({searchParams}:HistoryPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const take = 5;
  const session = await auth();

  if (!session?.user) redirect('/');

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userId = session.user.id!;

  const { ok, userContent, contentCount, totalPages } = await getUserGeneratedContent(userId, true, page, take);

  const contentHistory = [...userContent];

  return (
    <div className='space-y-8 p-2 md:p-4'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Content History</h1>
        <p className='text-gray-500 dark:text-gray-400'>
          View and manage your previously generated content.
        </p>
      </div>

      <HistoryList contentHistory={contentHistory} ok={ok} contentCount={contentCount} totalPages={totalPages}/>
    </div>
  );
}
