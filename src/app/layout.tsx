import { Inter } from 'next/font/google';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

import type React from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Content Generator',
  description: 'Generate high-quality content with AI',
    generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
