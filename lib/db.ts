import { db, storage } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import type { UserProfile, ProfileLink } from "@/lib/types"

// Create a new user profile
export async function createUserProfile(userId: string, username: string, displayName: string) {
  console.log("Creating user profile:", { userId, username, displayName })

  try {
    const userRef = doc(db, "users", userId)

    // First check if the user document already exists
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
      console.log("User profile already exists, returning existing profile")
      return userDoc.data() as UserProfile
    }

    // Check if username is already taken
    const usernameQuery = query(collection(db, "users"), where("username", "==", username))
    const usernameSnapshot = await getDocs(usernameQuery)

    if (!usernameSnapshot.empty) {
      console.error("Username already taken:", username)
      throw new Error("Username already taken")
    }

    const newUser: UserProfile = {
      id: userId,
      username,
      displayName,
      links: [],
    }

    console.log("Setting new user document:", newUser)
    await setDoc(userRef, newUser)
    console.log("User profile created successfully")
    return newUser
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

// Get user profile by ID
export async function getUserProfileById(userId: string) {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile
  }

  return null
}

// Get user profile by username
export async function getUserProfileByUsername(username: string) {
  const usersRef = collection(db, "users")
  const q = query(usersRef, where("username", "==", username))
  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data() as UserProfile
  }

  return null
}

// Update user profile
export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  const userRef = doc(db, "users", userId)
  await updateDoc(userRef, data)
}

// Add or update a link
export async function updateProfileLink(userId: string, link: ProfileLink) {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    const userData = userSnap.data() as UserProfile
    const existingLinks = userData.links || []

    // Check if link already exists
    const linkIndex = existingLinks.findIndex((l) => l.id === link.id)

    if (linkIndex >= 0) {
      // Update existing link
      existingLinks[linkIndex] = link
    } else {
      // Add new link
      existingLinks.push(link)
    }

    await updateDoc(userRef, { links: existingLinks })
  }
}

// Delete a link
export async function deleteProfileLink(userId: string, linkId: string) {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    const userData = userSnap.data() as UserProfile
    const existingLinks = userData.links || []

    const updatedLinks = existingLinks.filter((link) => link.id !== linkId)

    await updateDoc(userRef, { links: updatedLinks })
  }
}

// Upload media file and update profile
export async function uploadMediaFile(userId: string, file: File, mediaType: "music" | "video" | "image") {
  const fileRef = ref(storage, `users/${userId}/media/${file.name}`)
  await uploadBytes(fileRef, file)
  const downloadUrl = await getDownloadURL(fileRef)

  const userRef = doc(db, "users", userId)
  await updateDoc(userRef, {
    mediaUrl: downloadUrl,
    mediaType,
  })

  return downloadUrl
}

