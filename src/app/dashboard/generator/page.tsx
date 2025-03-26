'use client';

import {
  FileText,
  ShoppingBag,
  MessageSquare,
  BarChart,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';

import { ContentEditor } from '@/components/content-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  type ContentType,
  type ContentTone,
  contentTypes,
  contentTones,
  type OpenAIModel,
} from '@/lib/content-types';

export default function GeneratorPage() {
  const [selectedType, setSelectedType] = useState<ContentType>('blog-post');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<ContentTone | ''>('');
  const [model, setModel] = useState<OpenAIModel | ''>('');
  const [keywords, setKeywords] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const isDisabled = !topic || !tone || !model;

  const icons = {
    FileText: <FileText className='h-5 w-5' />,
    ShoppingBag: <ShoppingBag className='h-5 w-5' />,
    MessageSquare: <MessageSquare className='h-5 w-5' />,
    BarChart: <BarChart className='h-5 w-5' />,
  };

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isDisabled) {
      setError('Please fill all required fields');
      return;
    }

    setError('');
    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          contentType: selectedType,
          topic,
          tone: tone || 'informative',
          keywords: keywords
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean),
          model: model || 'gpt-4',
          shouldStream: true,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch content');
      }

      if (!res.body) {
        throw new Error('No response body');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setGeneratedContent((prev) => prev + chunk); // updates live
      }
    } catch (err) {
      setError('Failed to generate content. Please try again.');
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className='space-y-8 px-2 md:px-0'>
      <div className='justify-items-center md:justify-items-start'>
        <h1 className='text-3xl font-bold tracking-tight'>Content Generator</h1>
        <p className='text-gray-500 dark:text-gray-400'>
          Generate high-quality content with AI.
        </p>
      </div>

      <div className='grid gap-8 md:grid-cols-2'>
        <div className='space-y-6'>
          <Tabs
            defaultValue='blog-post'
            onValueChange={(value) => setSelectedType(value as ContentType)}
          >
            <TabsList className='grid grid-cols-4 md:grid-cols-[auto_auto_auto_auto]'>
              {Object.values(contentTypes).map((type) => (
                <TabsTrigger
                  key={type.id}
                  value={type.id}
                  className='flex items-center'
                >
                  {icons[type.icon as keyof typeof icons]}
                  <span className='ml-2 hidden sm:inline'>{type.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <form onSubmit={handleGenerate}>
              {Object.values(contentTypes).map((type) => (
                <TabsContent key={type.id} value={type.id}>
                  <Card>
                    <CardContent className='pt-6'>
                      <div className='space-y-4'>
                        <div>
                          <h3 className='text-lg font-medium'>{type.name}</h3>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            {type.description}
                          </p>
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='topic'>
                            Topic or Subject{' '}
                            <span className='text-sm text-red-500'>*</span>
                          </Label>
                          <Input
                            id='topic'
                            placeholder={`Enter the topic for your ${type.name.toLowerCase()}`}
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                          />
                        </div>

                        <div className='flex flex-col md:flex-row justify-between gap-4'>
                          <div className='space-y-2 flex-1'>
                            <Label htmlFor='tone'>
                              Tone{' '}
                              <span className='text-sm text-red-500'>*</span>
                            </Label>
                            <Select
                              value={tone}
                              onValueChange={(value) =>
                                setTone(value as ContentTone)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Select a tone' />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(contentTones).map(
                                  ([id, { name, description }]) => (
                                    <SelectItem key={id} value={id}>
                                      {name} - {description}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor='model'>
                              Model{' '}
                              <span className='text-sm text-red-500'>*</span>
                            </Label>
                            <Select
                              value={model}
                              onValueChange={(value) =>
                                setModel(value as OpenAIModel)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Select a Model' />
                              </SelectTrigger>
                              <SelectContent>
                                {['gpt-3.5-turbo', 'gpt-4'].map((name, id) => (
                                  <SelectItem
                                    key={`${name}-${id}`}
                                    value={name}
                                  >
                                    {name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='keywords'>Keywords (optional)</Label>
                          <Input
                            id='keywords'
                            placeholder='Enter keywords separated by commas'
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                          />
                          <p className='text-xs text-gray-500 dark:text-gray-400'>
                            Add keywords to include in your content, separated
                            by commas.
                          </p>
                        </div>

                        {error && (
                          <p className='text-sm text-red-500'>{error}</p>
                        )}

                        <Button
                          type='submit'
                          disabled={isGenerating || isDisabled}
                          className='w-full'
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              Generating...
                            </>
                          ) : (
                            'Generate Content'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </form>
          </Tabs>
        </div>

        <div className='space-y-4'>
          <h2 className='text-xl font-bold'>Content Preview</h2>
          {generatedContent ? (
            <ContentEditor
              content={generatedContent}
              onContentChange={setGeneratedContent}
              contentType={selectedType}
            />
          ) : (
            <div className='flex h-[400px] items-center justify-center rounded-lg border border-dashed p-8 text-center'>
              <div className='space-y-2'>
                <h3 className='text-lg font-medium'>
                  No content generated yet
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Fill in the form and click &quot;Generate Content&quot; to
                  create your content.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
