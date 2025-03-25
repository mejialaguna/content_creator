import { Plus, FileText, MessageSquare, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  // Mock data for recent content
  const recentContent = [
    {
      id: 1,
      title: '10 Tips for Better Sleep',
      type: 'Blog Post',
      date: '2 hours ago',
      words: 1200,
    },
    {
      id: 2,
      title: 'Summer Sale Announcement',
      type: 'Social Media',
      date: 'Yesterday',
      words: 150,
    },
    {
      id: 3,
      title: 'Eco-Friendly Water Bottle',
      type: 'Product Description',
      date: '3 days ago',
      words: 300,
    },
  ];

  // Mock data for usage stats
  const usageStats = {
    wordsGenerated: 12500,
    wordsLimit: 50000,
    contentPieces: 15,
    percentUsed: 25,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your content and track your usage.</p>
        </div>
        <Link href="/dashboard/generator">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Content
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Words Generated</CardTitle>
            <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.wordsGenerated.toLocaleString()}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{usageStats.percentUsed}% of your monthly limit</p>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${usageStats.percentUsed}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Pieces</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.contentPieces}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Created this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Media</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+3 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Content</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentContent.map((content) => (
              <Card key={content.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                  <CardDescription>
                    {content.type} • {content.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{content.words} words</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button size="sm">View</Button>
                </CardFooter>
              </Card>
            ))}
            <Card className="flex flex-col items-center justify-center p-8">
              <Link href="/dashboard/generator" className="flex flex-col items-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">Create New Content</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                  Generate blog posts, product descriptions, and more.
                </p>
              </Link>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Blog Post
                </CardTitle>
                <CardDescription>Create engaging blog posts on any topic</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Product Description
                </CardTitle>
                <CardDescription>Generate compelling product descriptions</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Social Media
                </CardTitle>
                <CardDescription>Craft attention-grabbing social media posts</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

