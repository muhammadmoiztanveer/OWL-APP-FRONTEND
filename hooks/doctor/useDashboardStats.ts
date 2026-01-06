import { useQuery } from '@tanstack/react-query'
import { doctorApi } from '@/lib/api/doctor'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

export function useDashboardStats() {
  const { hasPermission } = usePermissions()
  const { isImpersonating, impersonatingUser } = useAuth()

  // Include impersonation state in query key so data is refetched when impersonation changes
  const queryKey = [
    'dashboard-stats',
    isImpersonating ? `impersonating-${impersonatingUser?.id}` : 'normal',
  ]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!hasPermission('patient.view')) {
        throw new Error('You do not have permission to view dashboard')
      }
      const response = await doctorApi.getDashboard()
      if (!response.success) {
        throw new Error((response as any).message || 'Failed to fetch dashboard data')
      }
      return response.data
    },
    enabled: hasPermission('patient.view'),
  })
}

