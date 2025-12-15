import { useQuery } from '@tanstack/react-query'
import { assessmentsApi, AssignedAssessment } from '@/lib/api/assessments'
import { Assessment } from '@/lib/types'
import toast from 'react-hot-toast'

export function usePatientAssessments() {
  return useQuery({
    queryKey: ['patient-assessments'],
    queryFn: async () => {
      // Use getAssignedAssessments for patients to get their own assessments
      const response = await assessmentsApi.getAssignedAssessments()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch assessments')
      }
      return response.data || []
    },
    onError: (error: any) => {
      // Don't show error for 404 - endpoint might not be implemented yet
      if (error.response?.status === 404) {
        console.warn('Assessment endpoint not found - backend may not be implemented yet')
        return
      }
      const message = error.response?.data?.message || error.message || 'Failed to load assessments'
      toast.error(message)
    },
  })
}

export function usePatientAssessment(id: number) {
  return useQuery({
    queryKey: ['patient-assessment', id],
    queryFn: async () => {
      const response = await assessmentsApi.getPatientAssessment(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch assessment')
      }
      return response.data
    },
    enabled: !!id,
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to load assessment'
      toast.error(message)
    },
  })
}

