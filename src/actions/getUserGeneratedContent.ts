'use server';

import { OpenAIModelModelType } from '@prisma/client';

import prisma from '@/lib/prisma';

import type {
  UserGeneratedContentById,
  UserGeneratedContentResponse,
  UserStatsAndContentResponse,
  UserStatsResponse,
} from '@/lib/content-types';

const ContentTypeMap = {
  blogPost: 'blog-post',
  productDescription: 'product-description',
  socialMedia: 'social-media',
  adCopy: 'ad-copy',
} as const;

const ModelMap = {
  [OpenAIModelModelType.gpt_3_5_turbo]: 'gpt-3.5-turbo',
  [OpenAIModelModelType.gpt_4]: 'gpt-4',
} as const;

export async function getUserStats(userId: string): Promise<UserStatsResponse> {
  if (!userId || typeof userId !== 'string') {
    return {
      ok: false,
      message: 'Invalid user ID',
      userStats: {},
    };
  }

  try {
    const userStats = await prisma.userStats.findUnique({
      where: { userId },
    });

    if (!userStats) {
      return {
        ok: false,
        message: 'No user stats found',
        userStats: {},
      };
    }

    return {
      ok: true,
      userStats,
    };
  } catch (error) {
    return {
      ok: false,
      message: `Failed to retrieve user stats: ${error instanceof Error ? error.message : 'Unknown error'}`,
      userStats: {},
    };
  }
}

export async function getUserGeneratedContent(
  userId: string,
  shouldUsePagination?: boolean,
  page?: number,
  take?: number
): Promise<UserGeneratedContentResponse> {
  if (!userId || typeof userId !== 'string') {
    return {
      ok: false,
      message: 'Invalid user ID',
      userContent: [],
      contentCount: 0,
    };
  }

  try {
    const contentCount = await prisma.contentData.count({
      where: { userId },
    });

    const shouldAddPagination = shouldUsePagination && !!page && !!take;

    const userContent = await prisma.contentData.findMany({
      ...(shouldAddPagination && {
        skip: (page - 1) * take,
        // eslint-disable-next-line object-shorthand
        take: take,
      }),
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!userContent.length) {
      return {
        ok: false,
        message: 'No user content found',
        userContent: [],
        contentCount: 0,
      };
    }

    return {
      ok: true,
      userContent: userContent.map((itmes) => ({
        ...itmes,
        contentType: ContentTypeMap[itmes.contentType],
      })),
      ...(shouldAddPagination && {
        contentCount,
        totalPages: Math.ceil(contentCount / take),
      }),
    };
  } catch (error) {
    return {
      ok: false,
      message: `Failed to retrieve user content: ${error instanceof Error ? error.message : 'Unknown error'}`,
      userContent: [],
      contentCount: 0,
    };
  }
}

export async function getUserStatsAndContent(
  userId: string
): Promise<UserStatsAndContentResponse> {
  if (!userId) {
    return {
      ok: false,
      message: 'Invalid user ID',
      userStats: {},
      userContent: [],
    };
  }

  try {
    const [userStats, userContent] = await Promise.all([
      getUserStats(userId),
      getUserGeneratedContent(userId),
    ]);

    if (!userStats?.ok || !userContent?.ok) {
      return {
        ok: false,
        message: 'no user stats or content found',
        userStats: {},
        userContent: [],
      };
    }

    return {
      ok: true,
      userStats: userStats.userStats,
      userContent: userContent.userContent,
    };
  } catch (error) {
    return {
      ok: false,
      message: `Failed to retrieve user stats and content: ${error instanceof Error ? error.message : 'Unknown error'}`,
      userStats: {},
      userContent: [],
    };
  }
}

export const getUserGeneratedContentById = async (
  userId: string,
  contentId: string
): Promise<UserGeneratedContentById> => {
  if (
    !userId ||
    typeof userId !== 'string' ||
    !contentId ||
    typeof contentId !== 'string'
  ) {
    return {
      ok: false,
      message: 'Invalid user ID or content ID',
      content: null,
    };
  }

  try {
    const content = await prisma.contentData.findUnique({
      where: {
        id: contentId,
        userId,
      },
    });

    if (!content) {
      return {
        ok: false,
        message: 'No content found',
        content: null,
      };
    }

    return {
      ok: true,
      message: 'Content found',
      content: {
        ...content,
        contentType: ContentTypeMap[content.contentType],
        model: ModelMap[content.model],
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: `Failed to retrieve user stats and content: ${error instanceof Error ? error.message : 'Unknown error'}`,
      content: null,
    };
  }
};
