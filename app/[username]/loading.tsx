import E3Logo from "@/components/e3-logo"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <E3Logo size="md" />

      <div className="mt-8 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-muted-foreground">Loading profile...</p>
    </div>
  )
}

