"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import type { UserProfile } from "@/lib/types"
import E3Logo from "@/components/e3-logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Linkedin, Instagram, MessageCircle, Music, Video, ImageIcon, Link as LinkIcon } from "lucide-react"

interface ClientProfileProps {
  username: string
}

export default function ClientProfile({ username }: ClientProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 2
  const { theme } = useTheme()
  const isDark = theme === "e3-dark"

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

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'linkedin':
        return <Linkedin className={`h-5 w-5 ${isDark ? 'text-off-white' : 'text-off-black'}`} />;
      case 'instagram':
        return <Instagram className={`h-5 w-5 ${isDark ? 'text-off-white' : 'text-off-black'}`} />;
      case 'message':
        return <MessageCircle className={`h-5 w-5 ${isDark ? 'text-off-white' : 'text-off-black'}`} />;
      case 'music':
        return <Music className={`h-5 w-5 ${isDark ? 'text-off-white' : 'text-off-black'}`} />;
      case 'video':
        return <Video className={`h-5 w-5 ${isDark ? 'text-off-white' : 'text-off-black'}`} />;
      case 'image':
        return <ImageIcon className={`h-5 w-5 ${isDark ? 'text-off-white' : 'text-off-black'}`} />;
      default:
        return <LinkIcon className={`h-5 w-5 ${isDark ? 'text-off-white' : 'text-off-black'}`} />;
    }
  };

  const renderMedia = () => {
    if (!profile?.mediaUrl) return null;

    switch (profile.mediaType) {
      case "music":
        return (
          <div className="w-full mt-4">
            <audio controls className="w-full">
              <source src={profile.mediaUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case "video":
        return (
          <div className="w-full mt-4">
            <video controls className="w-full max-h-64 object-contain">
              <source src={profile.mediaUrl} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>
        );
      case "image":
        return (
          <div className="w-full mt-4">
            <div className="relative w-full h-64 rounded-md overflow-hidden">
              <Image
                src={profile.mediaUrl}
                alt="Profile media"
                fill
                className="object-contain"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${isDark ? 'bg-off-black text-off-white' : 'bg-off-white text-off-black'}`}>
        <E3Logo size="md" />
        <div className={`mt-8 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDark ? 'border-off-white' : 'border-off-black'}`}></div>
        <p className="mt-4 text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${isDark ? 'bg-off-black text-off-white' : 'bg-off-white text-off-black'}`}>
        <E3Logo size="md" />
        <h1 className="mt-8 text-3xl font-bold">Profile Not Found</h1>
        <p className="mt-4 text-muted-foreground text-center max-w-md">{error || "We couldn't find this profile."}</p>
        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleRetry}
            className={isDark ? 'bg-off-white text-off-black hover:bg-off-white/90' : 'bg-off-black text-off-white hover:bg-off-black/90'}
          >
            Try Again
          </Button>
          <Button
            asChild variant="outline"
            className={isDark ? 'border-off-white text-off-white hover:bg-off-white/10' : 'border-off-black text-off-black hover:bg-off-black/10'}
          >
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center min-h-screen p-4 max-w-md mx-auto ${isDark ? 'bg-off-black text-off-white' : 'bg-off-white text-off-black'}`}>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full flex flex-col items-center space-y-6 py-8">
        {/* Logo */}
        <E3Logo size="md" />

        {/* Member Name */}
        <h1 className="text-xl font-medium text-center">Member : {profile.displayName}</h1>

        {/* Bio */}
        {profile.bio && (
          <p className="text-center">{profile.bio}</p>
        )}

        {/* Media Content */}
        {renderMedia()}

        {/* Taglines */}
        <div className="w-full space-y-2 text-center my-8">
          <p className="text-lg font-medium">STAY CONNECTED</p>
          <p className="text-lg font-medium">BUILD A COMMUNITY</p>
          <p className="text-lg font-medium">AN E3WORLD</p>
        </div>

        {/* Join Table Button */}
        <Button
          className={`rounded-full px-8 py-6 ${isDark ?
            'bg-off-white text-off-black hover:bg-off-white/90' :
            'bg-off-black text-off-white hover:bg-off-black/90'}`}
        >
          <span className="mr-2">Join Table</span>
          <span className={`inline-block w-5 h-5 rounded-full ${isDark ? 'bg-off-black' : 'bg-off-white'}`}></span>
        </Button>

        {/* E3 Button */}
        <div className="my-4">
          <Button
            variant="outline"
            className={`rounded-full px-8 py-2 ${isDark ?
              'bg-off-white text-off-black border-off-white hover:bg-off-white/90' :
              'bg-off-black text-off-white border-off-black hover:bg-off-black/90'}`}
          >
            E3
          </Button>
        </div>

        {/* Social Links */}
        {profile.links && profile.links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {profile.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center p-2 rounded-full ${isDark ? 'hover:bg-off-white/10' : 'hover:bg-off-black/10'
                  }`}
                title={link.title}
              >
                {renderIcon(link.icon)}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}