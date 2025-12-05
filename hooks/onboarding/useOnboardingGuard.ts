import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useOnboardingStatus } from './useOnboarding'

/**
 * Hook to guard routes and redirect to onboarding if incomplete
 * Use this in pages that require completed onboarding
 */
export function useOnboardingGuard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { data: status, isLoading: statusLoading } = useOnboardingStatus()

  useEffect(() => {
    // Don't redirect if still loading or not authenticated
    if (authLoading || statusLoading || !user) {
      return
    }

    // Only patients need onboarding - skip check for admins and doctors
    if (user.account_type !== 'patient') {
      return
    }

    // Redirect to onboarding if status is pending or in_progress
    if (status && status.onboarding_status !== 'completed') {
      router.push('/onboarding')
    }
  }, [user, authLoading, status, statusLoading, router])

  // For non-patients, always consider onboarding complete
  const isOnboardingComplete = user?.account_type !== 'patient' || status?.onboarding_status === 'completed'

  return {
    isOnboardingComplete,
    isLoading: authLoading || statusLoading,
  }
}
