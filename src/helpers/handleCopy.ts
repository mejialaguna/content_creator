import { toast } from 'sonner';

export const handleCopy = async (content: string) => {
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
};
