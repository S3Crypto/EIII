"use client"

import { Input } from "@/components/ui/input"

import type React from "react"

import { useState, useRef } from "react"
import type { UserProfile } from "@/lib/types"
import { uploadMediaFile, updateUserProfile } from "@/lib/db"
import { useAuth } from "@/lib/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Music, Video, ImageIcon, Upload, X } from "lucide-react"

interface MediaUploaderProps {
  profile: UserProfile
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
}

export default function MediaUploader({ profile, setProfile }: MediaUploaderProps) {
  const [mediaType, setMediaType] = useState<"music" | "video" | "image">(profile.mediaType || "image")
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!user || !file) return

    setIsLoading(true)

    try {
      const mediaUrl = await uploadMediaFile(user.uid, file, mediaType)

      const updatedProfile = {
        ...profile,
        mediaUrl,
        mediaType,
      }

      setProfile(updatedProfile)

      toast({
        title: "Media uploaded",
        description: "Your media has been uploaded successfully.",
        duration: 3000,
      })

      // Reset file selection
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading media:", error)
      toast({
        title: "Error",
        description: "Failed to upload media. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveMedia = async () => {
    if (!user) return

    setIsLoading(true)

    try {
      await updateUserProfile(user.uid, {
        mediaUrl: null,
        mediaType: null,
      })

      const updatedProfile = {
        ...profile,
        mediaUrl: undefined,
        mediaType: undefined,
      }

      setProfile(updatedProfile)

      toast({
        title: "Media removed",
        description: "Your media has been removed successfully.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error removing media:", error)
      toast({
        title: "Error",
        description: "Failed to remove media. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderMediaPreview = () => {
    if (!profile.mediaUrl) return null

    switch (profile.mediaType) {
      case "music":
        return (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Current Audio:</p>
            <audio controls className="w-full">
              <source src={profile.mediaUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )
      case "video":
        return (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Current Video:</p>
            <video controls className="w-full max-h-48 object-contain">
              <source src={profile.mediaUrl} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>
        )
      case "image":
        return (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Current Image:</p>
            <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
              <img
                src={profile.mediaUrl || "/placeholder.svg"}
                alt="Profile media"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media</CardTitle>
        <CardDescription>Add music, video, or images to your profile</CardDescription>
      </CardHeader>
      <CardContent>
        {profile.mediaUrl && (
          <div className="mb-6">
            {renderMediaPreview()}

            <Button variant="outline" className="mt-4" onClick={handleRemoveMedia} disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              Remove Media
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Media Type</Label>
            <RadioGroup
              value={mediaType}
              onValueChange={(value) => setMediaType(value as "music" | "video" | "image")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="music" id="music" />
                <Label htmlFor="music" className="flex items-center">
                  <Music className="h-4 w-4 mr-2" />
                  Music
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video" className="flex items-center">
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image" className="flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Image
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="media-file">Upload File</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="media-file"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={mediaType === "music" ? "audio/*" : mediaType === "video" ? "video/*" : "image/*"}
                className="flex-1"
              />
              <Button onClick={handleUpload} disabled={isLoading || !file}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {mediaType === "music"
                ? "Supported formats: MP3, WAV, OGG"
                : mediaType === "video"
                  ? "Supported formats: MP4, WebM, OGG"
                  : "Supported formats: JPG, PNG, GIF, WebP"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

