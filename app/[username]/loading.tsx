"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import E3Logo from "@/components/e3-logo"

export default function Loading() {
  const { theme } = useTheme()
  const isDark = theme === "e3-dark"

  return (
    <div className={`w-full min-h-screen ${isDark ? 'bg-off-black text-off-white' : 'bg-off-white text-off-black'}`}>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <E3Logo size="md" />
        <div className="mt-8 relative w-64 h-64">
          <Image
            src="/loading.gif"
            alt="Loading..."
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}