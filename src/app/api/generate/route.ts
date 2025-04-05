/* eslint-disable no-console */
import { type NextRequest, NextResponse } from 'next/server';

import { saveContent } from '@/actions/saveGeneratedContent';
import { streamAndCollectContent } from '@/helpers/streamAndCollect';
import { generateContent } from '@/lib/openaiAction';

import type { ContentTone, ContentType, OpenAIModel } from '@/lib/content-types';


export async function POST(req: NextRequest) {
  try {
    const { contentType, topic, tone, keywords, model, shouldStream, id } = await req.json();
    const missingFields = [];

    if (!contentType) missingFields.push('contentType');
    if (!topic) missingFields.push('topic');
    if (!tone) missingFields.push('tone');

    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid user id' }, { status: 400 });
    }

    const encoder = new TextEncoder();
    const content = await generateContent({
      contentType: contentType as ContentType,
      topic,
      tone: tone as ContentTone,
      keywords: keywords || [],
      model: model as OpenAIModel,
      shouldStream: shouldStream || false,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const fullContent = await streamAndCollectContent(content, controller, encoder);

          saveContent({
            userId: id,
            contentType,
            topic,
            tone,
            model,
            keywords,
            generatedContent: fullContent,
          }).catch((err) => {
            console.error('Background save failed:', err);
          });

        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });
  
    return new Response(readableStream, {
      headers: { 'Content-Type': 'text/plain' },
    });

  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
