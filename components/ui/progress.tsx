"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  /**
   * The color of the progress indicator.
   * @default "primary"
   */
  color?: "primary" | "success" | "destructive" | "custom"
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, color = "primary", ...props }, ref) => {
    const percentage = value > max ? 100 : (value / max) * 100;

    let bgColor = "bg-gradient-to-r from-blue-500 to-blue-400";
    if (color === "success") {
      bgColor = "bg-gradient-to-r from-green-500 to-green-400";
    } else if (color === "destructive") {
      bgColor = "bg-gradient-to-r from-red-500 to-red-400";
    } else if (color === "custom") {
      // Allow custom styling via className
      bgColor = "";
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-blue-900/30",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 transition-all",
            bgColor
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
