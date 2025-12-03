import api from './client'
import {
  ApiResponse,
  Rate,
  Invoice,
  Payment,
  BillingStats,
  CreateRateRequest,
  UpdateRateRequest,
  CreateInvoiceRequest,
  CreateInvoiceFromAssessmentRequest,
  UpdateInvoiceRequest,
  CreatePaymentRequest,
  UpdatePaymentRequest,
  RatesListParams,
  InvoicesListParams,
  PaymentsListParams,
  PaginationMeta,
  PaginationLinks,
} from '@/lib/types'

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: PaginationMeta
  links: PaginationLinks
}

export const billingApi = {
  // Rate Management (Admin Only)
  getRates: async (params?: RatesListParams): Promise<PaginatedResponse<Rate>> => {
    const response = await api.get<PaginatedResponse<Rate>>('/billing/rates', { params })
    return response.data
  },

  getActiveRates: async (): Promise<ApiResponse<Rate[]>> => {
    const response = await api.get<ApiResponse<Rate[]>>('/billing/rates/active')
    return response.data
  },

  getRate: async (id: number): Promise<ApiResponse<Rate>> => {
    const response = await api.get<ApiResponse<Rate>>(`/billing/rates/${id}`)
    return response.data
  },

  createRate: async (data: CreateRateRequest): Promise<ApiResponse<Rate>> => {
    const response = await api.post<ApiResponse<Rate>>('/billing/rates', data)
    return response.data
  },

  updateRate: async (id: number, data: UpdateRateRequest): Promise<ApiResponse<Rate>> => {
    const response = await api.put<ApiResponse<Rate>>(`/billing/rates/${id}`, data)
    return response.data
  },

  deleteRate: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/billing/rates/${id}`)
    return response.data
  },

  // Invoice Management
  getInvoices: async (params?: InvoicesListParams): Promise<PaginatedResponse<Invoice>> => {
    const response = await api.get<PaginatedResponse<Invoice>>('/billing/invoices', { params })
    return response.data
  },

  getInvoiceStats: async (): Promise<ApiResponse<BillingStats>> => {
    const response = await api.get<ApiResponse<BillingStats>>('/billing/invoices/stats')
    return response.data
  },

  getInvoice: async (id: number): Promise<ApiResponse<Invoice>> => {
    const response = await api.get<ApiResponse<Invoice>>(`/billing/invoices/${id}`)
    return response.data
  },

  createInvoice: async (data: CreateInvoiceRequest): Promise<ApiResponse<Invoice>> => {
    const response = await api.post<ApiResponse<Invoice>>('/billing/invoices', data)
    return response.data
  },

  createInvoiceFromAssessment: async (
    assessmentId: number,
    data: CreateInvoiceFromAssessmentRequest
  ): Promise<ApiResponse<Invoice>> => {
    const response = await api.post<ApiResponse<Invoice>>(
      `/billing/invoices/from-assessment/${assessmentId}`,
      data
    )
    return response.data
  },

  updateInvoice: async (id: number, data: UpdateInvoiceRequest): Promise<ApiResponse<Invoice>> => {
    const response = await api.put<ApiResponse<Invoice>>(`/billing/invoices/${id}`, data)
    return response.data
  },

  deleteInvoice: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/billing/invoices/${id}`)
    return response.data
  },

  markInvoiceAsPaid: async (id: number): Promise<ApiResponse<Invoice>> => {
    const response = await api.post<ApiResponse<Invoice>>(`/billing/invoices/${id}/mark-paid`)
    return response.data
  },

  // Payment Management
  getPayments: async (params?: PaymentsListParams): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get<PaginatedResponse<Payment>>('/billing/payments', { params })
    return response.data
  },

  getPayment: async (id: number): Promise<ApiResponse<Payment>> => {
    const response = await api.get<ApiResponse<Payment>>(`/billing/payments/${id}`)
    return response.data
  },

  createPayment: async (data: CreatePaymentRequest): Promise<ApiResponse<Payment>> => {
    const response = await api.post<ApiResponse<Payment>>('/billing/payments', data)
    return response.data
  },

  updatePayment: async (id: number, data: UpdatePaymentRequest): Promise<ApiResponse<Payment>> => {
    const response = await api.put<ApiResponse<Payment>>(`/billing/payments/${id}`, data)
    return response.data
  },

  deletePayment: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/billing/payments/${id}`)
    return response.data
  },

  markPaymentCompleted: async (id: number): Promise<ApiResponse<Payment>> => {
    const response = await api.post<ApiResponse<Payment>>(`/billing/payments/${id}/mark-completed`)
    return response.data
  },

  markPaymentFailed: async (id: number): Promise<ApiResponse<Payment>> => {
    const response = await api.post<ApiResponse<Payment>>(`/billing/payments/${id}/mark-failed`)
    return response.data
  },

  markPaymentRefunded: async (id: number): Promise<ApiResponse<Payment>> => {
    const response = await api.post<ApiResponse<Payment>>(`/billing/payments/${id}/mark-refunded`)
    return response.data
  },
}


