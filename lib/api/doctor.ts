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

  createPatient: async (data: CreatePatientRequest | { name: string; email: string; date_of_birth?: string; phone?: string; assessment_type?: string | null; instructions?: string }): Promise<ApiResponse<Patient>> => {
    // Backend expects 'name' field, so we accept either format
    // Also handles assessment_type and instructions for automatic assessment order creation
    const payload = 'name' in data 
      ? data 
      : { 
          name: `${data.first_name} ${data.last_name}`.trim(), 
          email: data.email, 
          date_of_birth: data.date_of_birth, 
          phone: data.phone,
          assessment_type: data.assessment_type,
          instructions: data.instructions,
        }
    const response = await api.post<ApiResponse<Patient>>('/doctor/patients', payload)
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
}

