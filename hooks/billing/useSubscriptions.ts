import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { billingApi } from '@/lib/api/billing'
import {
  Subscription,
  SubscriptionsListParams,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  CancelSubscriptionRequest,
} from '@/lib/types'
import { usePermissions } from '@/hooks/usePermissions'
import toast from 'react-hot-toast'

export function useSubscriptions(params?: SubscriptionsListParams) {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['subscriptions', params],
    queryFn: async () => {
      if (!hasPermission('billing.manage')) {
        throw new Error('You do not have permission to view subscriptions')
      }
      const response = await billingApi.getSubscriptions(params)
      if (!response.success) {
        throw new Error('Failed to fetch subscriptions')
      }
      return response
    },
    enabled: hasPermission('billing.manage'),
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view subscriptions')
      } else {
        toast.error(error.message || 'Failed to load subscriptions')
      }
    },
  })
}

export function useCurrentSubscription() {
  return useQuery({
    queryKey: ['subscription', 'current'],
    queryFn: async () => {
      const response = await billingApi.getCurrentSubscription()
      if (!response.success) {
        throw new Error('Failed to fetch subscription')
      }
      return response.data
    },
    onError: (error: any) => {
      if (error.response?.status !== 404) {
        toast.error(error.message || 'Failed to load subscription')
      }
    },
  })
}

export function useSubscription(id: number) {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['subscription', id],
    queryFn: async () => {
      if (!hasPermission('billing.manage')) {
        throw new Error('You do not have permission to view subscription details')
      }
      const response = await billingApi.getSubscription(id)
      if (!response.success) {
        throw new Error('Failed to fetch subscription')
      }
      return response.data
    },
    enabled: !!id && hasPermission('billing.manage'),
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view subscription details')
      } else {
        toast.error(error.message || 'Failed to load subscription')
      }
    },
  })
}

export function useCreateSubscription() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async (data: CreateSubscriptionRequest) => {
      if (!hasPermission('billing.manage')) {
        throw new Error('You do not have permission to create subscriptions')
      }
      const response = await billingApi.createSubscription(data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create subscription')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      toast.success('Subscription created successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to create subscription'
      toast.error(message)
    },
  })
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateSubscriptionRequest }) => {
      if (!hasPermission('billing.manage')) {
        throw new Error('You do not have permission to update subscriptions')
      }
      const response = await billingApi.updateSubscription(id, data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update subscription')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      toast.success('Subscription updated successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to update subscription'
      toast.error(message)
    },
  })
}

export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason?: string }) => {
      const response = await billingApi.cancelSubscription(id, { reason })
      if (!response.success) {
        throw new Error(response.message || 'Failed to cancel subscription')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      toast.success('Subscription cancelled successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to cancel subscription'
      toast.error(message)
    },
  })
}



