/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client';

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
import { saveAs } from 'file-saver';
import { Copy, FileText, FileCode, FileOutput } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

import type { ContentType } from '@/lib/content-types';

interface ContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  contentType: ContentType;
  isGenerating?: boolean;
}

export function ContentEditor({ content, onContentChange, contentType, isGenerating }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('preview');

  const handleCopy = useCallback(async () => {
    if (!navigator.clipboard) {
      toast('Clipboard not supported');
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      toast('Copied to clipboard');
    } catch (err) {
      toast('Failed to copy');
    }
  }, [content]);

  const handleExport = async (format: 'pdf' | 'markdown' | 'docx') => {
    let blob;
    const fileName = `exported-${contentType}.${format}`;
    
    switch (format) {
      case 'markdown': {
        const markdownContent = `# Exported Content\n\n${content}`;
        blob = new Blob([markdownContent], { type: 'text/markdown' });
        saveAs(blob, fileName);
        toast(`Exported as ${fileName}`);

        return;
      }
      case 'docx': {
        const doc = new Document({
          sections: [
            {
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: content,
                      font: 'Arial',
                      size: 24, // size is half-points, so 24 = 12pt
                    }),
                  ],
                }),
              ],
            },
          ],
        });
    
        const blob = await Packer.toBlob(doc);
        saveAs(blob, fileName);
        toast(`Exported as ${fileName}`);

        return;
      }
      case 'pdf': {
        const html2pdf = (await import('html2pdf.js')).default;
        // adding styles to prevent the text from being cut off.
        const element = document.createElement('div');
        element.style.fontSize = '14px';
        element.style.lineHeight = '1.5';
        element.style.padding = '16px';
        element.style.maxWidth = '800px';
        element.style.whiteSpace = 'pre-wrap';
        element.style.wordBreak = 'break-word';
        element.innerText = content;

        document.body.appendChild(element);

        await html2pdf()
          .from(element)
          .set({
            margin: 10,
            filename: fileName,
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          })
          .save();

        document.body.removeChild(element);

        toast(`Exported as ${fileName}`);

        return;
      }
      default:
        toast('Unsupported export format');
        return;
    }
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

