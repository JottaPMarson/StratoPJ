"use client"

import type React from "react"

import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TooltipInfoProps {
  content: string | React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export function TooltipInfo({ content, side = "top", className }: TooltipInfoProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
            aria-label="Informações adicionais"
          >
            <InfoIcon
              className={`h-4 w-4 text-muted-foreground cursor-help transition-colors hover:text-foreground ${className}`}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs text-sm">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
