'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

// Custom ThemeProvider that doesn't affect auth pages
export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="e3-light"
      enableSystem={false}
      themes={["e3-light", "e3-dark"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}