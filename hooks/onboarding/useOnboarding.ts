import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { onboardingApi } from '@/lib/api/onboarding'
import {
  UpdateOnboardingStepRequest,
  UpdateProfileStepRequest,
} from '@/lib/types'
import toast from 'react-hot-toast'

/**
 * Get current onboarding status
 */
export function useOnboardingStatus() {
  return useQuery({
    queryKey: ['onboarding', 'status'],
    queryFn: async () => {
      const response = await onboardingApi.getStatus()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch onboarding status')
      }
      return response.data
    },
    retry: 1,
  })
}

/**
 * Get all onboarding steps with completion status
 */
export function useOnboardingSteps() {
  return useQuery({
    queryKey: ['onboarding', 'steps'],
    queryFn: async () => {
      const response = await onboardingApi.getSteps()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch onboarding steps')
      }
      return response.data
    },
    retry: 1,
  })
}

/**
 * Update onboarding step completion
 */
export function useUpdateOnboardingStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateOnboardingStepRequest) => {
      const response = await onboardingApi.updateStep(data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update step')
      }
      return response
    },
    onSuccess: () => {
      // Invalidate and refetch onboarding data
      queryClient.invalidateQueries({ queryKey: ['onboarding'] })
    },
  })
}

/**
 * Update patient profile step
 */
export function useUpdateProfileStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProfileStepRequest) => {
      const response = await onboardingApi.updateProfileStep(data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update profile step')
      }
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch onboarding data
      queryClient.invalidateQueries({ queryKey: ['onboarding'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })
    },
  })
}

/**
 * Complete onboarding
 */
export function useCompleteOnboarding() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await onboardingApi.complete()
      if (!response.success) {
        throw new Error(response.message || 'Failed to complete onboarding')
      }
      return response
    },
    onSuccess: () => {
      // Invalidate and refetch onboarding data
      queryClient.invalidateQueries({ queryKey: ['onboarding'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })
      toast.success('Onboarding completed successfully!')
    },
  })
}
