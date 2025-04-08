export const revalidate = 5;

import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth-no-edge';

import type { Metadata, ResolvingMetadata } from 'next';

export interface PageProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: PageProps,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const template = params.slug;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    title: template,
      description: `AI generated ${template}`,
    openGraph: {
      title: template,
      description: `AI generated ${template}`,
    },
  };
}

export default async function CheckoutLayout({
 children
}: PageProps) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return <>{children}</>;
}
