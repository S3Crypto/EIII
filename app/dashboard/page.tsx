"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useAuth } from "@/lib/hooks/use-auth"
import { getUserProfileById, createUserProfile } from "@/lib/db"
import type { UserProfile } from "@/lib/types"
import DashboardHeader from "./components/dashboard-header"
import ProfileEditor from "./components/profile-editor"
import LinksEditor from "./components/links-editor"
import MediaUploader from "./components/media-uploader"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === "e3-dark"

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    const fetchProfile = async () => {
      if (user) {
        try {
          setIsLoading(true)
          console.log("Dashboard: Fetching profile for user:", user.uid)
          const userProfile = await getUserProfileById(user.uid)
          console.log("Dashboard: Profile data:", userProfile)

          if (!userProfile) {
            console.log("Dashboard: No profile found, creating a basic one")
            // If no profile exists, let's create a basic one
            try {
              const email = user.email || ""
              const username = email.split("@")[0]
              const displayName = username
              console.log("Dashboard: Creating profile with:", { username, displayName })
              await createUserProfile(user.uid, username, displayName)
              console.log("Dashboard: Profile created, fetching it")
              const newProfile = await getUserProfileById(user.uid)
              console.log("Dashboard: New profile:", newProfile)
              setProfile(newProfile)
            } catch (createError) {
              console.error("Dashboard: Error creating fallback profile:", createError)
            }
          } else {
            setProfile(userProfile)
          }
        } catch (error) {
          console.error("Dashboard: Error fetching profile:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      fetchProfile()
    } else if (!loading) {
      setIsLoading(false)
    }
  }, [user, loading, router])

  if (loading || isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen w-full ${isDark ? 'bg-off-black text-off-white' : 'bg-off-white text-off-black'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDark ? 'border-off-white' : 'border-off-black'}`}></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${isDark ? 'bg-off-black text-off-white' : 'bg-off-white text-off-black'}`}>
        <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
        <p className="mb-4">You need to be logged in to access the dashboard.</p>
        <button
          onClick={() => router.push("/login")}
          className={`px-4 py-2 rounded ${isDark ? 'bg-off-white text-off-black' : 'bg-off-black text-off-white'}`}
        >
          Go to Login
        </button>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${isDark ? 'bg-off-black text-off-white' : 'bg-off-white text-off-black'}`}>
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="mb-4">We couldn&apos;t find your profile. Please try again or contact support.</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-off-black text-off-white' : 'bg-off-white text-off-black'}`}>
      <DashboardHeader profile={profile} />

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <ProfileEditor profile={profile} setProfile={setProfile} />
            <LinksEditor profile={profile} setProfile={setProfile} />
          </div>

          <div className="space-y-8">
            <MediaUploader profile={profile} setProfile={setProfile} />
          </div>
        </div>
      </main>
    </div>
  )
}