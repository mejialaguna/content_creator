/* eslint-disable no-console */
import { type NextRequest, NextResponse } from 'next/server';

import { generateContent } from '@/lib/openaiAction';

import type { ContentTone, ContentType, OpenAIModel } from '@/lib/content-types';


export async function POST(req: NextRequest) {
  try {
    const { contentType, topic, tone, keywords, model, shouldStream } = await req.json();

    if (!contentType || !topic || !tone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
          for await (const chunk of content) {
            controller.enqueue(encoder.encode(chunk)); // Send each chunk as it's ready
          }
          controller.close();
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
