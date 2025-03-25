import Link from 'next/link';

import { Features } from '@/components/features';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Pricing } from '@/components/pricing';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-32 xl:py-48 justify-items-center'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
                  AI-Powered Content Generation
                </h1>
                <p className='mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400'>
                  Create high-quality blog posts, product descriptions, social media captions, and ad copy in seconds.
                </p>
              </div>
              <div className='space-x-4'>
                <Link href='/dashboard'>
                  <Button size='lg'>Get Started</Button>
                </Link>
                <Link href='#features'>
                  <Button variant='outline' size='lg'>
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Features />
        <Pricing />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

