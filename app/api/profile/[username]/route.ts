import { type NextRequest, NextResponse } from "next/server"
import { getUserProfileByUsernameServer } from "@/lib/server-db"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import type { UserProfile } from "@/lib/types"

// Extend the function timeout to 60 seconds (maximum for Hobby tier)
export const maxDuration = 60

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  const startTime = Date.now()
  console.log("API route started at:", new Date().toISOString())

  try {
    const username = params.username
    console.log("API route: Fetching profile for username:", username)

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // First try the server-db function with a timeout
    let profile: UserProfile | null = null

    try {
      // Set a timeout for the server-db function
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Server DB query timed out"))
        }, 5000) // 5 second timeout
      })

      // Race the server-db function against the timeout
      profile = (await Promise.race([getUserProfileByUsernameServer(username), timeoutPromise])) as UserProfile | null
    } catch (serverDbError) {
      console.error("API route: Server DB query failed or timed out:", serverDbError)
      // Continue to fallback
    }

    // If that fails, try direct client SDK access as a fallback
    if (!profile) {
      console.log("API route: Falling back to direct Firestore query")
      try {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("username", "==", username))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          profile = querySnapshot.docs[0].data() as UserProfile
          console.log("API route: Found profile via direct query")
        }
      } catch (directError) {
        console.error("API route: Error in direct query:", directError)
      }
    }

    if (!profile) {
      console.log("API route: Profile not found")
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const endTime = Date.now()
    console.log(`API route completed in ${endTime - startTime}ms`)

    return NextResponse.json(profile)
  } catch (error) {
    console.error("API route: Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

