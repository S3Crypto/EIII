"use client"

import type React from "react"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useTheme } from "next-themes"
import type { UserProfile, ProfileLink } from "@/lib/types"
import { updateProfileLink, deleteProfileLink } from "@/lib/db"
import { useAuth } from "@/lib/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Plus, Link, Linkedin, Instagram, MessageCircle, Music, Video, ImageIcon } from "lucide-react"

interface LinksEditorProps {
  profile: UserProfile
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
}

const iconOptions = [
  { value: "link", label: "Link", icon: <Link className="h-4 w-4" /> },
  { value: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-4 w-4" /> },
  { value: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
  { value: "message", label: "Message", icon: <MessageCircle className="h-4 w-4" /> },
  { value: "music", label: "Music", icon: <Music className="h-4 w-4" /> },
  { value: "video", label: "Video", icon: <Video className="h-4 w-4" /> },
  { value: "image", label: "Image", icon: <ImageIcon className="h-4 w-4" /> },
]

export default function LinksEditor({ profile, setProfile }: LinksEditorProps) {
  const [links, setLinks] = useState<ProfileLink[]>(profile.links || [])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const { theme } = useTheme()
  const isDark = theme === "e3-dark"

  const addLink = () => {
    const newLink: ProfileLink = {
      id: uuidv4(),
      title: "",
      url: "",
      icon: "link",
    }

    setLinks([...links, newLink])
  }

  const updateLink = (index: number, field: keyof ProfileLink, value: string) => {
    const updatedLinks = [...links]
    updatedLinks[index] = { ...updatedLinks[index], [field]: value }
    setLinks(updatedLinks)
  }

  const saveLink = async (link: ProfileLink) => {
    if (!user) return

    setIsLoading(true)

    try {
      await updateProfileLink(user.uid, link)

      const updatedProfile = {
        ...profile,
        links: links,
      }

      setProfile(updatedProfile)

      toast({
        title: "Link saved",
        description: "Your link has been saved successfully.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error saving link:", error)
      toast({
        title: "Error",
        description: "Failed to save link. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeLink = async (index: number, linkId: string) => {
    if (!user) return

    setIsLoading(true)

    try {
      await deleteProfileLink(user.uid, linkId)

      const updatedLinks = links.filter((_, i) => i !== index)
      setLinks(updatedLinks)

      const updatedProfile = {
        ...profile,
        links: updatedLinks,
      }

      setProfile(updatedProfile)

      toast({
        title: "Link removed",
        description: "Your link has been removed successfully.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error removing link:", error)
      toast({
        title: "Error",
        description: "Failed to remove link. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`${isDark ? 'bg-off-black border-off-white/20' : 'bg-off-white border-off-black/20'}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className={isDark ? 'text-off-white' : 'text-off-black'}>Social Links</CardTitle>
          <CardDescription className={isDark ? 'text-off-white/70' : 'text-off-black/70'}>
            Add links to your social profiles or other websites
          </CardDescription>
        </div>
        <Button
          onClick={addLink}
          size="sm"
          className={isDark ?
            'bg-off-white text-off-black hover:bg-off-white/90' :
            'bg-off-black text-off-white hover:bg-off-black/90'
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </CardHeader>
      <CardContent>
        {links.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? 'text-off-white/50' : 'text-off-black/50'}`}>
            <p>No links added yet. Click &quot;Add Link&quot; to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map((link, index) => (
              <div
                key={link.id}
                className={`flex items-start space-x-4 p-4 border rounded-md ${isDark ? 'border-off-white/20' : 'border-off-black/20'
                  }`}
              >
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`link-title-${index}`}
                      className={isDark ? 'text-off-white' : 'text-off-black'}
                    >
                      Title
                    </Label>
                    <Input
                      id={`link-title-${index}`}
                      value={link.title}
                      onChange={(e) => updateLink(index, "title", e.target.value)}
                      placeholder="Link Title"
                      className={isDark ?
                        'bg-off-black border-off-white/30 text-off-white' :
                        'bg-off-white border-off-black/30 text-off-black'
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`link-url-${index}`}
                      className={isDark ? 'text-off-white' : 'text-off-black'}
                    >
                      URL
                    </Label>
                    <Input
                      id={`link-url-${index}`}
                      value={link.url}
                      onChange={(e) => updateLink(index, "url", e.target.value)}
                      placeholder="https://example.com"
                      className={isDark ?
                        'bg-off-black border-off-white/30 text-off-white' :
                        'bg-off-white border-off-black/30 text-off-black'
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`link-icon-${index}`}
                      className={isDark ? 'text-off-white' : 'text-off-black'}
                    >
                      Icon
                    </Label>
                    <Select
                      value={link.icon}
                      onValueChange={(value) => updateLink(index, "icon", value)}
                    >
                      <SelectTrigger
                        id={`link-icon-${index}`}
                        className={isDark ?
                          'bg-off-black border-off-white/30 text-off-white' :
                          'bg-off-white border-off-black/30 text-off-black'
                        }
                      >
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      <SelectContent className={isDark ?
                        'bg-off-black border-off-white/30 text-off-white' :
                        'bg-off-white border-off-black/30 text-off-black'
                      }>
                        {iconOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className={isDark ? 'focus:bg-off-white/10 text-off-white' : 'focus:bg-off-black/10 text-off-black'}
                          >
                            <div className="flex items-center">
                              {option.icon}
                              <span className="ml-2">{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => saveLink(link)}
                    disabled={isLoading || !link.title || !link.url}
                    size="sm"
                    className={isDark ?
                      'bg-off-white text-off-black hover:bg-off-white/90' :
                      'bg-off-black text-off-white hover:bg-off-black/90'
                    }
                  >
                    Save
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(index, link.id)}
                  disabled={isLoading}
                  className={isDark ? 'hover:bg-off-white/10' : 'hover:bg-off-black/10'}
                >
                  <Trash2 className={`h-4 w-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}