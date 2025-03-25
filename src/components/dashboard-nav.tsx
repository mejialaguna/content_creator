'use client';

import { Menu, User, Plus, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function DashboardNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      active: pathname === '/dashboard',
    },
    {
      href: '/dashboard/generator',
      label: 'Content Generator',
      active: pathname === '/dashboard/generator',
    },
    {
      href: '/dashboard/history',
      label: 'History',
      active: pathname === '/dashboard/history',
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      active: pathname === '/dashboard/settings',
    },
  ];

  return (
    <header className='w-full border-b bg-background'>
      <div className='container flex h-16 items-center px-4 md:px-6 justify-self-center'>
        <Link href='/' className='flex items-center gap-2'>
          <span className='text-xl font-bold'>AI Content Generator</span>
        </Link>
        <nav className='ml-auto hidden gap-6 md:flex'>
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium ${
                route.active
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className='ml-auto flex items-center gap-2 md:ml-4'>
          <Link href='/dashboard/generator'>
            <Button size='sm' className='hidden md:flex'>
              <Plus className='mr-2 h-4 w-4' />
              New Content
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <User className='h-5 w-5' />
                <span className='sr-only'>User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href='/dashboard/settings'>
                  <Settings className='mr-2 h-4 w-4' />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className='mr-2 h-4 w-4' />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`text-sm font-medium ${
                    route.active
                      ? 'text-primary'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
              <Link href='/dashboard/generator' onClick={() => setIsOpen(false)}>
                <Button className='w-full'>
                  <Plus className='mr-2 h-4 w-4' />
                  New Content
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
