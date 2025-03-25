/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client';

import { Copy, FileText, FileCode, FileOutput } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import type { ContentType } from '@/lib/content-types';


interface ContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  contentType: ContentType;
}

export function ContentEditor({ content, onContentChange, contentType }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('preview');

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast('Copied to clipboard', {
      description: 'Content has been copied to your clipboard',
    });
  };

  const handleExport = (format: 'pdf' | 'markdown' | 'docx') => {
    // In a real app, this would handle the export functionality
    // For now, we'll just show a toast
    toast(`Export as ${format.toUpperCase()}`, {
      description: `Your content has been exported as ${format.toUpperCase()}`,
    });
  };

  return (
    <div className='rounded-lg border bg-card'>
      <div className='flex items-center justify-between border-b p-4'>
        <h3 className='font-medium'>Content Editor</h3>
        <div className='flex space-x-2'>
          <Button variant='outline' size='sm' onClick={handleCopy}>
            <Copy className='mr-2 h-4 w-4' />
            Copy
          </Button>
          <Button variant='outline' size='sm' onClick={() => handleExport('pdf')}>
            <FileOutput className='mr-2 h-4 w-4' />
            PDF
          </Button>
          <Button variant='outline' size='sm' onClick={() => handleExport('markdown')}>
            <FileCode className='mr-2 h-4 w-4' />
            Markdown
          </Button>
          <Button variant='outline' size='sm' onClick={() => handleExport('docx')}>
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
          <div className='prose dark:prose-invert max-w-none h-[55vh] overflow-y-auto no-scrollbar'>
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

