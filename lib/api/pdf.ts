import api from './client'
import { ApiResponse, PdfQueueItem, PdfQueueListParams, PaginationMeta, PaginationLinks } from '@/lib/types'

export interface PaginatedPdfQueueResponse {
  success: boolean
  data: PdfQueueItem[]
  meta: PaginationMeta
  links: PaginationLinks
}

export const pdfApi = {
  // Admin PDF Queue Management
  getQueue: async (params?: PdfQueueListParams): Promise<PaginatedPdfQueueResponse> => {
    const response = await api.get<PaginatedPdfQueueResponse>('/admin/pdf-queue', { params })
    return response.data
  },

  retryPdfGeneration: async (assessmentId: number): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(`/admin/pdf-queue/${assessmentId}/retry`)
    return response.data
  },
}

