import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center">
            <h1 className="text-3xl font-bold">E3</h1>
          </div>
          <h2 className="mt-6 text-2xl font-semibold">Welcome to E3 Profiles</h2>
        </div>

        <div className="space-y-4">
          <p className="text-lg">Create your customizable E3 member profile and connect with the community.</p>

          <div className="pt-4 space-y-4">
            <Button asChild className="w-full">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

