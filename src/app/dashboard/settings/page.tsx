'use client';

import { CreditCard, User, Bell, Shield } from 'lucide-react';
import { useState } from 'react';

import Securityform from '@/components/securityForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className='space-y-8 px-5'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
        <p className='text-gray-500 dark:text-gray-400'>Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue='account' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='account' className='flex items-center'>
            <User className='mr-2 h-4 w-4' />
            Account
          </TabsTrigger>
          <TabsTrigger value='billing' className='flex items-center'>
            <CreditCard className='mr-2 h-4 w-4' />
            Billing
          </TabsTrigger>
          <TabsTrigger value='notifications' className='flex items-center'>
            <Bell className='mr-2 h-4 w-4' />
            Notifications
          </TabsTrigger>
          <TabsTrigger value='security' className='flex items-center'>
            <Shield className='mr-2 h-4 w-4' />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value='account'>
          <Card>
            <CardHeader>
              <CardTitle>Account Information (READ ONLY FOR NOW)</CardTitle>
              <CardDescription>Update your account information and email address.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='billing'>
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan (READ ONLY FOR NOW)</CardTitle>
              <CardDescription>Manage your subscription and billing information.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-medium'>Current Plan</h3>
                    <div className='flex items-center mt-1'>
                      <span className='text-2xl font-bold'>Pro</span>
                      <Badge className='ml-2'>Active</Badge>
                    </div>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>$19/month • Renews on May 15, 2023</p>
                  </div>
                  <Button variant='outline'>Change Plan</Button>
                </div>
              </div>

              <div>
                <h3 className='font-medium mb-2'>Usage</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Words Generated</span>
                    <span className='font-medium'>12,500 / 50,000</span>
                  </div>
                  <div className='h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800'>
                    <div className='h-2 rounded-full bg-primary' style={{ width: '25%' }} />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className='font-medium mb-4'>Payment Method</h3>
                <div className='flex items-center justify-between rounded-lg border p-4'>
                  <div className='flex items-center'>
                    <div className='h-10 w-16 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center
                    text-xs font-medium'>
                      VISA
                    </div>
                    <div className='ml-4'>
                      <p className='font-medium'>•••• 4242</p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>Expires 04/2024</p>
                    </div>
                  </div>
                  <Button variant='ghost' size='sm'>
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button variant='outline'>Billing History</Button>
              <Button variant='destructive'>Cancel Subscription</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='notifications'>
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings (READ ONLY FOR NOW)</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='email-notifications'>Email Notifications</Label>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Receive notifications about your content generation.
                  </p>
                </div>
                <Switch id='email-notifications' checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='marketing-emails'>Marketing Emails</Label>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Receive emails about new features and special offers.
                  </p>
                </div>
                <Switch id='marketing-emails' checked={marketingEmails} onCheckedChange={setMarketingEmails} />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='security'>
          <Securityform />
        </TabsContent>
      </Tabs>
    </div>
  );
}

