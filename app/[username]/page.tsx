import { Suspense } from "react"
import { getUserProfileByUsernameServer } from "@/lib/server-db"
import ClientProfile from "./client-profile"
import Loading from "./loading"
import { notFound } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"

// Extend the function timeout to 60 seconds (maximum for Hobby tier)
export const maxDuration = 60

interface ProfilePageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: ProfilePageProps) {
  try {
    console.log("Generating metadata for username:", params.username)

    // Try to get the profile - with a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Metadata generation timed out"))
      }, 5000) // 5 second timeout
    })

    const profilePromise = getUserProfileByUsernameServer(params.username)

    let profile
    try {
      profile = await Promise.race([profilePromise, timeoutPromise])
      console.log("Metadata generation - profile found:", profile ? "Yes" : "No")
    } catch (error) {
      console.error("Metadata generation failed:", error)
      return {
        title: "E3 Profile",
        description: "E3 member profile",
      }
    }

    if (!profile) {
      console.log("Metadata generation - no profile found")
      return {
        title: "Profile Not Found | E3",
      }
    }

    return {
      title: `${profile.displayName} | E3 Member`,
      description: `E3 member profile for ${profile.displayName}`,
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "E3 Profile",
      description: "E3 member profile",
    }
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  console.log("ProfilePage rendering for username:", params.username)

  // Validate the username parameter
  if (!params.username) {
    console.error("ProfilePage: No username provided")
    return notFound()
  }

  // Get the user's profile to determine their theme preference
  let themePreference = "e3-light" // Default theme

  try {
    const profile = await getUserProfileByUsernameServer(params.username)
    if (profile && profile.themePreference) {
      themePreference = profile.themePreference
    }
  } catch (error) {
    console.error("Error fetching profile theme preference:", error)
  }

  return (
    <ThemeProvider defaultTheme={themePreference}>
      <Suspense fallback={<Loading />}>
        <ClientProfile username={params.username} />
      </Suspense>
    </ThemeProvider>
  )
}