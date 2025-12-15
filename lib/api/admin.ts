import api from './client'
import { ApiResponse } from '@/lib/types'
import { DoctorChangeRequest } from './patient'

// Re-export for convenience
export type { DoctorChangeRequest }

export const adminApi = {
  // Patient Doctor Change Requests
  getPendingDoctorChangeRequests: async (): Promise<ApiResponse<DoctorChangeRequest[]>> => {
    const response = await api.get<ApiResponse<DoctorChangeRequest[]>>(
      '/admin/patient-doctor-change-requests/pending'
    )
    return response.data
  },

  approveDoctorChangeRequest: async (
    requestId: number,
    data?: { admin_notes?: string }
  ): Promise<ApiResponse<DoctorChangeRequest>> => {
    const response = await api.post<ApiResponse<DoctorChangeRequest>>(
      `/admin/patient-doctor-change-requests/${requestId}/approve`,
      data || {}
    )
    return response.data
  },

  rejectDoctorChangeRequest: async (
    requestId: number,
    data?: { admin_notes?: string }
  ): Promise<ApiResponse<DoctorChangeRequest>> => {
    const response = await api.post<ApiResponse<DoctorChangeRequest>>(
      `/admin/patient-doctor-change-requests/${requestId}/reject`,
      data || {}
    )
    return response.data
  },
}
