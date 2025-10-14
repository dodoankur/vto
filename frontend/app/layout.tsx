import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Virtual Try-On | Try Eyewear Frames Virtually',
  description: 'Try on eyewear frames virtually with our AI-powered virtual try-on technology. Upload a selfie or use your webcam for real-time try-on experience.',
  keywords: 'virtual try-on, eyewear, glasses, frames, AR, augmented reality',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  )
}