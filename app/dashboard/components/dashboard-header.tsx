"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { useTheme } from "next-themes"
import type { UserProfile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import E3Logo from "@/components/e3-logo"
import { LogOut, ExternalLink } from "lucide-react"

interface DashboardHeaderProps {
  profile: UserProfile
}

export default function DashboardHeader({ profile }: DashboardHeaderProps) {
  const { logOut } = useAuth()
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === "e3-dark"

  const handleLogout = async () => {
    await logOut()
    router.push("/login")
  }

  return (
    <header className={`border-b ${isDark ? 'bg-off-black border-off-white/20' : 'bg-off-white border-off-black/20'}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <E3Logo size="sm" />
          <div>
            <h1 className="font-semibold">E3 Dashboard</h1>
            <p className={`text-sm ${isDark ? 'text-off-white/70' : 'text-off-black/70'}`}>Manage your profile</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            asChild
            variant="outline"
            size="sm"
            className={isDark ? 'border-off-white text-off-white hover:bg-off-white/10' : 'border-off-black text-off-black hover:bg-off-black/10'}
          >
            <Link href={`/${profile.username}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Profile
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={isDark ? 'text-off-white hover:bg-off-white/10' : 'text-off-black hover:bg-off-black/10'}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}