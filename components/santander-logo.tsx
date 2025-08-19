import { cn } from "@/lib/utils"

interface SantanderLogoProps {
  className?: string
}

export function SantanderLogo({ className }: SantanderLogoProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md bg-santander-600 text-white font-bold",
        className,
      )}
    >
      SP
    </div>
  )
}
