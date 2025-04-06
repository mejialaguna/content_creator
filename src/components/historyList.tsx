'use client';
import { FileText, MessageSquare, ShoppingBag, BarChart } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { DownloadableContent } from './downloadableContent';

import type { ContentType, UserGeneratedContent } from '@/lib/content-types';

interface HistoryListProps {
  contentHistory: UserGeneratedContent[];
}

const typeIcons = {
  'blog-post': <FileText className="h-4 w-4" />,
  'product-description': <ShoppingBag className="h-4 w-4" />,
  'social-media': <MessageSquare className="h-4 w-4" />,
  'ad-copy': <BarChart className="h-4 w-4" />,
};

const typeNames = {
  'blog-post': 'Blog Post',
  'product-description': 'Product Description',
  'social-media': 'Social Media',
  'ad-copy': 'Ad Copy',
};

export function HistoryList({ contentHistory }: HistoryListProps) {
  // console.log('contentHistory', contentHistory);
  const wordCount = (text: string) => {
    if (!text) return 0;

    const words = text.trim().split(/\s+/);
    return words.filter(Boolean).length;
  };

  return (
    <>
      <div className="space-y-4">
        {contentHistory.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {typeIcons[item.contentType as keyof typeof typeIcons]}
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {typeNames[item.contentType as keyof typeof typeNames]}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.createdAt).toDateString()}
                </span>
              </div>
              <CardTitle className="text-xl">{item.topic}</CardTitle>
              <CardDescription>
                {wordCount(item.generatedContent)} words
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between pt-2">
              <DownloadableContent
                content={item.generatedContent}
                contentType={item.contentType as ContentType}
                shouldShow={false}
              />
              <div className="space-x-2">
                <Link
                  href={`/dashboard/generator/${item.contentType}/?contentId=${item.id}`}
                  className="bg-black text-white py-1.5 px-2.5 rounded-md"
                >
                  View
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Page 1 of 1
        </div>
        <Button variant="outline" disabled>
          Next
        </Button>
      </div>
    </>
  );
}
