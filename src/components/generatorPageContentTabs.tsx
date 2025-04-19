'use client';

import {
  FileText,
  ShoppingBag,
  MessageSquare,
  BarChart,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  type ContentType,
  type ContentTone,
  contentTypes,
  contentTones,
  type OpenAIModel,
  TabDataType,
  InputLabelType,
  UserGeneratedContentById,
} from '@/lib/content-types';

interface GeneratorPageContentTabsProps {
  selectedTypeId: ContentType;
  content?: UserGeneratedContentById | undefined;
  contentId?: string;
  userId?: string;
}

export default function GeneratorPageContentTabs({
  selectedTypeId,
  content,
  contentId,
  userId,
}: GeneratorPageContentTabsProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ContentType>(selectedTypeId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDoneGenerating, setIsDoneGenerating] = useState<boolean>();
  const [error, setError] = useState('');
  const [tabData, setTabData] = useState<
    Partial<Record<ContentType, TabDataType>>
  >({});
  const isDisabled = useMemo(
    () =>
      !tabData[selectedType]?.topic ||
      !tabData[selectedType]?.tone ||
      !tabData[selectedType]?.model ||
      isDoneGenerating,
    [isDoneGenerating, selectedType, tabData]
  );

  const icons = useMemo(
    () => ({
      FileText: <FileText className='h-5 w-5' />,
      ShoppingBag: <ShoppingBag className='h-5 w-5' />,
      MessageSquare: <MessageSquare className='h-5 w-5' />,
      BarChart: <BarChart className='h-5 w-5' />,
    }),
    []
  );
  const shouldShowSavedContent = useMemo(
    () => content !== undefined && contentId !== undefined,
    [content, contentId]
  );

  const handleTabDataChange = useCallback(
    (
      valueOrEvent:
        | React.ChangeEvent<HTMLInputElement>
        | ContentTone
        | OpenAIModel,
      selectedType: ContentType,
      type: InputLabelType
    ) => {
      const value =
        (valueOrEvent as React.ChangeEvent<HTMLInputElement>)?.target?.value ??
        valueOrEvent;
      setTabData((prev) => ({
        ...prev,
        [selectedType]: {
          ...prev[selectedType],
          [type]: type === 'keywords' ? [value] : value,
        },
      }));
    },
    []
  );

  const handleGenerate = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isDisabled) {
        setError('Please fill all required fields');
        return;
      }

      setError('');
      setIsGenerating(true);
      setTabData((prev) => ({
        ...prev,
        [selectedType]: {
          ...prev[selectedType],
          generatedContent: '',
        },
      }));

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          body: JSON.stringify({
            contentType: selectedType,
            topic: tabData[selectedType]?.topic,
            tone: tabData[selectedType]?.tone || 'informative',
            model: tabData[selectedType]?.model || 'gpt-4',
            shouldStream: true,
            ...(tabData[selectedType]?.keywords &&
              tabData[selectedType]?.keywords.length > 0 && {
                keywords: tabData[selectedType]?.keywords,
              }),
            id: userId,
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
          setTabData((prev) => ({
            ...prev,
            [selectedType]: {
              ...prev[selectedType],
              generatedContent: prev[selectedType]?.generatedContent + chunk,
            },
          })); // updates live
        }
        setIsDoneGenerating(true);
      } catch (err) {
        setError('Failed to generate content. Please try again.');
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    },
    [isDisabled, selectedType, tabData, userId]
  );

  useEffect(() => {
    if (selectedTypeId) {
      setSelectedType(selectedTypeId as ContentType);
    }
  }, [selectedTypeId]);

  const onChange = useCallback(
    (value: string) => {
      setSelectedType(value as ContentType);
      router.push(`/dashboard/generator/${value}`);
    },
    [router]
  );

  return (
    <div className='space-y-8 px-2 md:px-5'>
      <div className='justify-items-center md:justify-items-start'>
        <h1 className='text-3xl font-bold tracking-tight'>Content Generator</h1>
        <p className='text-gray-500 dark:text-gray-400'>
          Generate high-quality content with AI.
        </p>
      </div>

      <div className='grid gap-8 lg:grid-cols-2'>
        <div className='space-y-6'>
          <Tabs
            defaultValue='blog-post'
            value={selectedType}
            onValueChange={onChange}
          >
            <TabsList className='grid grid-cols-4 md:grid-cols-[auto_auto_auto_auto] h-auto md:justify-evenly'>
              {Object.values(contentTypes).map((type) => (
                <TabsTrigger
                  key={type.id}
                  value={type.id}
                  className='flex lg:flex-col xl:flex-row items-center px-2'
                >
                  {icons[type.icon as keyof typeof icons]}
                  <span className='xl:ml-2 hidden sm:inline'>{type.name}</span>
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
                            value={
                              shouldShowSavedContent
                                ? content?.content?.topic
                                : tabData[selectedType]?.topic || ''
                            }
                            onChange={(e) =>
                              handleTabDataChange(e, selectedType, 'topic')
                            }
                          />
                        </div>

                        <div className='flex flex-col md:flex-row justify-between gap-4'>
                          <div className='space-y-2 flex-1'>
                            <Label htmlFor='tone'>
                              Tone{' '}
                              <span className='text-sm text-red-500'>*</span>
                            </Label>
                            <Select
                              value={
                                shouldShowSavedContent
                                  ? content?.content?.tone
                                  : tabData[selectedType]?.tone || ''
                              }
                              onValueChange={(value: ContentTone) =>
                                handleTabDataChange(
                                  value as ContentTone,
                                  selectedType,
                                  'tone'
                                )
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
                              value={
                                shouldShowSavedContent
                                  ? content?.content?.model
                                  : tabData[selectedType]?.model || ''
                              }
                              onValueChange={(value: OpenAIModel) =>
                                handleTabDataChange(
                                  value as OpenAIModel,
                                  selectedType,
                                  'model'
                                )
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
                            value={
                              shouldShowSavedContent
                                ? content?.content?.keywords?.length
                                  ? content?.content?.keywords
                                  : ''
                                : tabData[selectedType]?.keywords || ''
                            }
                            onChange={(e) =>
                              handleTabDataChange(e, selectedType, 'keywords')
                            }
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
                              Generating Content
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
          <h2 className='text-xl font-bold text-center lg:text-right'>Content Preview</h2>
          {tabData[selectedType]?.generatedContent || shouldShowSavedContent ? (
            <ContentEditor
              content={
                tabData[selectedType]?.generatedContent ||
                content?.content?.generatedContent as string
              }
              onContentChange={(e) =>
                setTabData((prev) => ({
                  ...prev,
                  [selectedType]: {
                    ...prev[selectedType],
                    generatedContent: e,
                  },
                }))
              }
              contentType={selectedType}
              isGenerating={isGenerating}
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
