import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { billingApi } from '@/lib/api/billing'
import { Payment, CreatePaymentRequest, UpdatePaymentRequest, PaymentsListParams } from '@/lib/types'
import toast from 'react-hot-toast'

export function usePayments(params?: PaymentsListParams) {
  return useQuery({
    queryKey: ['billing-payments', params],
    queryFn: async () => {
      const response = await billingApi.getPayments(params)
      if (!response.success) {
        throw new Error('Failed to fetch payments')
      }
      return response
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to load payments'
      toast.error(message)
    },
  })
}

export function usePayment(id: number) {
  return useQuery({
    queryKey: ['billing-payment', id],
    queryFn: async () => {
      const response = await billingApi.getPayment(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch payment')
      }
      return response.data
    },
    enabled: !!id,
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to load payment'
      toast.error(message)
    },
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreatePaymentRequest) => {
      const response = await billingApi.createPayment(data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create payment')
      }
      return response.data
    },
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ['billing-payments'] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoices'] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoice', payment.invoice_id] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoice-stats'] })
      toast.success('Payment recorded successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {}).flat()[0] ||
        error.message ||
        'Failed to create payment'
      toast.error(message)
    },
  })
}

export function useUpdatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdatePaymentRequest }) => {
      const response = await billingApi.updatePayment(id, data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update payment')
      }
      return response.data
    },
    onSuccess: (payment, variables) => {
      queryClient.invalidateQueries({ queryKey: ['billing-payments'] })
      queryClient.invalidateQueries({ queryKey: ['billing-payment', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoices'] })
      if (payment.invoice_id) {
        queryClient.invalidateQueries({ queryKey: ['billing-invoice', payment.invoice_id] })
      }
      queryClient.invalidateQueries({ queryKey: ['billing-invoice-stats'] })
      toast.success('Payment updated successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {}).flat()[0] ||
        error.message ||
        'Failed to update payment'
      toast.error(message)
    },
  })
}

export function useDeletePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await billingApi.deletePayment(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete payment')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-payments'] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoices'] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoice-stats'] })
      toast.success('Payment deleted successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to delete payment'
      toast.error(message)
    },
  })
}

export function useMarkPaymentCompleted() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await billingApi.markPaymentCompleted(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to mark payment as completed')
      }
      return response.data
    },
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ['billing-payments'] })
      queryClient.invalidateQueries({ queryKey: ['billing-payment', payment.id] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoices'] })
      if (payment.invoice_id) {
        queryClient.invalidateQueries({ queryKey: ['billing-invoice', payment.invoice_id] })
      }
      queryClient.invalidateQueries({ queryKey: ['billing-invoice-stats'] })
      toast.success('Payment marked as completed')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to mark payment as completed'
      toast.error(message)
    },
  })
}

export function useMarkPaymentFailed() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await billingApi.markPaymentFailed(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to mark payment as failed')
      }
      return response.data
    },
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ['billing-payments'] })
      queryClient.invalidateQueries({ queryKey: ['billing-payment', payment.id] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoices'] })
      if (payment.invoice_id) {
        queryClient.invalidateQueries({ queryKey: ['billing-invoice', payment.invoice_id] })
      }
      queryClient.invalidateQueries({ queryKey: ['billing-invoice-stats'] })
      toast.success('Payment marked as failed')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to mark payment as failed'
      toast.error(message)
    },
  })
}

export function useMarkPaymentRefunded() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await billingApi.markPaymentRefunded(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to mark payment as refunded')
      }
      return response.data
    },
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ['billing-payments'] })
      queryClient.invalidateQueries({ queryKey: ['billing-payment', payment.id] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoices'] })
      if (payment.invoice_id) {
        queryClient.invalidateQueries({ queryKey: ['billing-invoice', payment.invoice_id] })
      }
      queryClient.invalidateQueries({ queryKey: ['billing-invoice-stats'] })
      toast.success('Payment marked as refunded')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to mark payment as refunded'
      toast.error(message)
    },
  })
}


