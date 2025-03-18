// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"

// In RootLayout component
<html lang="en">
  <body className={inter.className}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      themes={["e3-light", "e3-dark", "system"]}
      enableSystem
    >
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  </body>
</html>