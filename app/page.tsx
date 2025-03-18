"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import E3Logo from "@/components/e3-logo"
import { useTheme } from "next-themes"

export default function Home() {
  const { theme } = useTheme()
  const isDark = theme === "e3-dark"

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${isDark ? 'bg-off-black text-off-white' : 'bg-off-white text-off-black'}`}>
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center">
          <E3Logo size="md" />
          <h2 className="mt-6 text-2xl font-semibold">Welcome to E3</h2>
        </div>

        <div className="space-y-4">
          <p className="text-lg">Create your customizable E3 member profile and connect with the community.</p>

          <div className="pt-4 space-y-4">
            <Button
              asChild
              className={`w-full ${isDark ?
                'bg-off-white text-off-black hover:bg-off-white/90' :
                'bg-off-black text-off-white hover:bg-off-black/90'}`}
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className={`w-full ${isDark ?
                'border-off-white text-off-white hover:bg-off-white/10' :
                'border-off-black text-off-black hover:bg-off-black/10'}`}
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}