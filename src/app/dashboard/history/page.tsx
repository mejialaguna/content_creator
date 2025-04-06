import { getUserGeneratedContent } from '@/actions/getUserGeneratedContent';
import { HistoryList } from '@/components/historyList';

export default async function HistoryPage() {
  const { ok, userContent } = await getUserGeneratedContent('1');

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
