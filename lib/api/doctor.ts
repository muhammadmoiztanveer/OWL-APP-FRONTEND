import api from './client'
import {
  ApiResponse,
  Patient,
  AssessmentOrder,
  Assessment,
  DashboardData,
  CreatePatientRequest,
  UpdatePatientRequest,
  CreateAssessmentOrderRequest,
  PatientsListParams,
  AssessmentOrdersListParams,
  AssessmentsListParams,
  PaginationMeta,
  PaginationLinks,
  PdfStatus,
} from '@/lib/types'

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: PaginationMeta
  links: PaginationLinks
}

export const doctorApi = {
  // Dashboard
  getDashboard: async (): Promise<ApiResponse<DashboardData>> => {
    const response = await api.get<ApiResponse<DashboardData>>('/doctor/dashboard')
    return response.data
  },

  // Patients
  getPatients: async (params?: PatientsListParams): Promise<PaginatedResponse<Patient>> => {
    const response = await api.get<PaginatedResponse<Patient>>('/doctor/patients', { params })
    return response.data
  },

  getPatient: async (id: number): Promise<ApiResponse<{ patient: Patient; assessments: Assessment[] }>> => {
    const response = await api.get<ApiResponse<{ patient: Patient; assessments: Assessment[] }>>(
      `/doctor/patients/${id}`
    )
    return response.data
  },

  createPatient: async (
    data: CreatePatientRequest | {
      name: string
      email: string
      date_of_birth?: string
      phone?: string
      assessment_type?: string | null
      instructions?: string
      invitation_expires_in_days?: number
    }
  ): Promise<ApiResponse<{ patient: Patient; invitation?: { id: number; email: string; expires_at: string; login_url: string } }>> => {
    // Backend expects 'name' field, so we accept either format
    // Also handles assessment_type and instructions for automatic assessment order creation
    // NEW: Backend now returns patient + invitation with login_url
    const payload = 'name' in data 
      ? data 
      : { 
          name: `${data.first_name} ${data.last_name}`.trim(), 
          email: data.email, 
          date_of_birth: data.date_of_birth, 
          phone: data.phone,
          assessment_type: data.assessment_type,
          instructions: data.instructions,
          invitation_expires_in_days: (data as any).invitation_expires_in_days,
        }
    const response = await api.post<ApiResponse<{ patient: Patient; invitation?: { id: number; email: string; expires_at: string; login_url: string } }>>('/doctor/patients', payload)
    return response.data
  },

  updatePatient: async (id: number, data: UpdatePatientRequest): Promise<ApiResponse<Patient>> => {
    const response = await api.put<ApiResponse<Patient>>(`/doctor/patients/${id}`, data)
    return response.data
  },

  deletePatient: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/doctor/patients/${id}`)
    return response.data
  },

  // Assessment Orders
  getAssessmentOrders: async (
    params?: AssessmentOrdersListParams
  ): Promise<PaginatedResponse<AssessmentOrder>> => {
    const response = await api.get<PaginatedResponse<AssessmentOrder>>('/doctor/assessment-orders', {
      params,
    })
    return response.data
  },

  getAssessmentOrder: async (id: number): Promise<ApiResponse<AssessmentOrder>> => {
    const response = await api.get<ApiResponse<AssessmentOrder>>(`/doctor/assessment-orders/${id}`)
    return response.data
  },

  createAssessmentOrder: async (
    data: CreateAssessmentOrderRequest
  ): Promise<ApiResponse<AssessmentOrder>> => {
    const response = await api.post<ApiResponse<AssessmentOrder>>('/doctor/assessment-orders', data)
    return response.data
  },

  sendInvite: async (id: number): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(`/doctor/assessment-orders/${id}/send-invite`)
    return response.data
  },

  getPendingOrders: async (): Promise<ApiResponse<AssessmentOrder[]>> => {
    const response = await api.get<ApiResponse<AssessmentOrder[]>>('/doctor/assessment-orders/pending')
    return response.data
  },

  // Assessments
  // ✅ CORRECT: Routes are under /api/doctor/ prefix
  getAssessments: async (params?: AssessmentsListParams): Promise<PaginatedResponse<Assessment>> => {
    const response = await api.get<PaginatedResponse<Assessment>>('/doctor/assessments', { params })
    return response.data
  },

  getAssessment: async (id: number): Promise<ApiResponse<Assessment>> => {
    const response = await api.get<ApiResponse<Assessment>>(`/doctor/assessments/${id}`)
    return response.data
  },

  getReadyForReview: async (
    params?: { per_page?: number; page?: number }
  ): Promise<PaginatedResponse<Assessment>> => {
    const response = await api.get<PaginatedResponse<Assessment>>('/doctor/assessments/ready-for-review', {
      params,
    })
    return response.data
  },

  getPatientAssessments: async (patientId: number): Promise<ApiResponse<Assessment[]>> => {
    const response = await api.get<ApiResponse<Assessment[]>>(`/doctor/assessments/patient/${patientId}`)
    return response.data
  },

  getPatientAssessmentResponses: async (
    patientId: number,
    assessmentId: number
  ): Promise<ApiResponse<Assessment>> => {
    const response = await api.get<ApiResponse<Assessment>>(
      `/doctor/patients/${patientId}/assessments/${assessmentId}/responses`
    )
    return response.data
  },

  markAsReviewed: async (id: number): Promise<ApiResponse<Assessment>> => {
    const response = await api.post<ApiResponse<Assessment>>(`/doctor/assessments/${id}/review`)
    return response.data
  },

  // PDF Operations
  getPdfStatus: async (id: number): Promise<ApiResponse<PdfStatus>> => {
    const response = await api.get<ApiResponse<PdfStatus>>(`/doctor/assessments/${id}/pdf/status`)
    return response.data
  },

  downloadPdf: async (id: number): Promise<Blob> => {
    const response = await api.get(`/doctor/assessments/${id}/pdf`, {
      responseType: 'blob',
    })
    return response.data
  },

  regeneratePdf: async (id: number): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(`/doctor/assessments/${id}/pdf/regenerate`)
    return response.data
  },

  // Patient Invitations
  createPatientInvitation: async (data: {
    email: string
    expires_in_days?: number
  }): Promise<ApiResponse<{ invitation: any; invitation_url: string }>> => {
    const response = await api.post<ApiResponse<{ invitation: any; invitation_url: string }>>(
      '/doctor/patient-invitations',
      data
    )
    return response.data
  },

  getPatientInvitations: async (includeUsed: boolean = false): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(
      `/doctor/patient-invitations?include_used=${includeUsed}`
    )
    return response.data
  },

  resendPatientInvitation: async (id: number): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(`/doctor/patient-invitations/${id}/resend`)
    return response.data
  },

  // Patient Access Requests
  createAccessRequest: async (data: {
    patient_id: number
    message?: string
  }): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/doctor/patient-access-requests', data)
    return response.data
  },

  getAccessRequests: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/doctor/patient-access-requests')
    return response.data
  },
}

