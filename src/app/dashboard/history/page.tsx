import { Search } from 'lucide-react';

import { getUserGeneratedContent } from '@/actions/getUserGeneratedContent';
import { HistoryList } from '@/components/historyList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default async function HistoryPage() {
  const { ok, userContent } = await getUserGeneratedContent('1');

  const contentHistory = [...userContent];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content History</h1>
        <p className="text-gray-500 dark:text-gray-400">
          View and manage your previously generated content.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search content..."
            className="pl-8"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      {!ok ? (
        <div className="justify-self-center mt-11">
          Theres is not content saved yet.
        </div>
      ) : (
        <HistoryList contentHistory={contentHistory} />
      )}
    </div>
  );
}
