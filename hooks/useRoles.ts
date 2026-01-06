import { useQuery } from '@tanstack/react-query'
import { rolesApi } from '@/lib/api/roles'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import toast from 'react-hot-toast'

export function useRoles() {
  const isAdmin = useIsAdmin()

  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error('You do not have permission to view roles')
      }
      const response = await rolesApi.list()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch roles')
      }
      return response
    },
    enabled: isAdmin,
  })
}

