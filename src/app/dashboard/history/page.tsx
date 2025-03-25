import { FileText, MessageSquare, ShoppingBag, BarChart, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function HistoryPage() {
  // Mock data for content history
  const contentHistory = [
    {
      id: 1,
      title: '10 Tips for Better Sleep',
      type: 'blog-post',
      date: '2023-04-15T10:30:00Z',
      words: 1200,
    },
    {
      id: 2,
      title: 'Summer Sale Announcement',
      type: 'social-media',
      date: '2023-04-14T14:20:00Z',
      words: 150,
    },
    {
      id: 3,
      title: 'Eco-Friendly Water Bottle',
      type: 'product-description',
      date: '2023-04-12T09:15:00Z',
      words: 300,
    },
    {
      id: 4,
      title: 'New Fitness App Launch',
      type: 'ad-copy',
      date: '2023-04-10T16:45:00Z',
      words: 120,
    },
    {
      id: 5,
      title: '5 Ways to Improve Productivity',
      type: 'blog-post',
      date: '2023-04-08T11:30:00Z',
      words: 950,
    },
  ];

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content History</h1>
        <p className="text-gray-500 dark:text-gray-400">View and manage your previously generated content.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input type="search" placeholder="Search content..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
        <Button variant="outline">Sort</Button>
      </div>

      <div className="space-y-4">
        {contentHistory.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {typeIcons[item.type as keyof typeof typeIcons]}
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {typeNames[item.type as keyof typeof typeNames]}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              <CardTitle className="text-xl">{item.title}</CardTitle>
              <CardDescription>{item.words} words</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  Export
                </Button>
                <Button size="sm">View</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled>
          Previous
        </Button>
        <div className="text-sm text-gray-500 dark:text-gray-400">Page 1 of 1</div>
        <Button variant="outline" disabled>
          Next
        </Button>
      </div>
    </div>
  );
}

