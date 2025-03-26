"use client"

import { Toaster } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function ToastProvider() {
  const { toasts } = useToast()
  
  return <Toaster toasts={toasts} />
}
