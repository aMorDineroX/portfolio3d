import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// Utiliser un chemin relatif au lieu du chemin alias @/
import { ToastProvider } from '../components/providers/toast-provider'

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
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <ToastProvider />
      </body>
    </html>
  )
}
