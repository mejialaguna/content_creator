'use client';

import { Copy, FileText, FileCode, FileOutput } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { handleContentExport } from '@/helpers/handleContentExport';
import { handleCopy } from '@/helpers/handleCopy';

import type { ContentType } from '@/lib/content-types';

interface DownloadablecontentProps {
  content: string;
  contentType: ContentType;
  shouldShow: boolean;
}

export function DownloadableContent({
  content,
  contentType,
  shouldShow = true,
}: DownloadablecontentProps) {
  return (
    <div
      className={`hidden md:flex items-center justify-between lg:justify-center ${shouldShow ? 'border-b p-4' : ''} `}
    >
      {shouldShow && <h3 className='font-medium lg:hidden'>Content Editor</h3>}
      <div className='flex space-x-2'>
        <Button variant='outline' size='sm' onClick={() => handleCopy(content)}>
          <Copy className='mr-2 h-4 w-4' />
          Copy
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => handleContentExport('pdf', contentType, content)}
        >
          <FileOutput className='mr-2 h-4 w-4' />
          PDF
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => handleContentExport('markdown', contentType, content)}
        >
          <FileCode className='mr-2 h-4 w-4' />
          Markdown
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => handleContentExport('docx', contentType, content)}
        >
          <FileText className='mr-2 h-4 w-4' />
          Word
        </Button>
      </div>
    </div>
  );
}
