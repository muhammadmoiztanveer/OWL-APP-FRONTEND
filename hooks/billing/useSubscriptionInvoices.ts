import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { billingApi } from '@/lib/api/billing'
import { BillingInvoice, InvoicesListParams } from '@/lib/types'
import { usePermissions } from '@/hooks/usePermissions'
import toast from 'react-hot-toast'

export function useSubscriptionInvoices(params?: InvoicesListParams) {
  return useQuery({
    queryKey: ['subscription-invoices', params],
    queryFn: async () => {
      const response = await billingApi.getInvoices(params)
      if (!response.success) {
        throw new Error('Failed to fetch invoices')
      }
      return response
    },
  })
}

export function useSubscriptionInvoice(id: number) {
  return useQuery({
    queryKey: ['subscription-invoice', id],
    queryFn: async () => {
      const response = await billingApi.getInvoice(id)
      if (!response.success) {
        throw new Error('Failed to fetch invoice')
      }
      return response.data
    },
    enabled: !!id,
  })
}

export function useGenerateMonthlyInvoices() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async () => {
      if (!hasPermission('billing.manage')) {
        throw new Error('You do not have permission to generate invoices')
      }
      const response = await billingApi.generateMonthlyInvoices()
      if (!response.success) {
        throw new Error(response.message || 'Failed to generate invoices')
      }
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscription-invoices'] })
      toast.success(`Generated ${(data as any)?.generated || 0} invoices${(data as any)?.errors > 0 ? `, ${(data as any).errors} errors` : ''}`)
    },
  })
}

export function useSendInvoiceEmail() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async (id: number) => {
      if (!hasPermission('billing.manage')) {
        throw new Error('You do not have permission to send invoice emails')
      }
      const response = await billingApi.sendInvoiceEmail(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to send invoice email')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-invoices'] })
      toast.success('Invoice email sent successfully')
    },
  })
}

export function useMarkInvoiceAsPaid() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async (id: number) => {
      if (!hasPermission('billing.manage')) {
        throw new Error('You do not have permission to mark invoices as paid')
      }
      const response = await billingApi.markInvoiceAsPaidSubscription(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to mark invoice as paid')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-invoices'] })
      toast.success('Invoice marked as paid')
    },
  })
}
