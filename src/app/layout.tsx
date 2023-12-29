import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/sidebar/sidebar'
import SpeechBar from '@/components/topbar/speechBar'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Scribe',
  description: 'AI Notes Generation and Rretrieval',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={cn("relative flex h-screen flex flex-row items-start justify-start overflow-hidden")}>
          <SpeechBar />
          <Sidebar />
          <div className={cn("h-screen w-full flex flex-row justify-center items-center")}>
            {children}
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
