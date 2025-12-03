import { useQuery } from '@tanstack/react-query'
import { assessmentsApi } from '@/lib/api/assessments'
import { Assessment } from '@/lib/types'
import toast from 'react-hot-toast'

export function usePatientAssessments() {
  return useQuery({
    queryKey: ['patient-assessments'],
    queryFn: async () => {
      const response = await assessmentsApi.getPatientAssessments()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch assessments')
      }
      return response.data || []
    },
    onError: (error: any) => {
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

