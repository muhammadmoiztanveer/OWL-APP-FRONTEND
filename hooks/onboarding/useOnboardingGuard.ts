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

  // ✅ NEW: Onboarding is now optional - don't force redirect
  // Patients can access dashboard without completing onboarding
  // useEffect(() => {
  //   // Don't redirect - onboarding is optional
  //   // Removed automatic redirect to onboarding
  // }, [user, authLoading, status, statusLoading, router])

  // For non-patients, always consider onboarding complete
  // For patients, onboarding is optional - always consider complete
  const isOnboardingComplete = user?.account_type !== 'patient' || true // Always true - onboarding is optional

  return {
    isOnboardingComplete,
    isLoading: authLoading || statusLoading,
  }
}
