"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "defaultChecked"> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, defaultChecked, onCheckedChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState<boolean>(
      checked !== undefined ? checked : defaultChecked || false
    );

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      
      if (checked === undefined) {
        setIsChecked(newChecked);
      }
      
      onCheckedChange?.(newChecked);
    };

    return (
      <label 
        className={cn(
          "relative inline-flex items-center cursor-pointer",
          className
        )}
      >
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          checked={isChecked}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          {...props}
        />
        <div className={cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "after:absolute after:left-0.5 after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-['']",
          "peer-checked:after:translate-x-full peer-checked:after:border-white",
          "peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300",
          "dark:peer-focus:ring-blue-800",
          "bg-blue-900/40 peer-checked:bg-blue-600"
        )}
        />
      </label>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
