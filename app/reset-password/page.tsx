"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/use-auth"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import E3Logo from "@/components/e3-logo"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "e3-dark"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to send reset email")
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
          <CardTitle className={`text-2xl text-center ${isDark ? 'text-off-white' : 'text-off-black'}`}>Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className={`mb-4 border ${isDark ? 'border-green-500 text-green-400' : 'border-green-500 text-green-600'}`}>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Password reset email sent. Please check your inbox.</AlertDescription>
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
            <Button
              type="submit"
              className={`w-full ${isDark ?
                'bg-off-white text-off-black hover:bg-off-white/90' :
                'bg-off-black text-off-white hover:bg-off-black/90'}`}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className={`text-sm ${isDark ? 'text-off-white/70' : 'text-off-black/70'}`}>
            Remember your password?{" "}
            <Link
              href="/login"
              className={`underline-offset-4 hover:underline ${isDark ? 'text-off-white' : 'text-off-black'}`}
            >
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}