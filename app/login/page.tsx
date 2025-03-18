"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import E3Logo from "@/components/e3-logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === "e3-dark"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await signIn(email, password)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 ${isDark ? 'bg-off-black text-off-white' : 'bg-off-white text-off-black'}`}>
      <Card className={`w-full max-w-md ${isDark ? 'bg-off-black border-off-white/20' : 'bg-off-white border-off-black/20'}`}>
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <E3Logo size="sm" />
          </div>
          <CardTitle className={`text-2xl text-center ${isDark ? 'text-off-white' : 'text-off-black'}`}>Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
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
              <Label htmlFor="email" className={isDark ? 'text-off-white' : 'text-off-black'}>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={isDark ? 'border-off-white/30 bg-off-black/50' : 'border-off-black/30 bg-off-white/50'}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className={isDark ? 'text-off-white' : 'text-off-black'}>Password</Label>
                <Link
                  href="/reset-password"
                  className={`text-sm underline-offset-4 hover:underline ${isDark ? 'text-off-white/70' : 'text-off-black/70'}`}
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={isDark ? 'border-off-white/30 bg-off-black/50' : 'border-off-black/30 bg-off-white/50'}
              />
            </div>
            <Button
              type="submit"
              className={`w-full ${isDark ?
                'bg-off-white text-off-black hover:bg-off-white/90' :
                'bg-off-black text-off-white hover:bg-off-black/90'}`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className={`text-sm ${isDark ? 'text-off-white/70' : 'text-off-black/70'}`}>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className={`underline-offset-4 hover:underline ${isDark ? 'text-off-white' : 'text-off-black'}`}
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}