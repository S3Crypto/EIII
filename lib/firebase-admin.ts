import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

// Initialize Firebase Admin for server components
function getFirebaseAdminApp() {
  const adminApps = getApps()
  if (adminApps.length > 0) {
    return adminApps[0]
  }

  try {
    // Check if we have the required environment variables
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY || "").replace(
      /\\n/g,
      "\n",
    )

    console.log("Firebase Admin initialization:")
    console.log("- Project ID available:", !!projectId)
    console.log("- Client Email available:", !!clientEmail)
    console.log("- Private Key available:", !!privateKey && privateKey.length > 0)

    if (!projectId || !clientEmail || !privateKey) {
      console.error("Missing Firebase Admin credentials")
      return null
    }

    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error)
    return null
  }
}

// Try to initialize admin app, but provide fallbacks for development
let adminApp
let adminDb
let adminAuth

try {
  adminApp = getFirebaseAdminApp()
  if (adminApp) {
    console.log("Firebase Admin initialized successfully")
    adminDb = getFirestore(adminApp)
    adminAuth = getAuth(adminApp)
  } else {
    console.log("Firebase Admin initialization failed, will use client SDK")
  }
} catch (error) {
  console.error("Could not initialize Firebase Admin, using client SDK as fallback:", error)
}

export { adminApp, adminDb, adminAuth }

