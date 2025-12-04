'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useOnboardingStatus } from '@/hooks/onboarding/useOnboarding'
import OnboardingWizard from '@/components/onboarding/OnboardingWizard'

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { data: status, isLoading: statusLoading } = useOnboardingStatus()

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    // If onboarding is already completed, redirect to dashboard
    if (!statusLoading && status?.onboarding_status === 'completed') {
      router.push('/dashboard')
      return
    }
  }, [user, authLoading, status, statusLoading, router])

  // Show loading while checking status
  if (authLoading || statusLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // Don't render if redirecting
  if (!user || status?.onboarding_status === 'completed') {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <OnboardingWizard />
    </div>
  )
}
