import Link from "next/link"
import { Button } from "@/components/ui/button"
import E3Logo from "@/components/e3-logo"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <E3Logo size="md" />

      <h1 className="mt-8 text-3xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-muted-foreground text-center max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>

      <Button asChild className="mt-8">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}

