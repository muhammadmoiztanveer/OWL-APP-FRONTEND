import axios from 'axios'
import api from './client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Public API client (no auth required for token-based endpoints)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
import {
  ApiResponse,
  TokenValidationResponse,
  QuestionsResponse,
  SubmitAssessmentRequest,
  SubmitAssessmentResponse,
  Assessment,
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  AssessmentQuestionsListParams,
  PaginationMeta,
  PaginationLinks,
} from '@/lib/types'

export interface PaginatedQuestionsResponse {
  success: boolean
  data: Question[]
  meta: PaginationMeta
  links: PaginationLinks
}

export const assessmentsApi = {
  // Public token-based endpoints (no auth required)
  validateToken: async (token: string): Promise<ApiResponse<TokenValidationResponse>> => {
    const response = await publicApi.get<ApiResponse<TokenValidationResponse>>(`/assessments/token/${token}`)
    return response.data
  },

  getQuestionsByToken: async (token: string): Promise<ApiResponse<QuestionsResponse>> => {
    const response = await publicApi.get<ApiResponse<QuestionsResponse>>(`/assessments/token/${token}/questions`)
    return response.data
  },

  submitByToken: async (
    token: string,
    data: SubmitAssessmentRequest
  ): Promise<ApiResponse<SubmitAssessmentResponse>> => {
    const response = await publicApi.post<ApiResponse<SubmitAssessmentResponse>>(
      `/assessments/token/${token}/submit`,
      data
    )
    return response.data
  },

  // Patient portal endpoints (requires auth)
  getPatientAssessments: async (): Promise<ApiResponse<Assessment[]>> => {
    const response = await api.get<ApiResponse<Assessment[]>>('/patient/assessments')
    return response.data
  },

  getPatientAssessment: async (id: number): Promise<ApiResponse<Assessment>> => {
    const response = await api.get<ApiResponse<Assessment>>(`/patient/assessments/${id}`)
    return response.data
  },

  // Admin question management endpoints (requires admin role)
  listQuestions: async (params?: AssessmentQuestionsListParams): Promise<PaginatedQuestionsResponse> => {
    const response = await api.get<PaginatedQuestionsResponse>('/admin/assessment-questions', { params })
    return response.data
  },

  getQuestion: async (id: number): Promise<ApiResponse<Question>> => {
    const response = await api.get<ApiResponse<Question>>(`/admin/assessment-questions/${id}`)
    return response.data
  },

  createQuestion: async (data: CreateQuestionRequest): Promise<ApiResponse<Question>> => {
    const response = await api.post<ApiResponse<Question>>('/admin/assessment-questions', data)
    return response.data
  },

  updateQuestion: async (id: number, data: UpdateQuestionRequest): Promise<ApiResponse<Question>> => {
    const response = await api.put<ApiResponse<Question>>(`/admin/assessment-questions/${id}`, data)
    return response.data
  },

  deleteQuestion: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/admin/assessment-questions/${id}`)
    return response.data
  },
}

