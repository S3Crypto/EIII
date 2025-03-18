"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function E3Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const { theme } = useTheme()
  const isDark = theme === "e3-dark"
  const [imageError, setImageError] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const sizes = {
    sm: { width: 48, height: 48 },
    md: { width: 96, height: 96 },
    lg: { width: 128, height: 128 },
  }

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  // Text fallback if image fails to load or during SSR
  if (imageError || !mounted) {
    return (
      <div className={`${sizeClasses[size]} rounded-full border-2 ${isDark ? 'border-off-white' : 'border-off-black'} flex items-center justify-center`}>
        <span className={`font-bold ${isDark ? 'text-off-white' : 'text-off-black'} ${size === "sm" ? "text-lg" : size === "md" ? "text-3xl" : "text-4xl"}`}>E3</span>
      </div>
    );
  }

  // Using the theme-appropriate logo
  return (
    <div className="flex items-center justify-center">
      <Image
        src={isDark ? "/e3-logo-white.svg" : "/e3-logo-black.svg"}
        alt="E3 Logo"
        width={sizes[size].width}
        height={sizes[size].height}
        priority
        onError={() => setImageError(true)}
      />
    </div>
  )
}