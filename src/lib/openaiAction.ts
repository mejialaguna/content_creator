'use server';

/* eslint-disable max-len */
import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

import {
  type ContentTone,
  type ContentType,
  contentTypes,
} from './content-types';

export async function generateContent({
  contentType,
  topic,
  tone,
  keywords = [],
}: {
  contentType: ContentType;
  topic: string;
  tone: ContentTone;
  keywords?: string[];
}) {
  const typeConfig = contentTypes[contentType];

  // Create a prompt based on the template
  let prompt = typeConfig.promptTemplate
    .replace('{topic}', topic)
    .replace('{tone}', tone);

  // Add keywords if provided
  if (keywords.length > 0) {
    prompt += ` Include the following keywords: ${keywords.join(', ')}.`;
  }

  // Add system prompt based on content type and tone
  const systemPrompt = getSystemPrompt(contentType, tone);

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return completion;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
}

function getSystemPrompt(contentType: ContentType, tone: ContentTone): string {
  const basePrompt =
    'You are an expert content creator specializing in creating high-quality, engaging content.';

  const toneInstructions = {
    formal:
      'Use professional language, avoid contractions, and maintain a business-like tone.',
    casual: 'Use conversational language, contractions, and a friendly tone.',
    funny: 'Use humor, puns, and a light-hearted tone to entertain the reader.',
    persuasive:
      'Use compelling language, focus on benefits, and include clear calls to action.',
    informative:
      'Focus on facts, provide valuable information, and maintain an educational tone.',
  };

  const typeInstructions = {
    'blog-post':
      'Create a well-structured blog post with a compelling headline, engaging introduction, clear subheadings, and a strong conclusion.',
    'product-description':
      'Highlight key features and benefits, address pain points, and include a call to action.',
    'social-media':
      'Keep it concise, engaging, and shareable. Include relevant hashtags.',
    'ad-copy':
      'Focus on benefits, create urgency, and include a clear call to action.',
  };

  return `${basePrompt} ${toneInstructions[tone]} ${typeInstructions[contentType]}`;
}
