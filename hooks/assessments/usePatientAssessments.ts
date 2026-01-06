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
  })
}

