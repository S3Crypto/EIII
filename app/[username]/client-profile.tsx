"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { UserProfile } from "@/lib/types"
import E3Logo from "@/components/e3-logo"
import { Button } from "@/components/ui/button"
import { Linkedin, Instagram, MessageCircle, Music, Video, ImageIcon, LinkIcon } from "lucide-react"

interface ClientProfileProps {
  username: string
}

export default function ClientProfile({ username }: ClientProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 2

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    const fetchProfile = async () => {
      try {
        setLoading(true)
        console.log(`Client component: Fetching profile for username: ${username} (Attempt ${retryCount + 1}/${maxRetries + 1})`)
        const startTime = Date.now()

        const response = await fetch(`/api/profile/${encodeURIComponent(username)}`, {
          signal: controller.signal,
          cache: 'no-store' // Ensure we're not getting a cached 404 response
        })

        const endTime = Date.now()
        console.log(`Client component: API response received in ${endTime - startTime}ms, status:`, response.status)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Profile not found")
          } else {
            throw new Error(`Failed to fetch profile: ${response.status}`)
          }
        }

        const data = await response.json()
        console.log("Client component: Profile data received:", data ? "Success" : "Empty data")

        if (!data) {
          throw new Error("Empty profile data received")
        }

        setProfile(data)
        setError(null)
      } catch (err: any) {
        console.error("Client component: Error fetching profile:", err)
        if (err.name === "AbortError") {
          setError("Request timed out. Please try again later.")
        } else {
          setError(err.message || "Failed to load profile")
        }

        // Retry logic for recoverable errors
        if (retryCount < maxRetries && err.name !== "AbortError" && err.message !== "Profile not found") {
          setRetryCount(retryCount + 1)
          return; // This will trigger the useEffect again due to retryCount change
        }
      } finally {
        setLoading(false)
        clearTimeout(timeoutId)
      }
    }

    fetchProfile()

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [username, retryCount])

  const handleRetry = () => {
    setRetryCount(0)
    setError(null)
    setLoading(true)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <E3Logo size="md" />
        <div className="mt-8 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <E3Logo size="md" />
        <h1 className="mt-8 text-3xl font-bold">Profile Not Found</h1>
        <p className="mt-4 text-muted-foreground text-center max-w-md">{error || "We couldn't find this profile."}</p>
        <div className="mt-8 flex gap-4">
          <Button onClick={handleRetry}>Try Again</Button>
          <Button asChild variant="outline">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Rest of the component remains the same...
  // The renderIcon and renderMedia functions would go here

  return (
    <div className="flex flex-col items-center min-h-screen p-4 max-w-md mx-auto">
      <div className="w-full flex flex-col items-center space-y-6 py-8">
        {/* Logo */}
        <E3Logo size="md" />

        {/* Member Name */}
        <h1 className="text-xl font-medium text-center">Member : {profile.displayName}</h1>

        {/* Media Content */}
        {/* renderMedia() would be called here */}

        {/* Taglines */}
        <div className="w-full space-y-2 text-center my-8">
          <p className="text-lg font-medium">STAY CONNECTED</p>
          <p className="text-lg font-medium">BUILD A COMMUNITY</p>
          <p className="text-lg font-medium">AN E3WORLD</p>
        </div>

        {/* Join Table Button */}
        <Button className="rounded-full px-8 py-6 bg-black text-white hover:bg-gray-800">
          <span className="mr-2">Join Table</span>
          <span className="inline-block w-5 h-5 bg-white rounded-full"></span>
        </Button>

        {/* E3 Button */}
        <div className="my-4">
          <Button
            variant="outline"
            className="rounded-full px-8 py-2 bg-black text-white border-black hover:bg-gray-800"
          >
            E3
          </Button>
        </div>

        {/* Social Links */}
        {/* Social links rendering would go here */}
      </div>
    </div>
  )
}