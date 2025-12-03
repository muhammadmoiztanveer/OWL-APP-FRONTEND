import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorApi } from '@/lib/api/doctor'
import { PdfStatus } from '@/lib/types'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

export function usePdfStatus(assessmentId: number, options?: { enabled?: boolean; refetchInterval?: number }) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['pdf-status', assessmentId],
    queryFn: async () => {
      const response = await doctorApi.getPdfStatus(assessmentId)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch PDF status')
      }
      return response.data
    },
    enabled: !!assessmentId && isAuthenticated && (options?.enabled !== false),
    refetchInterval: options?.refetchInterval || false,
    onError: (error: any) => {
      if (error.response?.status !== 404) {
        // Don't show error for 404 (PDF not generated yet)
        toast.error(error.message || 'Failed to load PDF status')
      }
    },
  })
}

export function useDownloadPdf() {
  return useMutation({
    mutationFn: async (assessmentId: number) => {
      const blob = await doctorApi.downloadPdf(assessmentId)
      return { blob, assessmentId }
    },
    onSuccess: ({ blob, assessmentId }) => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `assessment-${assessmentId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('PDF downloaded successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to download PDF'
      toast.error(message)
    },
  })
}

export function useRegeneratePdf() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (assessmentId: number) => {
      const response = await doctorApi.regeneratePdf(assessmentId)
      if (!response.success) {
        throw new Error(response.message || 'Failed to regenerate PDF')
      }
      return response
    },
    onSuccess: (_, assessmentId) => {
      queryClient.invalidateQueries({ queryKey: ['pdf-status', assessmentId] })
      toast.success('PDF regeneration queued successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to regenerate PDF'
      toast.error(message)
    },
  })
}

