import { getUserGeneratedContentById } from '@/actions/getUserGeneratedContent';
import GeneratorPageContentTabs from '@/components/generatorPageContentTabs';

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
  let content: UserGeneratedContentById | undefined;

  if (searchParams.contentId) {
    content = await getUserGeneratedContentById('1', searchParams.contentId);
  }

  return (
    <GeneratorPageContentTabs
      selectedTypeId={params.templateId}
      content={content}
      contentId={searchParams.contentId}
    />
  );
}
