"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
    const isDark = theme === "e3-dark"

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(isDark ? "e3-light" : "e3-dark")}
            aria-label="Toggle theme"
            className={isDark ?
                "border-off-white text-off-white hover:bg-off-white/10" :
                "border-off-black text-off-black hover:bg-off-black/10"}
        >
            {isDark ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </Button>
    )
}