import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { billingApi } from '@/lib/api/billing'
import { Rate, CreateRateRequest, UpdateRateRequest, RatesListParams } from '@/lib/types'
import toast from 'react-hot-toast'

export function useRates(params?: RatesListParams) {
  return useQuery({
    queryKey: ['billing-rates', params],
    queryFn: async () => {
      const response = await billingApi.getRates(params)
      if (!response.success) {
        throw new Error('Failed to fetch rates')
      }
      return response
    },
  })
}

export function useActiveRates() {
  return useQuery({
    queryKey: ['billing-rates-active'],
    queryFn: async () => {
      const response = await billingApi.getActiveRates()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch active rates')
      }
      return response.data || []
    },
  })
}

export function useRate(id: number) {
  return useQuery({
    queryKey: ['billing-rate', id],
    queryFn: async () => {
      const response = await billingApi.getRate(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch rate')
      }
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateRate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateRateRequest) => {
      const response = await billingApi.createRate(data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create rate')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-rates'] })
      queryClient.invalidateQueries({ queryKey: ['billing-rates-active'] })
      toast.success('Rate created successfully')
    },
  })
}

export function useUpdateRate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateRateRequest }) => {
      const response = await billingApi.updateRate(id, data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update rate')
      }
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['billing-rates'] })
      queryClient.invalidateQueries({ queryKey: ['billing-rates-active'] })
      queryClient.invalidateQueries({ queryKey: ['billing-rate', variables.id] })
      toast.success('Rate updated successfully')
    },
  })
}

export function useDeleteRate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await billingApi.deleteRate(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete rate')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-rates'] })
      queryClient.invalidateQueries({ queryKey: ['billing-rates-active'] })
      toast.success('Rate deleted successfully')
    },
  })
}


