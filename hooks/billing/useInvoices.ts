import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { billingApi } from '@/lib/api/billing'
import {
  Invoice,
  CreateInvoiceRequest,
  CreateInvoiceFromAssessmentRequest,
  UpdateInvoiceRequest,
  InvoicesListParams,
  BillingStats,
} from '@/lib/types'
import toast from 'react-hot-toast'

export function useInvoices(params?: InvoicesListParams) {
  return useQuery({
    queryKey: ['billing-invoices', params],
    queryFn: async () => {
      const response = await billingApi.getInvoices(params)
      if (!response.success) {
        throw new Error('Failed to fetch invoices')
      }
      return response
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to load invoices'
      toast.error(message)
    },
  })
}

export function useInvoiceStats() {
  return useQuery({
    queryKey: ['billing-invoice-stats'],
    queryFn: async () => {
      const response = await billingApi.getInvoiceStats()
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch invoice statistics')
      }
      return response.data
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to load statistics'
      toast.error(message)
    },
  })
}

export function useInvoice(id: number) {
  return useQuery({
    queryKey: ['billing-invoice', id],
    queryFn: async () => {
      const response = await billingApi.getInvoice(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch invoice')
      }
      return response.data
    },
    enabled: !!id,
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to load invoice'
      toast.error(message)
    },
  })
}

export function useCreateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateInvoiceRequest) => {
      const response = await billingApi.createInvoice(data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create invoice')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-invoices'] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoice-stats'] })
      toast.success('Invoice created successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {}).flat()[0] ||
        error.message ||
        'Failed to create invoice'
      toast.error(message)
    },
  })
}

export function useCreateInvoiceFromAssessment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      assessmentId,
      data,
    }: {
      assessmentId: number
      data: CreateInvoiceFromAssessmentRequest
    }) => {
      const response = await billingApi.createInvoiceFromAssessment(assessmentId, data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create invoice from assessment')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-invoices'] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoice-stats'] })
      toast.success('Invoice created successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {}).flat()[0] ||
        error.message ||
        'Failed to create invoice'
      toast.error(message)
    },
  })
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateInvoiceRequest }) => {
      const response = await billingApi.updateInvoice(id, data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update invoice')
      }
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['billing-invoices'] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoice', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoice-stats'] })
      toast.success('Invoice updated successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {}).flat()[0] ||
        error.message ||
        'Failed to update invoice'
      toast.error(message)
    },
  })
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await billingApi.deleteInvoice(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete invoice')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-invoices'] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoice-stats'] })
      toast.success('Invoice deleted successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to delete invoice'
      toast.error(message)
    },
  })
}

export function useMarkInvoiceAsPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await billingApi.markInvoiceAsPaid(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to mark invoice as paid')
      }
      return response.data
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['billing-invoices'] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoice', id] })
      queryClient.invalidateQueries({ queryKey: ['billing-invoice-stats'] })
      toast.success('Invoice marked as paid')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to mark invoice as paid'
      toast.error(message)
    },
  })
}


