import { type NextRequest, NextResponse } from 'next/server';

import { generateContent } from '@/lib/ai-utils';

import type { ContentTone, ContentType } from '@/lib/content-types';

export async function POST(req: NextRequest) {
  try {
    const { contentType, topic, tone, keywords } = await req.json();

    if (!contentType || !topic || !tone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const content = await generateContent({
      contentType: contentType as ContentType,
      topic,
      tone: tone as ContentTone,
      keywords: keywords || [],
    });

    return NextResponse.json({ content });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}

