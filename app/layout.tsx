import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/app.scss'

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
        {children}
      </body>
    </html>
  )
}

