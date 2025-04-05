import type OpenAI from 'openai';

/* eslint-disable max-len */
export type ContentType = 'blog-post' | 'product-description' | 'social-media' | 'ad-copy'

export type ContentTone = 'formal' | 'casual' | 'funny' | 'persuasive' | 'informative'

export type InputLabelType = 'topic' | 'tone' | 'model' | 'keywords';

export interface ContentTypeConfig {
  id: ContentType
  name: string
  description: string
  icon: string
  promptTemplate: string
  defaultTone: ContentTone
  maxLength: number
}

export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4'
export interface GenerateContentProps {
  contentType: ContentType;
  topic: string;
  tone: ContentTone;
  keywords?: string[];
  client: OpenAI;
}

export interface GeneratedContentData extends Omit<GenerateContentProps, 'client'> {
  userId: string;
  generatedContent: string;
  model: OpenAIModel;
}

export interface TabDataType extends Omit<GenerateContentProps, 'client' | 'contentType'> {
  model: OpenAIModel | '';
  generatedContent: string;
  error: string;
};

export interface ResponseStatus {
  ok: boolean;
  message?: string;
}

export interface UserStats {
  id: string;
  updatedAt: Date;
  userId: string;
  totalWords: number;
  totalContents: number;
  blogPostCount: number;
  productDescriptionCount: number;
  socialMediaCount: number;
  adCopyCount: number;
}

export interface UserStatsResponse extends ResponseStatus {
  userStats: UserStats | Record<string, never>;
}

export interface UserGeneratedContent {
  id: string;
  userId: string;
  contentType: string;
  topic: string;
  tone: string;
  keywords?: string[];
  generatedContent: string;
  createdAt: Date;
}

export interface UserGeneratedContentResponse extends ResponseStatus {
  userContent: UserGeneratedContent[];
}

export interface UserStatsAndContentResponse extends ResponseStatus {
  userStats: UserStats | Record<string, never>; 
  userContent: UserGeneratedContent[];
}

export const contentTypes: Record<ContentType, ContentTypeConfig> = {
  'blog-post': {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Create engaging blog posts on any topic',
    icon: 'FileText',
    promptTemplate:
      'Write a blog post about {topic}. The tone should be {tone}. Include a compelling headline, introduction, several key points with subheadings, and a conclusion.',
    defaultTone: 'informative',
    maxLength: 2000,
  },
  'product-description': {
    id: 'product-description',
    name: 'Product Description',
    description: 'Generate compelling product descriptions',
    icon: 'ShoppingBag',
    promptTemplate:
      'Write a product description for {topic}. The tone should be {tone}. Highlight the key features, benefits, and unique selling points.',
    defaultTone: 'persuasive',
    maxLength: 500,
  },
  'social-media': {
    id: 'social-media',
    name: 'Social Media Caption',
    description: 'Craft attention-grabbing social media posts',
    icon: 'MessageSquare',
    promptTemplate:
      'Write a social media caption about {topic}. The tone should be {tone}. Make it engaging and include relevant hashtags.',
    defaultTone: 'casual',
    maxLength: 280,
  },
  'ad-copy': {
    id: 'ad-copy',
    name: 'Ad Copy',
    description: 'Write persuasive ad copy that drives conversions',
    icon: 'BarChart',
    promptTemplate:
      'Write ad copy for {topic}. The tone should be {tone}. Focus on benefits, include a clear call to action, and keep it concise.',
    defaultTone: 'persuasive',
    maxLength: 150,
  },
};

export const contentTones: Record<ContentTone, { name: string; description: string }> = {
  formal: {
    name: 'Formal',
    description: 'Professional and business-like',
  },
  casual: {
    name: 'Casual',
    description: 'Relaxed and conversational',
  },
  funny: {
    name: 'Funny',
    description: 'Humorous and entertaining',
  },
  persuasive: {
    name: 'Persuasive',
    description: 'Convincing and compelling',
  },
  informative: {
    name: 'Informative',
    description: 'Educational and factual',
  },
};

