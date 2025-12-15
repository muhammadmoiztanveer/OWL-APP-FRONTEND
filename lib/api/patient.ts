import api from './client'
import { ApiResponse } from '@/lib/types'

export interface LoginLinkValidationResponse {
  email: string
  patient_name: string
  doctor: {
    name: string
    practice_name: string
  }
  expires_at: string
}

export interface DoctorChangeRequest {
  id: number
  patient_id: number
  patient?: {
    id: number
    name: string
    email: string
  }
  current_doctor: {
    id: number
    full_name: string
    practice_name: string
  }
  requested_doctor: {
    id: number
    full_name: string
    practice_name: string
  }
  status: 'pending' | 'approved' | 'rejected'
  reason?: string
  admin_notes?: string
  created_at: string
}

export const patientApi = {
  // Password Setup
  validateLoginLink: async (token: string): Promise<ApiResponse<LoginLinkValidationResponse>> => {
    const response = await api.get<ApiResponse<LoginLinkValidationResponse>>(
      `/patient/setup-password/validate?token=${token}`
    )
    return response.data
  },

  setupPassword: async (data: {
    token: string
    password: string
    password_confirmation: string
  }): Promise<ApiResponse<{ user: any; token: string; patient?: any }>> => {
    const response = await api.post<ApiResponse<{ user: any; token: string; patient?: any }>>(
      '/patient/setup-password',
      data
    )
    return response.data
  },

  // Doctor Change Requests
  getDoctorChangeRequests: async (): Promise<ApiResponse<DoctorChangeRequest[]>> => {
    const response = await api.get<ApiResponse<DoctorChangeRequest[]>>('/patient/doctor-change-requests')
    return response.data
  },

  createDoctorChangeRequest: async (data: {
    requested_doctor_id: number
    reason?: string
  }): Promise<ApiResponse<DoctorChangeRequest>> => {
    const response = await api.post<ApiResponse<DoctorChangeRequest>>('/patient/doctor-change-requests', data)
    return response.data
  },

  // Get available doctors for patient to select (if backend provides this endpoint)
  getAvailableDoctors: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/patient/available-doctors')
    return response.data
  },
}
