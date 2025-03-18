"use client"

import { useTheme } from "next-themes"
import E3Logo from "@/components/e3-logo"

export default function Loading() {
  const { theme } = useTheme()
  const isDark = theme === "e3-dark"

  return (
    <div className={`w-full min-h-screen ${isDark ? 'bg-off-black text-off-white' : 'bg-off-white text-off-black'}`}>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <E3Logo size="md" />
        <div className={`mt-8 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDark ? 'border-off-white' : 'border-off-black'}`}></div>
        <p className="mt-4 text-muted-foreground">Loading profile...</p>
      </div>
    </div>
  )
}