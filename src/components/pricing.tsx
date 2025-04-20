import { Check } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Basic content generation for personal use',
      features: [
        '5,000 words per month',
        'Blog posts & social media captions',
        'Basic editing tools',
        'Export to Markdown',
        '1 content tone',
      ],
      cta: 'Get Started',
      href: '/signup',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'Advanced features for professionals',
      features: [
        '50,000 words per month',
        'All content types',
        'Advanced editing with live preview',
        'Export to PDF, Markdown, Word',
        '5 content tones',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      href: '/signup',
      popular: true,
    },
    {
      name: 'Business',
      price: '$49',
      period: '/month',
      description: 'Enterprise-grade content generation',
      features: [
        'Unlimited words',
        'All content types',
        'Advanced editing with live preview',
        'All export formats',
        'All content tones',
        'API access',
        'Dedicated support',
        'Team collaboration',
      ],
      cta: 'Contact Sales',
      href: '/signup',
      popular: false,
    },
  ];

  return (
    <section id='pricing' className='w-full py-12 md:py-24 lg:py-32 justify-items-center'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>Simple, Transparent Pricing</h2>
            <p className='mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed
            xl:text-xl/relaxed dark:text-gray-400'>
              Choose the plan that&apos;s right for you and start generating content today.
            </p>
          </div>
        </div>
        <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 lg:grid-cols-3'>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-lg border bg-background p-6 ${
                plan.popular ? 'border-primary shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className='mb-4 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary w-fit'>
                  Most Popular
                </div>
              )}
              <h3 className='text-2xl font-bold'>{plan.name}</h3>
              <div className='mt-4 flex items-baseline'>
                <span className='text-3xl font-bold'>{plan.price}</span>
                {plan.period && <span className='ml-1 text-sm text-gray-500 dark:text-gray-400'>{plan.period}</span>}
              </div>
              <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>{plan.description}</p>
              <ul className='mt-6 space-y-3'>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className='flex items-center'>
                    <Check className='mr-2 h-4 w-4 text-primary' />
                    <span className='text-sm'>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className='mt-auto pt-6'>
                <Link href={plan.href}>
                  <Button className='w-full' variant={plan.popular ? 'default' : 'outline'}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
