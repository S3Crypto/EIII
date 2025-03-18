"use client"

import { useTheme } from "next-themes"
import Image from "next/image"

export default function E3Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const { theme } = useTheme()
  const isDark = theme === "e3-dark"

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  // Fallback to the original component behavior if the theme system isn't working
  if (typeof theme === "undefined") {
    return (
      <div className={`${sizeClasses[size]} rounded-full border-2 border-black flex items-center justify-center`}>
        <span className={`font-bold ${size === "sm" ? "text-lg" : size === "md" ? "text-3xl" : "text-4xl"}`}>E3</span>
      </div>
    )
  }

  // Using the theme-appropriate logo
  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center`}>
      {isDark ? (
        // White logo for dark theme (off-black background)
        <div className={`${sizeClasses[size]} rounded-full border-2 border-off-white flex items-center justify-center`}>
          <span className={`font-bold text-off-white ${size === "sm" ? "text-lg" : size === "md" ? "text-3xl" : "text-4xl"}`}>E3</span>
        </div>
      ) : (
        // Black logo for light theme (off-white background)
        <div className={`${sizeClasses[size]} rounded-full border-2 border-off-black flex items-center justify-center`}>
          <span className={`font-bold text-off-black ${size === "sm" ? "text-lg" : size === "md" ? "text-3xl" : "text-4xl"}`}>E3</span>
        </div>
      )}
    </div>
  )
}