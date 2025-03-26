import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

import type { ContentType } from '@/lib/content-types';
export const handleContentExport = async (
  format: 'pdf' | 'markdown' | 'docx',
  contentType: ContentType,
  content: string
) => {
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
