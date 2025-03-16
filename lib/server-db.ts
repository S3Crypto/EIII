import { db } from "@/lib/firebase"
import { adminDb } from "@/lib/firebase-admin"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import type { UserProfile } from "@/lib/types"

// Get user profile by username - server-side safe
export async function getUserProfileByUsernameServer(username: string): Promise<UserProfile | null> {
  console.log("Fetching profile for username:", username)
  const startTime = Date.now()

  try {
    // Try using admin SDK first
    if (adminDb) {
      console.log("Using Firebase Admin SDK")
      try {
        const usersRef = adminDb.collection("users")
        const querySnapshot = await usersRef.where("username", "==", username).get()

        console.log("Admin query result:", !querySnapshot.empty)

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as UserProfile
          const endTime = Date.now()
          console.log(`Admin query completed in ${endTime - startTime}ms`)
          return userData
        }
      } catch (adminError) {
        console.error("Error using Admin SDK:", adminError)
        // Fall through to client SDK
      }
    }

    // Fallback to client SDK (for development or if admin fails)
    console.log("Using Firebase Client SDK")
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("username", "==", username))
    const querySnapshot = await getDocs(q)

    console.log("Client query result:", !querySnapshot.empty)

    if (!querySnapshot.empty) {
      const endTime = Date.now()
      console.log(`Client query completed in ${endTime - startTime}ms`)
      return querySnapshot.docs[0].data() as UserProfile
    }

    console.log("No profile found for username:", username)
    return null
  } catch (error) {
    console.error("Error fetching user profile by username:", error)
    return null
  }
}

// Get user profile by ID - server-side safe
export async function getUserProfileByIdServer(userId: string): Promise<UserProfile | null> {
  console.log("Fetching profile for user ID:", userId)
  const startTime = Date.now()

  try {
    // Try using admin SDK first
    if (adminDb) {
      console.log("Using Firebase Admin SDK")
      try {
        const userRef = adminDb.collection("users").doc(userId)
        const userDoc = await userRef.get()

        console.log("Admin query result:", userDoc.exists)

        if (userDoc.exists) {
          const endTime = Date.now()
          console.log(`Admin query completed in ${endTime - startTime}ms`)
          return userDoc.data() as UserProfile
        }
      } catch (adminError) {
        console.error("Error using Admin SDK:", adminError)
        // Fall through to client SDK
      }
    }

    // Fallback to client SDK (for development or if admin fails)
    console.log("Using Firebase Client SDK")
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    console.log("Client query result:", userSnap.exists())

    if (userSnap.exists()) {
      const endTime = Date.now()
      console.log(`Client query completed in ${endTime - startTime}ms`)
      return userSnap.data() as UserProfile
    }

    console.log("No profile found for user ID:", userId)
    return null
  } catch (error) {
    console.error("Error fetching user profile by ID:", error)
    return null
  }
}

