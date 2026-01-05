import api from './client'
import { ApiResponse, PaginatedResponse, Assessment, AssessmentsListParams } from '@/lib/types'
import { DoctorChangeRequest } from './patient'

// Re-export for convenience
export type { DoctorChangeRequest }

export interface AdminAssessmentsListParams extends AssessmentsListParams {
  patient_id?: number
  doctor_id?: number
}

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

  // Admin Assessments
  getAssessments: async (params?: AdminAssessmentsListParams): Promise<PaginatedResponse<Assessment>> => {
    const response = await api.get<PaginatedResponse<Assessment>>('/admin/assessments', { params })
    return response.data
  },

  getAssessment: async (id: number): Promise<ApiResponse<Assessment>> => {
    const response = await api.get<ApiResponse<Assessment>>(`/admin/assessments/${id}`)
    return response.data
  },

  // Admin Patients
  getPatient: async (id: number): Promise<ApiResponse<{ patient: any; assessments: Assessment[] }>> => {
    const response = await api.get<ApiResponse<{ patient: any; assessments: Assessment[] }>>(
      `/admin/patients/${id}`
    )
    return response.data
  },

  getPatientAssessmentResponses: async (
    patientId: number,
    assessmentId: number
  ): Promise<ApiResponse<Assessment>> => {
    const response = await api.get<ApiResponse<Assessment>>(
      `/admin/patients/${patientId}/assessments/${assessmentId}/responses`
    )
    return response.data
  },
}
