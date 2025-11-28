import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/app.scss'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Minible - Admin Dashboard',
  description: 'Professional Next.js Admin Dashboard Template',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="/assets/css/bootstrap.css" id="bootstrap-style" rel="stylesheet" type="text/css" />
        <link href="/assets/css/icons.css" id="icons-style" rel="stylesheet" type="text/css" />
        <link href="/assets/css/app.css" id="app-style" rel="stylesheet" type="text/css" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}

