import { useQuery } from '@tanstack/react-query'
import { doctorApi } from '@/lib/api/doctor'
import { usePermissions } from '@/hooks/usePermissions'
import toast from 'react-hot-toast'

export function useDashboardStats() {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      if (!hasPermission('patient.view')) {
        throw new Error('You do not have permission to view dashboard')
      }
      const response = await doctorApi.getDashboard()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch dashboard data')
      }
      return response.data
    },
    enabled: hasPermission('patient.view'),
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view dashboard')
      } else {
        toast.error(error.message || 'Failed to load dashboard data')
      }
    },
  })
}

