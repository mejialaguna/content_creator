import {
  Newspaper,
  ShoppingBag,
  MessageSquare,
  FileText,
  Sliders,
  Palette,
  Edit,
  FileOutput,
  Clock,
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Newspaper className='h-10 w-10 text-primary' />,
      title: 'Blog Posts',
      description: 'Generate engaging blog posts on any topic with just a few keywords.',
    },
    {
      icon: <ShoppingBag className='h-10 w-10 text-primary' />,
      title: 'Product Descriptions',
      description: 'Create compelling product descriptions that convert browsers into buyers.',
    },
    {
      icon: <MessageSquare className='h-10 w-10 text-primary' />,
      title: 'Social Media Captions',
      description: 'Craft attention-grabbing captions for your social media posts.',
    },
    {
      icon: <FileText className='h-10 w-10 text-primary' />,
      title: 'Ad Copy',
      description: 'Write persuasive ad copy that drives clicks and conversions.',
    },
    {
      icon: <Sliders className='h-10 w-10 text-primary' />,
      title: 'AI Prompt Engineering',
      description: 'Advanced prompt engineering for better content generation.',
    },
    {
      icon: <Palette className='h-10 w-10 text-primary' />,
      title: 'Multiple Tones',
      description: 'Choose from formal, funny, persuasive, and more tones for your content.',
    },
    {
      icon: <Edit className='h-10 w-10 text-primary' />,
      title: 'Live Editing',
      description: 'Edit your generated content with a live preview in real-time.',
    },
    {
      icon: <FileOutput className='h-10 w-10 text-primary' />,
      title: 'Multiple Export Formats',
      description: 'Export your content as PDF, Markdown, or Word documents.',
    },
    {
      icon: <Clock className='h-10 w-10 text-primary' />,
      title: 'Save Time',
      description: 'Generate content in seconds instead of hours or days.',
    },
  ];

  return (
    <section id='features' className='w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900 justify-items-center'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
              Powerful Features for Content Creation
            </h2>
            <p className='mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed
            xl:text-xl/relaxed dark:text-gray-400'>
              Our AI-powered platform offers everything you need to create high-quality content quickly and easily.
            </p>
          </div>
        </div>
        <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => (
            <div key={index} className='flex flex-col items-center space-y-2 rounded-lg border p-4 bg-background'>
              {feature.icon}
              <h3 className='text-xl font-bold'>{feature.title}</h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 text-center'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

