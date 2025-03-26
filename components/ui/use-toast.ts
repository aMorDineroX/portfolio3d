// Inspired by react-hot-toast library
import { useState, useEffect, useCallback } from "react"

export type ToastProps = {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
}

export type Toast = ToastProps

const TOAST_REMOVE_DELAY = 1000000

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(
    ({ title, description, variant, duration = 5000 }: Omit<ToastProps, "id">) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast = { id, title, description, variant, duration }
      
      setToasts((currentToasts) => [...currentToasts, newToast])

      setTimeout(() => {
        setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id))
      }, duration)

      return id
    },
    []
  )

  const dismiss = useCallback((toastId?: string) => {
    setToasts((currentToasts) => {
      if (toastId) {
        return currentToasts.filter((t) => t.id !== toastId)
      }
      return []
    })
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}
