'use client';

import {
  FileText,
  MessageSquare,
  ShoppingBag,
  BarChart,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';

import { DownloadableContent } from './downloadableContent';
import { Pagination } from './pagination';

import type { ContentType, UserGeneratedContent } from '@/lib/content-types';

interface HistoryListProps {
  contentHistory: UserGeneratedContent[];
  ok: boolean;
  contentCount: number | undefined;
  totalPages: number | undefined;
}

const typeIcons = {
  'blog-post': <FileText className='h-4 w-4' />,
  'product-description': <ShoppingBag className='h-4 w-4' />,
  'social-media': <MessageSquare className='h-4 w-4' />,
  'ad-copy': <BarChart className='h-4 w-4' />,
};

const typeNames = {
  'blog-post': 'Blog Post',
  'product-description': 'Product Description',
  'social-media': 'Social Media',
  'ad-copy': 'Ad Copy',
};

export function HistoryList({
  contentHistory,
  ok,
  contentCount,
  totalPages,
}: HistoryListProps) {
  const [selectedFilterValue, setSelectedFilterValue] = useState<
    ContentType | undefined
  >(undefined);
  const [topic, setTopic] = useState<string>('');
  const wordCount = useCallback((text: string) => {
    if (!text) return 0;
    const words = text.trim().split(/\s+/);
    return words.filter(Boolean).length;
  }, []);
  const debouncedSearch = useDebounce(topic, 500);

  const filterContentHistory = useMemo(() => {
    if (!selectedFilterValue && !debouncedSearch.trim()) {
      return contentHistory;
    }

    return contentHistory.filter((content) => {
      const matchesTopic = debouncedSearch.trim()
        ? content.topic.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
      const matchesContentType = selectedFilterValue
        ? content.contentType === selectedFilterValue
        : true;
      return matchesTopic && matchesContentType;
    });
  }, [selectedFilterValue, contentHistory, debouncedSearch]);

  const handleResetFilters = useCallback(() => {
    setSelectedFilterValue(undefined);
    setTopic('');
  }, []);

  return (
    <>
      <div className='flex items-center gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400' />
          <Input
            type='search'
            placeholder='Search by Topic...'
            className='pl-8'
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className='flex items-center gap-4 '>
          <Button
            variant='outline'
            className='bg-blue-500 text-white hover:text-blue-300 transition-all'
            onClick={() => handleResetFilters()}
          >
            Reset Filters
          </Button>
        </div>
        <Select
          onValueChange={(value: ContentType) => setSelectedFilterValue(value)}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select Content type' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(typeNames).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {!ok ? (
        <p className='mt-11 text-center text-gray-500'>
          There’s no content saved yet. Try generating something!
        </p>
      ) : (
        <>
          <div className='space-y-4'>
            {filterContentHistory.map((item) => (
              <Card key={item.id}>
                <CardHeader className='pb-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      {typeIcons[item.contentType as keyof typeof typeIcons]}
                      <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                        {typeNames[item.contentType as keyof typeof typeNames]}
                      </span>
                    </div>
                    <span className='text-sm text-gray-500 dark:text-gray-400'>
                      {new Date(item.createdAt).toDateString()}
                    </span>
                  </div>
                  <CardTitle className='text-xl'>{item.topic}</CardTitle>
                  <CardDescription>
                    {wordCount(item.generatedContent)} words
                  </CardDescription>
                </CardHeader>
                <CardFooter className='flex justify-between pt-2 flex-wrap md:flex-nowrap'>
                  <DownloadableContent
                    content={item.generatedContent}
                    contentType={item.contentType as ContentType}
                    shouldShow={false}
                  />
                  <div className='space-x-2'>
                    <Link
                      href={`/dashboard/generator/${item.contentType}/?contentId=${item.id}`}
                      className='bg-black text-white py-1.5 px-2.5 rounded-md'
                    >
                      View
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Pagination contentCount={contentCount} totalPages={totalPages} />
        </>
      )}
    </>
  );
}
