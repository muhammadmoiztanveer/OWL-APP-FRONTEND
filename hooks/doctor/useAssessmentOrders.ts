import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorApi } from '@/lib/api/doctor'
import { AssessmentOrder, AssessmentOrdersListParams, CreateAssessmentOrderRequest } from '@/lib/types'
import { usePermissions } from '@/hooks/usePermissions'
import toast from 'react-hot-toast'

export function useAssessmentOrders(params?: AssessmentOrdersListParams) {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['assessment-orders', params],
    queryFn: async () => {
      if (!hasPermission('assessment-order.view')) {
        throw new Error('You do not have permission to view assessment orders')
      }
      const response = await doctorApi.getAssessmentOrders(params)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch assessment orders')
      }
      return response
    },
    enabled: hasPermission('assessment-order.view'),
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view assessment orders')
      } else {
        toast.error(error.message || 'Failed to load assessment orders')
      }
    },
  })
}

export function useAssessmentOrder(id: number) {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['assessment-order', id],
    queryFn: async () => {
      if (!hasPermission('assessment-order.view')) {
        throw new Error('You do not have permission to view assessment order')
      }
      const response = await doctorApi.getAssessmentOrder(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch assessment order')
      }
      return response.data
    },
    enabled: !!id && hasPermission('assessment-order.view'),
  })
}

export function useCreateAssessmentOrder() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async (data: CreateAssessmentOrderRequest) => {
      if (!hasPermission('assessment-order.create')) {
        throw new Error('You do not have permission to create assessment orders')
      }
      const response = await doctorApi.createAssessmentOrder(data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create assessment order')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment-orders'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Assessment order created successfully')
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to create assessment orders')
      } else {
        const message =
          error.response?.data?.message ||
          Object.values(error.response?.data?.errors || {}).flat()[0] ||
          error.message ||
          'Failed to create assessment order'
        toast.error(message)
      }
    },
  })
}

export function useSendInvite() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async (id: number) => {
      if (!hasPermission('assessment-order.update')) {
        throw new Error('You do not have permission to send invites')
      }
      const response = await doctorApi.sendInvite(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to send invite')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment-orders'] })
      toast.success('Invite sent successfully')
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to send invites')
      } else {
        toast.error(error.message || 'Failed to send invite')
      }
    },
  })
}

export function usePendingOrders() {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['pending-orders'],
    queryFn: async () => {
      if (!hasPermission('assessment-order.view')) {
        throw new Error('You do not have permission to view pending orders')
      }
      const response = await doctorApi.getPendingOrders()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch pending orders')
      }
      return response.data
    },
    enabled: hasPermission('assessment-order.view'),
  })
}

