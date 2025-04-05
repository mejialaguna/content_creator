/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { OpenAIModelModelType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';

import type {
  GeneratedContentData,
} from '@/lib/content-types';
// eslint-disable-next-line no-duplicate-imports
import type { ContentData, UserStats } from '@prisma/client';

interface addNewContentAndUpdateStatsReturnProps {
  ok: boolean;
  message: string;
  prismaTransaction: [ContentData, UserStats] | null;
}

const ContentTypeToStatsFieldMap = {
  'blog-post' : 'blogPostCount',
  'product-description' : 'productDescriptionCount',
  'social-media' : 'socialMediaCount',
  'ad-copy': 'adCopyCount',
} as const;

const ContentTypeToPrismaEnumMap = {
  'blog-post' : 'blogPost',
  'product-description' : 'productDescription',
  'social-media' : 'socialMedia',
  'ad-copy': 'adCopy',
} as const;

const ModelMap = {
  'gpt-3.5-turbo' : OpenAIModelModelType.gpt_3_5_turbo,
  'gpt-4' : OpenAIModelModelType.gpt_4,
} as const;

export async function addNewContentAndUpdateStats(
  contentData: GeneratedContentData
): Promise<addNewContentAndUpdateStatsReturnProps> {
  const wordCount = contentData.generatedContent
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  try {
    const initialCounts = {
      blogPostCount: 0,
      productDescriptionCount: 0,
      socialMediaCount: 0,
      adCopyCount: 0,
    };

    const dynamicCounts = {
      ...initialCounts,
      [ContentTypeToStatsFieldMap[contentData.contentType]]: 1,
    };

    const prismaTransaction = await prisma.$transaction([
      prisma.contentData.create({
        data: {
          userId: contentData.userId,
          contentType: ContentTypeToPrismaEnumMap[contentData.contentType],
          topic: contentData.topic,
          tone: contentData.tone,
          model: ModelMap[contentData.model],
          keywords: contentData.keywords ?? [],
          generatedContent: contentData.generatedContent,
        },
      }),
      prisma.userStats.upsert({
        where: { userId: contentData.userId },
        update: {
          totalWords: { increment: wordCount },
          totalContents: { increment: 1 },
          [ContentTypeToStatsFieldMap[contentData.contentType]]: { increment: 1 },
        },
        create: {
          userId: contentData.userId,
          totalWords: wordCount,
          totalContents: 1,
          ...dynamicCounts
        },
      }),
    ]);

    return {
      ok: true,
      message: 'Content saved successfully',
      prismaTransaction,
    };
  } catch (error) {
    return {
      ok: false,
      message: `Failed to save content: ${error instanceof Error ? error.message : String(error)}`,

      prismaTransaction: null,
    };
  }
}

export const saveContent = async (contentData: GeneratedContentData) => {
  try {
    const result = await addNewContentAndUpdateStats(contentData);

    if (!result.ok) throw new Error(result.message);
    revalidatePath('/dashboard');
    return { ...result };
  } catch (error) {
    return {
      success: false,
      message: `Content not saved: ${error instanceof Error ? error.message : String(error)}`,
      prismaTransaction: null,
    };
  }
};
