'use server';

import prisma from '@/lib/prisma';

import type {
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
  userId: string
): Promise<UserGeneratedContentResponse> {
  if (!userId || typeof userId !== 'string') {
    return {
      ok: false,
      message: 'Invalid user ID',
      userContent: [],
    };
  }

  try {
    const userContent = await prisma.contentData.findMany({
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
      };
    }

    return {
      ok: true,
      userContent: userContent.map((itmes) => ({
        ...itmes,
        contentType: ContentTypeMap[itmes.contentType]
      }))
    };
  } catch (error) {
    return {
      ok: false,
      message: `Failed to retrieve user content: ${error instanceof Error ? error.message : 'Unknown error'}`,
      userContent: [],
    };
  }
}

export async function getUserStatsAndContent(userId: string): Promise<UserStatsAndContentResponse> {
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
