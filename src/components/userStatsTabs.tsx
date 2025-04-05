import { FileText, ShoppingBag, MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './ui/card';

import type { UserGeneratedContentResponse } from '@/lib/content-types';

const templates = [
  {
    id: 1,
    title: 'Blog Post',
    description: 'Create engaging blog posts on any topic for your website.',
    icon: <FileText className='mr-2 h-5 w-5' />,
    href: '/dashboard/generator/blog-post',
  },
  {
    id: 3,
    title: 'Product Description',
    description:
      'Write product descriptions that spark interest and close sales.',
    icon: <ShoppingBag className='mr-2 h-5 w-5' />,
    href: '/dashboard/generator/product-description',
  },
  {
    id: 2,
    title: 'Social Media',
    description: 'Craft attention-grabbing social media posts.',
    icon: <MessageSquare className='mr-2 h-5 w-5' />,
    href: '/dashboard/generator/social-media',
  },
];

export const UserStatsTabs = ({
  userContent,
}: Omit<UserGeneratedContentResponse, 'ok'>) => {
  const wordCount = (content: string) => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  };

  const recentContent = userContent.filter((item) => {
    const createdAtDate = new Date(item.createdAt);
    return createdAtDate >= new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  });

  return (
    <Tabs defaultValue='recent' className='space-y-4'>
      <TabsList>
        <TabsTrigger value='recent'>Recent Content</TabsTrigger>
        <TabsTrigger value='templates'>Templates</TabsTrigger>
      </TabsList>
      <TabsContent value='recent' className='space-y-4'>
        <div
          className={`${!recentContent.length ? 'flex flex-col gap-3' : 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'} `}
        >
          {!recentContent.length ? (
            <span> theres no recent searches...</span>
          ) : (
            recentContent.map((content) => (
              <Card key={content.id} className='flex flex-col'>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-lg leading-5'>
                    {content.topic}
                  </CardTitle>
                  <CardDescription>
                    {content.contentType} •{' '}
                    {content.createdAt.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {wordCount(content.generatedContent)} words
                  </p>
                </CardContent>
                <CardFooter className='flex justify-between mx-0 mt-auto mb-0'>
                  <Link
                    href={`/dashboard/generator/${content.contentType}/?contentId=${content.id}`}
                    className='text-white bg-black rounded-lg px-3 py-1'
                  >
                    View
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
          <Card className='flex flex-col items-center justify-center p-8'>
            <Link
              href='/dashboard/generator/blog-post'
              className='flex flex-col items-center'
            >
              <div className='rounded-full bg-primary/10 p-3 mb-4'>
                <Plus className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-lg font-medium'>Create New Content</h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 text-center mt-2'>
                Generate blog posts, product descriptions, and more.
              </p>
            </Link>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value='templates' className='space-y-4'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {templates.map((template) => (
            <Card key={template.id} className='flex flex-col'>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  {template.icon}
                  {template.title}
                </CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link
                  href={template.href}
                  className='flex bg-black w-full text-white justify-center items-center rounded py-1.5'
                >
                  <Plus className='mr-2 h-4 w-4 text-white' />
                  Create
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};
