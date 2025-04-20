'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navbar({userId}: {userId: string | undefined}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className='w-full border-b bg-background'>
      <div className='container flex h-16 items-center px-4 md:px-6 justify-self-center'>
        <Link href='/' className='flex items-center gap-2'>
          <span className='text-xl font-bold'>AI Content Generator</span>
        </Link>
        <nav className='ml-auto hidden gap-6 md:flex'>
          <Link href='/#features' className='text-sm font-medium hover:underline underline-offset-4'>
            Features
          </Link>
          <Link href='/#pricing' className='text-sm font-medium hover:underline underline-offset-4'>
            Pricing
          </Link>
          {userId && (
            <Link href='/dashboard' className='text-sm font-medium hover:underline underline-offset-4'>
              Dashboard
            </Link>
          )}
        </nav>
        <div className='ml-auto flex gap-2 md:ml-4'>
          <Link href='/login'>
            <Button variant='outline'>Login</Button>
          </Link>
          <Link href='/signup'>
            <Button>Sign Up</Button>
          </Link>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className='ml-2 md:hidden'>
            <Button variant='outline' size='icon'>
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='right'>
            <nav className='flex flex-col gap-4 mt-8'>
              <Link
                href='/#features'
                className='text-sm font-medium hover:underline underline-offset-4'
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href='/#pricing'
                className='text-sm font-medium hover:underline underline-offset-4'
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href='/dashboard'
                className='text-sm font-medium hover:underline underline-offset-4'
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link href='/login' onClick={() => setIsOpen(false)}>
                <Button variant='outline' className='w-full'>
                  Login
                </Button>
              </Link>
              <Link href='/signup' onClick={() => setIsOpen(false)}>
                <Button className='w-full'>Sign Up</Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
