import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsApi } from '@/lib/api/settings'
import { StripeSettings } from '@/lib/types'
import { usePermissions } from '@/hooks/usePermissions'
import toast from 'react-hot-toast'

export function useStripeSettings() {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['stripe-settings'],
    queryFn: async () => {
      if (!hasPermission('settings.manage')) {
        throw new Error('You do not have permission to view Stripe settings')
      }
      const response = await settingsApi.getStripeSettings()
      if (!response.success) {
        throw new Error('Failed to fetch Stripe settings')
      }
      return response.data
    },
    enabled: hasPermission('settings.manage'),
  })
}

export function useTestStripeConnection() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async () => {
      if (!hasPermission('settings.manage')) {
        throw new Error('You do not have permission to test Stripe connection')
      }
      const response = await settingsApi.testStripeConnection()
      if (!response.success) {
        throw new Error(response.message || 'Failed to test Stripe connection')
      }
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['stripe-settings'], data)
      if ((data as any)?.connection_status?.connected) {
        toast.success('Stripe connection successful!')
      } else {
        toast.error((data as any)?.connection_status?.message || 'Stripe connection failed')
      }
    },
  })
}

export function useUpdateSetting() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      if (!hasPermission('settings.manage')) {
        throw new Error('You do not have permission to update settings')
      }
      const response = await settingsApi.updateSetting(key, value)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update setting')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripe-settings'] })
      toast.success('Setting updated successfully')
    },
  })
}







