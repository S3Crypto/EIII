export interface UserProfile {
  id: string
  username: string
  displayName: string
  bio?: string
  links: ProfileLink[]
  mediaUrl?: string
  mediaType?: "music" | "video" | "image"
  themePreference?: "e3-light" | "e3-dark"
}

export interface ProfileLink {
  id: string
  title: string
  url: string
  icon: string
}