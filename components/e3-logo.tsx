export default function E3Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full border-2 border-black flex items-center justify-center`}>
      <span className={`font-bold ${size === "sm" ? "text-lg" : size === "md" ? "text-3xl" : "text-4xl"}`}>E3</span>
    </div>
  )
}

