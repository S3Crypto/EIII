"use client"

import type React from "react"

import { useState } from "react"
import type { UserProfile } from "@/lib/types"
import { updateUserProfile } from "@/lib/db"
import { useAuth } from "@/lib/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

interface ProfileEditorProps {
  profile: UserProfile
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
}

export default function ProfileEditor({ profile, setProfile }: ProfileEditorProps) {
  const [displayName, setDisplayName] = useState(profile.displayName)
  const [username, setUsername] = useState(profile.username)
  const [bio, setBio] = useState(profile.bio || "")
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const isDarkMode = theme === "e3-dark"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setIsLoading(true)

    try {
      const updatedProfile = {
        ...profile,
        displayName,
        username,
        bio: bio || null,
      }

      await updateUserProfile(user.uid, {
        displayName,
        username,
        bio: bio || null,
      })

      setProfile(updatedProfile)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleThemeChange = async (isDark: boolean) => {
    // Change theme
    setTheme(isDark ? "e3-dark" : "e3-light")

    // Optionally save the theme preference to the user's profile
    if (!user) return

    try {
      await updateUserProfile(user.uid, {
        themePreference: isDark ? "e3-dark" : "e3-light"
      })

      toast({
        title: "Theme updated",
        description: `Your profile now uses the ${isDark ? "dark" : "light"} theme.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error updating theme preference:", error)
      toast({
        title: "Error",
        description: "Failed to save theme preference.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <p className="text-xs text-muted-foreground">This will be used for your profile URL: e3.com/{username}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme-toggle">Dark Theme</Label>
                <p className="text-xs text-muted-foreground">Use dark mode for your public profile</p>
              </div>
              <Switch
                id="theme-toggle"
                checked={isDarkMode}
                onCheckedChange={handleThemeChange}
              />
            </div>
          </div>

          <Button type="submit" className="mt-6" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}