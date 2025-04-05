/* eslint-disable max-len */
import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

import {
  type ContentTone,
  type ContentType,
  contentTypes,
  type OpenAIModel,
} from './content-types';

import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface GenerateOptions {
  contentType: ContentType;
  topic: string;
  tone: ContentTone;
  keywords?: string[];
  model: OpenAIModel;
  shouldStream?: boolean;
}

export async function* generateContent({
  contentType,
  topic,
  tone,
  keywords = [],
  model,
  shouldStream = false,
}: GenerateOptions) {
  const typeConfig = contentTypes[contentType];
  let prompt = typeConfig.promptTemplate
    .replace('{topic}', topic)
    .replace('{tone}', tone);

  if (keywords.length > 0) {
    prompt += ` Include the following keywords: ${keywords.join(', ')}.`;
  }

  const systemPrompt = getSystemPrompt(contentType, tone);

  const options = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ] as ChatCompletionMessageParam[],
  };

  try {
    // Handle stream if requested
    if (shouldStream) {
      const stream = await client.chat.completions.create({
        ...options,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk?.choices[0]?.delta?.content || '';
        if (content) {
          yield content; // Stream each chunk
        }
      }
    } else {
      const completion = await client.chat.completions.create(options);
      const fullContent = completion?.choices[0]?.message?.content || '';
      yield fullContent;
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to generate content. Please try again.');
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
