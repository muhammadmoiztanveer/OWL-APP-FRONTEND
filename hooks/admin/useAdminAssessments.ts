import { useQuery } from '@tanstack/react-query'
import { adminApi, AdminAssessmentsListParams } from '@/lib/api/admin'
import { Assessment } from '@/lib/types'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import toast from 'react-hot-toast'

export function useAdminAssessments(params?: AdminAssessmentsListParams) {
  const isAdmin = useIsAdmin()

  return useQuery({
    queryKey: ['admin-assessments', params],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error('Only admins can view all assessments')
      }
      const response = await adminApi.getAssessments(params)
      if (!(response as any).success) {
        throw new Error((response as any).message || 'Failed to fetch assessments')
      }
      return response
    },
    enabled: isAdmin,
  })
}

export function useAdminAssessment(id: number) {
  const isAdmin = useIsAdmin()

  return useQuery({
    queryKey: ['admin-assessment', id],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error('Only admins can view assessment details')
      }
      const response = await adminApi.getAssessment(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch assessment')
      }
      return response.data
    },
    enabled: !!id && isAdmin,
  })
}



