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

  return (
    <div className="rounded-lg border bg-card">
      <DownloadableContent
        content={content}
        contentType={contentType}
        shouldShow={true}
      />
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}
      >
        <div className="border-b">
          <TabsList className="w-full justify-start rounded-none border-b-0 py-0 px-5">
            <TabsTrigger
              value="preview"
              className="rounded-3xl border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="edit"
              className="rounded-3xl border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Edit
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="preview" className="p-4">
          <div className="prose dark:prose-invert max-w-none h-[55vh] overflow-y-auto no-scrollbar thinking-dots">
            {isGenerating && (
              <div className="thinking-dots mb-6">
                Writting
                <span className="ml-1" />
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
        <TabsContent value="edit" className="p-4">
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-[400px] resize-none font-mono"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
