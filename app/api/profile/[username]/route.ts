import { type NextRequest, NextResponse } from "next/server"
import { getUserProfileByUsernameServer } from "@/lib/server-db"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import type { UserProfile } from "@/lib/types"

// Extend the function timeout to 60 seconds (maximum for Hobby tier)
export const maxDuration = 60

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  const startTime = Date.now()
  console.log("API route started at:", new Date().toISOString(), "for username:", params.username)

  try {
    const username = params.username

    if (!username) {
      console.log("API route: No username provided")
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // First try the server-db function
    let profile: UserProfile | null = null
    let serverDbError: Error | null = null

    try {
      console.log("API route: Attempting server-db query for:", username)
      profile = await getUserProfileByUsernameServer(username)
      console.log("API route: Server-db query result:", profile ? "Profile found" : "No profile found")
    } catch (error) {
      serverDbError = error as Error
      console.error("API route: Server-db query failed:", serverDbError.message)
    }

    // If server-db failed or returned no profile, try direct Firestore query
    if (!profile) {
      console.log("API route: Attempting direct Firestore query for:", username)
      try {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("username", "==", username))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          profile = querySnapshot.docs[0].data() as UserProfile
          console.log("API route: Direct query found profile for:", username)
        } else {
          console.log("API route: Direct query found no profile for:", username)
        }
      } catch (directError) {
        console.error("API route: Direct Firestore query failed:", directError)
        // If both queries failed, return the server-db error
        if (serverDbError) {
          throw serverDbError
        }
        throw directError
      }
    }

    if (!profile) {
      console.log("API route: No profile found for username:", username)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const endTime = Date.now()
    console.log(`API route completed in ${endTime - startTime}ms for username: ${username}`)

    return NextResponse.json(profile)
  } catch (error) {
    console.error("API route: Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}