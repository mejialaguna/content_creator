/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client';

import { Copy, FileText, FileCode, FileOutput } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { handleContentExport } from '@/helpers/handleContentExport';
import { handleCopy } from '@/helpers/handleCopy';

import type { ContentType } from '@/lib/content-types';

interface ContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  contentType: ContentType;
  isGenerating?: boolean;
}

export function ContentEditor({ content, onContentChange, contentType, isGenerating }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('preview');

  return (
    <div className='rounded-lg border bg-card'>
      <div className='flex items-center justify-between border-b p-4'>
        <h3 className='font-medium'>Content Editor</h3>
        <div className='flex space-x-2'>
          <Button variant='outline' size='sm' onClick={() => handleCopy(content)}>
            <Copy className='mr-2 h-4 w-4' />
            Copy
          </Button>
          <Button variant='outline' size='sm' onClick={() => handleContentExport('pdf', contentType, content)}>
            <FileOutput className='mr-2 h-4 w-4' />
            PDF
          </Button>
          <Button variant='outline' size='sm' onClick={() => handleContentExport('markdown', contentType, content)}>
            <FileCode className='mr-2 h-4 w-4' />
            Markdown
          </Button>
          <Button variant='outline' size='sm' onClick={() => handleContentExport('docx', contentType, content)}>
            <FileText className='mr-2 h-4 w-4' />
            Word
          </Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
        <div className='border-b'>
          <TabsList className='w-full justify-start rounded-none border-b-0 py-0 px-5'>
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
        </div>
        <TabsContent value='preview' className='p-4'>
          <div className='prose dark:prose-invert max-w-none h-[55vh] overflow-y-auto no-scrollbar thinking-dots'>
            {isGenerating && 
              <div className='thinking-dots mb-6'>
                Thinking
                <span className='ml-1'/>
                <span />
                <span />
              </div>
            }
            {content.split('\n').map((line, i) => (line ? <p key={i}>{line}</p> : <br key={i} />))}
          </div>
        </TabsContent>
        <TabsContent value='edit' className='p-4'>
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className='min-h-[400px] resize-none font-mono'
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

