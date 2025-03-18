"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { createUserProfile } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signUp, user } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Create the user account
      const userCredential = await signUp(email, password)

      // Get the user ID from the newly created account
      if (userCredential && userCredential.user) {
        // Create the user profile in Firestore
        await createUserProfile(userCredential.user.uid, username, displayName)
        router.push("/dashboard")
      } else {
        throw new Error("Failed to create user account")
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-off-white text-off-black">
      <Card className="w-full max-w-md bg-off-white border-off-black/20">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="/e3-logo-black.svg"
              alt="E3 Logo"
              width={48}
              height={48}
              priority
            />
          </div>
          <CardTitle className="text-2xl text-center text-off-black">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your information to create your E3 profile</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-off-black">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-off-black/30 bg-off-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-off-black">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-off-black/30 bg-off-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-off-black">Username</Label>
              <Input
                id="username"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-off-black/30 bg-off-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-off-black">Display Name</Label>
              <Input
                id="displayName"
                placeholder="Your Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="border-off-black/30 bg-off-white/50"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-off-black text-off-white hover:bg-off-black/90"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-off-black/70">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline-offset-4 hover:underline text-off-black"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}