import { useQuery } from '@tanstack/react-query'
import { doctorsApi } from '@/lib/api/doctors'
import { DoctorsListParams } from '@/lib/types'
import toast from 'react-hot-toast'

export function useDoctors(params?: DoctorsListParams) {
  return useQuery({
    queryKey: ['doctors', params],
    queryFn: async () => {
      const response = await doctorsApi.list(params)
      if (!response.success) {
        throw new Error('Failed to fetch doctors')
      }
      return response
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to load doctors'
      toast.error(message)
    },
  })
}


