'use server';

import { auth } from '@/lib/auth-no-edge';
import prisma from '@/lib/prisma';

export async function updateGeneratedContent(
  contentId: string,
  content: string
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      ok: false,
      message: 'Unauthorized user',
    };
  }

  try {
    const contentData = await prisma.contentData.findUnique({
      where: {
        id_userId: {
          id: contentId,
          userId,
        },
      },
    });

    if (!contentData) {
      return {
        ok: false,
        message: 'Content not found',
      };
    }

    await prisma.contentData.update({
      where: { id_userId: { id: contentId, userId } },
      data: {
        generatedContent: content,
      },
    });

    return {
      ok: true,
      message: 'Content updated',
    };
  } catch (error) {
    return {
      ok: false,
      message: `Failed to update content: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
