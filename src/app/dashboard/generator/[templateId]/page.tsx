import { redirect } from 'next/navigation';

import { getUserGeneratedContentById } from '@/actions/getUserGeneratedContent';
import GeneratorPageContentTabs from '@/components/generatorPageContentTabs';
import { auth } from '@/lib/auth-no-edge';

import type { ContentType, UserGeneratedContentById } from '@/lib/content-types';

interface GeneratorPageProp {
  params: {
    templateId: ContentType;
  };
  searchParams: {
    contentId?: string;
  };
}

export default async function GeneratorPage({ params, searchParams }: GeneratorPageProp) {
  const session = await auth();

  if (!session?.user) redirect('/');

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userId = session.user.id!;
  let content: UserGeneratedContentById | undefined;

  if (searchParams.contentId) {
    content = await getUserGeneratedContentById(userId, searchParams.contentId);
  }

  return (
    <GeneratorPageContentTabs
      selectedTypeId={params.templateId}
      content={content}
      contentId={searchParams.contentId}
      userId={userId}
    />
  );
}
