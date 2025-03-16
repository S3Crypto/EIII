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

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    const fetchProfile = async () => {
      try {
        setLoading(true)
        console.log("Client component: Fetching profile for username:", username)
        const startTime = Date.now()

        const response = await fetch(`/api/profile/${username}`, {
          signal: controller.signal,
        })

        const endTime = Date.now()
        console.log(`Client component: API response received in ${endTime - startTime}ms, status:`, response.status)

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`)
        }

        const data = await response.json()
        console.log("Client component: Profile data received")
        setProfile(data)
      } catch (err: any) {
        console.error("Client component: Error fetching profile:", err)
        if (err.name === "AbortError") {
          setError("Request timed out. Please try again later.")
        } else {
          setError(err.message || "Failed to load profile")
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
  }, [username])

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
        <Button asChild className="mt-8">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    )
  }

  // Helper function to render the appropriate icon
  const renderIcon = (icon: string) => {
    switch (icon) {
      case "linkedin":
        return <Linkedin className="h-6 w-6" />
      case "instagram":
        return <Instagram className="h-6 w-6" />
      case "message":
        return <MessageCircle className="h-6 w-6" />
      case "music":
        return <Music className="h-6 w-6" />
      case "video":
        return <Video className="h-6 w-6" />
      case "image":
        return <ImageIcon className="h-6 w-6" />
      default:
        return <LinkIcon className="h-6 w-6" />
    }
  }

  // Helper function to render media
  const renderMedia = () => {
    if (!profile.mediaUrl) return null

    switch (profile.mediaType) {
      case "music":
        return (
          <div className="my-6">
            <audio controls className="w-full">
              <source src={profile.mediaUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )
      case "video":
        return (
          <div className="my-6">
            <video controls className="w-full max-h-96 object-contain">
              <source src={profile.mediaUrl} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>
        )
      case "image":
        return (
          <div className="my-6">
            <Image
              src={profile.mediaUrl || "/placeholder.svg"}
              alt="Profile media"
              width={400}
              height={400}
              className="w-full max-h-96 object-contain"
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 max-w-md mx-auto">
      <div className="w-full flex flex-col items-center space-y-6 py-8">
        {/* Logo */}
        <E3Logo size="md" />

        {/* Member Name */}
        <h1 className="text-xl font-medium text-center">Member : {profile.displayName}</h1>

        {/* Media Content */}
        {renderMedia()}

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
        <div className="flex justify-center space-x-8 mt-4">
          {profile.links && profile.links.length > 0 ? (
            profile.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
              >
                {renderIcon(link.icon)}
              </a>
            ))
          ) : (
            <>
              {/* Default social icons */}
              <a
                href="#"
                className="w-16 h-16 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-blue-500"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="w-16 h-16 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-blue-500"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="w-16 h-16 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-blue-500"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

