import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Login</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' type='email' placeholder='m@example.com' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' type='password' />
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='remember'
                className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
              />
              <label htmlFor='remember' className='text-sm text-gray-500 dark:text-gray-400'>
                Remember me
              </label>
            </div>
            <Link href='/forgot-password' className='text-sm font-medium text-primary hover:underline'>
              Forgot password?
            </Link>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <Button className='w-full'>Login</Button>
          <div className='text-center text-sm'>
            Don&apos;t have an account?{' '}
            <Link href='/signup' className='font-medium text-primary hover:underline'>
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

