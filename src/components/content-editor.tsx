/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import { DownloadableContent } from './downloadableContent';

import type { ContentType } from '@/lib/content-types';

interface ContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  contentType: ContentType;
  isGenerating?: boolean;
}

export function ContentEditor({
  content,
  onContentChange,
  contentType,
  isGenerating,
}: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('preview');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const prevGeneratingState = useRef<boolean | undefined>(isGenerating);

  // Auto-scroll as content is generated
  useEffect(() => {
    if (isGenerating) {
      // For textarea in edit mode
      if (textareaRef.current && activeTab === 'edit') {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }

      // For preview div
      if (previewRef.current && activeTab === 'preview') {
        previewRef.current.scrollTop = previewRef.current.scrollHeight;
      }
    }

    if (prevGeneratingState.current && !isGenerating) {
      // For textarea in edit mode
      if (textareaRef.current && activeTab === 'edit') {
        textareaRef.current.scrollTop = 0;
      }

      // For preview div
      if (previewRef.current && activeTab === 'preview') {
        previewRef.current.scrollTop = 0;
      }
    }

    // Update the previous state for next comparison
    prevGeneratingState.current = isGenerating;
  }, [content, isGenerating, activeTab]);

  return (
    <div className='rounded-lg border bg-card'>
      <DownloadableContent
        content={content}
        contentType={contentType}
        shouldShow={true}
      />
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}
      >
        <div className='border-b'>
          <TabsList className='w-full flex justify-start rounded-none border-b-0 py-0 pl-5'>
            <TabsTrigger
              value='preview'
              className='rounded-3xl border-b-2 border-transparent data-[state=active]:border-primary'
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value='edit'
              className='rounded-3xl border-b-2 border-transparent data-[state=active]:border-primary'
            >
              Edit
            </TabsTrigger>
          </TabsList>
            <Button
              variant='ghost'
              // type='submit'
              // disabled={isGenerating || isDisabled}
              className=' bg-neutral-100 pr-5 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 rounded-none'
            >
              Save
            </Button>
        </div>
        <TabsContent value='preview' className='p-4'>
          <div
            ref={previewRef}
            className='prose dark:prose-invert max-w-none h-[55vh] overflow-y-auto no-scrollbar thinking-dots'
          >
            {isGenerating && (
              <div className='thinking-dots mb-6'>
                Writting
                <span className='ml-1' />
                <span />
                <span />
              </div>
            )}
            {content
              .split('\n')
              .map((line, i) =>
                line ? <p key={i}>{line}</p> : <br key={i} />
              )}
          </div>
        </TabsContent>
        <TabsContent value='edit' className='p-4'>
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className='min-h-[400px] resize-none font-mono overflow-auto'
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
