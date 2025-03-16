import { Suspense } from "react"
import { getUserProfileByUsernameServer } from "@/lib/server-db"
import ClientProfile from "./client-profile"
import Loading from "./loading"

// Extend the function timeout to 60 seconds (maximum for Hobby tier)
export const maxDuration = 60

interface ProfilePageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: ProfilePageProps) {
  try {
    // Set a timeout for the metadata generation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Metadata generation timed out"))
      }, 5000) // 5 second timeout
    })

    // Race the profile fetch against the timeout
    const profilePromise = getUserProfileByUsernameServer(params.username)

    let profile
    try {
      profile = await Promise.race([profilePromise, timeoutPromise])
    } catch (error) {
      console.error("Metadata generation timed out or failed:", error)
      // Return default metadata
      return {
        title: "E3 Profile",
        description: "E3 member profile",
      }
    }

    if (!profile) {
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

export default function ProfilePage({ params }: ProfilePageProps) {
  // Skip the server-side profile check and go straight to the client component
  // This avoids potential timeouts in the server component
  return (
    <Suspense fallback={<Loading />}>
      <ClientProfile username={params.username} />
    </Suspense>
  )
}

