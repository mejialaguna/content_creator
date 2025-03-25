'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

// eslint-disable-next-line no-duplicate-imports
import type { ThemeProviderProps } from 'next-themes';


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Ensure we only render the theme provider on the client side
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
