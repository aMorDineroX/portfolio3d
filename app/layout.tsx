import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '../components/providers/toast-provider'
import { ThemeSwitch } from '../components/theme-switch'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Plateforme de Trading 3D',
  description: 'Une application de trading avec visualisation 3D utilisant Three.js, TypeScript, Tailwind CSS et Shadcn UI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <main>{children}</main>
        <ToastProvider />
        <ThemeSwitch />
      </body>
    </html>
  )
}
