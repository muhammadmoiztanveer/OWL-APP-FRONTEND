import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pdfApi } from '@/lib/api/pdf'
import { PdfQueueListParams } from '@/lib/types'
import toast from 'react-hot-toast'

export function usePdfQueue(params?: PdfQueueListParams) {
  return useQuery({
    queryKey: ['pdf-queue', params],
    queryFn: async () => {
      const response = await pdfApi.getQueue(params)
      if (!response.success) {
        throw new Error('Failed to fetch PDF queue')
      }
      return response
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to load PDF queue'
      toast.error(message)
    },
  })
}

export function useRetryPdfGeneration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (assessmentId: number) => {
      const response = await pdfApi.retryPdfGeneration(assessmentId)
      if (!response.success) {
        throw new Error(response.message || 'Failed to retry PDF generation')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdf-queue'] })
      toast.success('PDF generation retried successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to retry PDF generation'
      toast.error(message)
    },
  })
}

