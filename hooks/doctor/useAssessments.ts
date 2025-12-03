import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorApi } from '@/lib/api/doctor'
import { Assessment, AssessmentsListParams } from '@/lib/types'
import { usePermissions } from '@/hooks/usePermissions'
import toast from 'react-hot-toast'

export function useAssessments(params?: AssessmentsListParams) {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['assessments', params],
    queryFn: async () => {
      if (!hasPermission('assessment.view')) {
        throw new Error('You do not have permission to view assessments')
      }
      const response = await doctorApi.getAssessments(params)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch assessments')
      }
      return response
    },
    enabled: hasPermission('assessment.view'),
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view assessments')
      } else {
        toast.error(error.message || 'Failed to load assessments')
      }
    },
  })
}

export function useAssessment(id: number) {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['assessment', id],
    queryFn: async () => {
      if (!hasPermission('assessment.view')) {
        throw new Error('You do not have permission to view assessment')
      }
      const response = await doctorApi.getAssessment(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch assessment')
      }
      return response.data
    },
    enabled: !!id && hasPermission('assessment.view'),
  })
}

export function useReadyForReview(params?: { per_page?: number; page?: number }) {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['assessments-ready-for-review', params],
    queryFn: async () => {
      if (!hasPermission('assessment.view')) {
        throw new Error('You do not have permission to view assessments ready for review')
      }
      const response = await doctorApi.getReadyForReview(params)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch assessments ready for review')
      }
      return response
    },
    enabled: hasPermission('assessment.view'),
  })
}

export function usePatientAssessments(patientId: number) {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['patient-assessments', patientId],
    queryFn: async () => {
      if (!hasPermission('assessment.view')) {
        throw new Error('You do not have permission to view patient assessments')
      }
      const response = await doctorApi.getPatientAssessments(patientId)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch patient assessments')
      }
      return response.data
    },
    enabled: !!patientId && hasPermission('assessment.view'),
  })
}

export function useMarkAsReviewed() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async (id: number) => {
      if (!hasPermission('assessment.update')) {
        throw new Error('You do not have permission to mark assessments as reviewed')
      }
      const response = await doctorApi.markAsReviewed(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to mark assessment as reviewed')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] })
      queryClient.invalidateQueries({ queryKey: ['assessments-ready-for-review'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Assessment marked as reviewed')
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to mark assessments as reviewed')
      } else {
        toast.error(error.message || 'Failed to mark assessment as reviewed')
      }
    },
  })
}

