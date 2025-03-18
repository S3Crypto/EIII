import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  // Always light theme for home page
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-off-white text-off-black">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center">
            <Image
              src="/e3-logo-black.svg"
              alt="E3 Logo"
              width={96}
              height={96}
              priority
            />
          </div>
          <h2 className="mt-6 text-2xl font-semibold">Welcome to E3</h2>
        </div>

        <div className="space-y-4">
          <p className="text-lg">Create your customizable E3 member profile and connect with the community.</p>

          <div className="pt-4 space-y-4">
            <Button
              asChild
              className="w-full bg-off-black text-off-white hover:bg-off-black/90"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-off-black text-off-black hover:bg-off-black/10"
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}