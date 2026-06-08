import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ServiceWorkerRegistrar } from '@/components/ServiceWorkerRegistrar'

export const metadata: Metadata = {
  title: 'MD Translator',
  description: 'Translate markdown files from English to Chinese, paragraph by paragraph',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MD Translator',
  },
  icons: {
    apple: '/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#6366f1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  )
}
