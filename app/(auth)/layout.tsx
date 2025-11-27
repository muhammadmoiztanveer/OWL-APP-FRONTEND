'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Add authentication-bg class to body for auth pages
    if (typeof document !== 'undefined') {
      document.body.classList.add('authentication-bg')
      
      return () => {
        // Remove the class when leaving auth pages
        document.body.classList.remove('authentication-bg')
      }
    }
  }, [])

  useEffect(() => {
    // Initialize node-waves after scripts load
    const initWaves = () => {
      if (typeof window !== 'undefined' && (window as any).Waves) {
        ;(window as any).Waves.init()
      }
    }

    // Wait for scripts to load
    const timer = setTimeout(() => {
      initWaves()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {children}
      {/* Load necessary scripts for auth pages */}
      <Script src="/assets/libs/jquery/jquery.min.js" strategy="beforeInteractive" />
      <Script src="/assets/libs/bootstrap/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/libs/node-waves/node-waves.min.js" strategy="lazyOnload" />
    </>
  )
}

