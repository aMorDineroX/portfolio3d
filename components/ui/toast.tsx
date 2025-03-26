import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ToastProps } from "@/components/ui/use-toast"

const Toaster = ({ toasts }: { toasts: ToastProps[] }) => {
  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col p-4 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}

const Toast = ({
  id,
  title,
  description,
  variant = "default",
}: ToastProps) => {
  const [isVisible, setIsVisible] = React.useState(true)

  if (!isVisible) return null

  let bgColor = "bg-[#16213e] border-blue-900/50"
  if (variant === "destructive") {
    bgColor = "bg-gradient-to-r from-red-900/90 to-red-800/80 border-red-700/50"
  } else if (variant === "success") {
    bgColor = "bg-gradient-to-r from-green-900/90 to-green-800/80 border-green-700/50"
  }

  return (
    <div
      className={cn(
        "flex items-start w-96 p-4 rounded-md shadow-lg backdrop-blur-sm border",
        bgColor,
        "animate-in slide-in-from-right-full duration-300"
      )}
    >
      <div className="flex-1">
        {title && <h3 className="font-medium text-white">{title}</h3>}
        {description && <p className="text-sm text-gray-200/80">{description}</p>}
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="p-1 rounded-full hover:bg-blue-800/50 text-white/80"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export { Toaster, Toast }
