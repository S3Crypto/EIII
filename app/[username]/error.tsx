"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import E3Logo from "@/components/e3-logo"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Profile page error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <E3Logo size="md" />

      <h1 className="mt-8 text-3xl font-bold">Something went wrong</h1>
      <p className="mt-4 text-muted-foreground text-center max-w-md">
        We encountered an error while loading this profile. Please try again later.
      </p>

      <div className="mt-8 space-x-4">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}

