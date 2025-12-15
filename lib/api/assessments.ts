import api from './client'
import { ApiResponse, PaginationMeta, PaginationLinks } from '@/lib/types'

export interface AssessmentOrder {
  id: number
  doctor_id: number
  patient_id: number
  assessment_type: 'PHQ-9' | 'GAD-7' | 'comprehensive'
  instructions?: string
  status: 'pending' | 'sent' | 'completed'
  ordered_on: string
  sent_at?: string
  patient?: {
    id: number
    name: string
    email: string
  }
  doctor?: {
    id: number
    name: string
    practice_name: string
  }
}

export interface Assessment {
  id: number
  patient_id: number
  doctor_id: number
  assessment_type: string
  score: number
  phq9_score?: number | null
  gad7_score?: number | null
  suicide_risk?: number | null
  status: 'pending' | 'completed' | 'reviewed'
  completed_on?: string
  reviewed_at?: string | null
  patient?: {
    id: number
    name: string
    email?: string
  }
  doctor?: {
    id: number
    full_name?: string
    name?: string
    email?: string
    practice_name?: string
  }
  // New format: responses array with question_id, question_text, question_order, score
  responses?: Array<{
    question_id: number
    question_text: string
    question_order: number
    score: number
  }>
  // Legacy format: kept for backward compatibility
  assessment_responses?: Array<{
    id: number
    question_id: number
    question: {
      id: number
      question_text: string
      assessment_type: string
    }
    score: number
  }>
  severity?: string | { phq9: string; gad7: string }
  recommendation?: string | { phq9: string; gad7: string }
}

export interface AssignedAssessment {
  id: number
  assessment_type: string
  instructions?: string
  status: string
  ordered_on: string
  sent_at?: string
  doctor: {
    id: number
    name: string
    practice_name: string
  }
  assessment: Assessment | null
  assessment_url: string | null
  token_expires_at: string | null
  is_completed: boolean
}

export interface AssessmentTokenData {
  token: string
  order: {
    id: number
    assessment_type: string
    instructions?: string
    patient: {
      name: string
      email: string
    }
    doctor: {
      name: string
      email: string
    }
  }
}

export interface AssessmentQuestion {
  id: number
  question_text: string
  assessment_type: string
  order_num: number
  options: Array<{ value: number; label: string }>
}

export interface PaginatedAssessmentOrders {
  success: boolean
  data: AssessmentOrder[]
  meta: PaginationMeta
  links: PaginationLinks
}

export const assessmentsApi = {
  // Doctor: Create assessment order
  createAssessmentOrder: async (data: {
    patient_id: number
    assessment_type: 'PHQ-9' | 'GAD-7' | 'comprehensive'
    instructions?: string
  }): Promise<ApiResponse<AssessmentOrder>> => {
    const response = await api.post<ApiResponse<AssessmentOrder>>('/assessment-orders', data)
    return response.data
  },

  // Doctor: Get assessment orders
  getAssessmentOrders: async (params?: {
    page?: number
    per_page?: number
    status?: 'pending' | 'sent' | 'completed'
  }): Promise<PaginatedAssessmentOrders> => {
    const response = await api.get<PaginatedAssessmentOrders>('/assessment-orders', { params })
    return response.data
  },

  // Doctor: Get patient assessment results
  getPatientAssessments: async (patientId: number): Promise<ApiResponse<Assessment[]>> => {
    const response = await api.get<ApiResponse<Assessment[]>>(`/assessments/patient/${patientId}`)
    return response.data
  },

  // Patient: Get single assessment by ID (for viewing completed assessment)
  getPatientAssessment: async (id: number): Promise<ApiResponse<Assessment>> => {
    const response = await api.get<ApiResponse<Assessment>>(`/assessments/${id}`)
    return response.data
  },

  // Doctor: Get assessment details
  getAssessmentDetails: async (id: number): Promise<ApiResponse<Assessment>> => {
    const response = await api.get<ApiResponse<Assessment>>(`/assessments/${id}`)
    return response.data
  },

  // Patient: Get assigned assessments
  getAssignedAssessments: async (): Promise<ApiResponse<AssignedAssessment[]>> => {
    const response = await api.get<ApiResponse<AssignedAssessment[]>>('/patient/assessments/assigned')
    return response.data
  },

  // Patient: Get assigned assessment details
  getAssignedAssessmentDetails: async (id: number): Promise<ApiResponse<AssignedAssessment>> => {
    const response = await api.get<ApiResponse<AssignedAssessment>>(`/patient/assessments/assigned/${id}`)
    return response.data
  },

  // Patient: Get assessment URL
  getAssessmentUrl: async (id: number): Promise<ApiResponse<{
    assessment_url: string
    token: string
    expires_at: string
    assessment_type: string
  }>> => {
    const response = await api.get<ApiResponse<{
      assessment_url: string
      token: string
      expires_at: string
      assessment_type: string
    }>>(`/patient/assessments/assigned/${id}/url`)
    return response.data
  },

  // Public: Validate assessment token
  validateToken: async (token: string): Promise<ApiResponse<AssessmentTokenData>> => {
    const response = await api.get<ApiResponse<AssessmentTokenData>>(`/assessments/token/${token}`)
    return response.data
  },

  // Public: Get assessment questions
  getQuestions: async (token: string): Promise<ApiResponse<{
    assessment_type: string
    questions: AssessmentQuestion[]
  }>> => {
    const response = await api.get<ApiResponse<{
      assessment_type: string
      questions: AssessmentQuestion[]
    }>>(`/assessments/token/${token}/questions`)
    return response.data
  },

  // Alias for backward compatibility
  getQuestionsByToken: async (token: string): Promise<ApiResponse<{
    assessment_type: string
    questions: AssessmentQuestion[]
  }>> => {
    return assessmentsApi.getQuestions(token)
  },

  // Public: Submit assessment
  submitAssessment: async (token: string, answers: Record<number, number>): Promise<ApiResponse<Assessment>> => {
    const response = await api.post<ApiResponse<Assessment>>(`/assessments/token/${token}/submit`, { answers })
    return response.data
  },

  // Alias for backward compatibility
  submitByToken: async (token: string, data: { answers: Record<number, number> }): Promise<ApiResponse<Assessment>> => {
    return assessmentsApi.submitAssessment(token, data.answers)
  },
}
