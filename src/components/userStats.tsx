import { FileText, MessageSquare } from 'lucide-react';
import React from 'react';

import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

import type { UserStatsResponse } from '@/lib/content-types';

export const UserStats = ({ userStats }: Omit<UserStatsResponse, 'ok'>) => {
  const usageStats = {
    wordsGenerated: userStats?.totalWords || 0,
    wordsLimit: 5000,
    contentPieces: userStats?.productDescriptionCount || 0,
    percentUsed: userStats?.totalWords ? (userStats.totalWords / 5000) * 100 : 0,
  };

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Words Generated</CardTitle>
          <FileText className='h-4 w-4 text-gray-500 dark:text-gray-400' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{usageStats.wordsGenerated.toLocaleString()}</div>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {usageStats.percentUsed.toFixed(1)}% of your monthly limit
          </p>
          <div className='mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800'>
            <div
              className='h-2 rounded-full bg-primary'
              style={{ width: `${usageStats.percentUsed}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Products Description</CardTitle>
          <MessageSquare className='h-4 w-4 text-gray-500 dark:text-gray-400' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{usageStats.contentPieces}</div>
          <p className='text-xs text-gray-500 dark:text-gray-400'>Created this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Blog Posts</CardTitle>
          <FileText className='h-4 w-4 text-gray-500 dark:text-gray-400' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{userStats?.blogPostCount ?? 0}</div>
          <p className='text-xs text-gray-500 dark:text-gray-400'>Created this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Social Media</CardTitle>
          <MessageSquare className='h-4 w-4 text-gray-500 dark:text-gray-400' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{userStats?.socialMediaCount ?? 0}</div>
          <p className='text-xs text-gray-500 dark:text-gray-400'>Created this month</p>
        </CardContent>
      </Card>
    </div>
  );
};
