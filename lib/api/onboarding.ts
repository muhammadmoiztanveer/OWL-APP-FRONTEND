import { apiClient } from './client'
import {
  ApiResponse,
  OnboardingStatus,
  OnboardingStepsResponse,
  UpdateOnboardingStepRequest,
  UpdateProfileStepRequest,
  PatientProfile,
} from '@/lib/types'

export const onboardingApi = {
  /**
   * Get current onboarding status
   */
  getStatus: async (): Promise<ApiResponse<OnboardingStatus>> => {
    const response = await apiClient.instance.get<ApiResponse<OnboardingStatus>>(
      '/onboarding/status'
    )
    return response.data
  },

  /**
   * Get all onboarding steps with completion status
   */
  getSteps: async (): Promise<ApiResponse<OnboardingStepsResponse>> => {
    const response = await apiClient.instance.get<ApiResponse<OnboardingStepsResponse>>(
      '/onboarding/steps'
    )
    return response.data
  },

  /**
   * Update step completion
   */
  updateStep: async (data: UpdateOnboardingStepRequest): Promise<ApiResponse> => {
    const response = await apiClient.instance.post<ApiResponse>('/onboarding/step', data)
    return response.data
  },

  /**
   * Complete profile step (patients only)
   */
  updateProfileStep: async (
    data: UpdateProfileStepRequest
  ): Promise<ApiResponse<{ patient: PatientProfile; profile_completed: boolean }>> => {
    const response = await apiClient.instance.post<
      ApiResponse<{ patient: PatientProfile; profile_completed: boolean }>
    >('/onboarding/profile/step', data)
    return response.data
  },

  /**
   * Mark onboarding as complete
   */
  complete: async (): Promise<ApiResponse> => {
    const response = await apiClient.instance.post<ApiResponse>('/onboarding/complete')
    return response.data
  },
}
