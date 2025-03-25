/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ContentType } from './content-types';

export type ExportFormat = 'pdf' | 'markdown' | 'docx'

export async function exportContent({
  content,
  title,
  format,
  contentType,
}: {
  content: string
  title: string
  format: ExportFormat
  contentType: ContentType
}): Promise<Blob> {
  // In a real application, this would handle the actual export functionality
  // For now, we'll just return a text blob

  switch (format) {
    case 'pdf':
      // In a real app, we would use a PDF generation library
      return new Blob([content], { type: 'application/pdf' });

    case 'markdown':
      return new Blob([content], { type: 'text/markdown' });

    case 'docx':
      // In a real app, we would use a DOCX generation library
      return new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

