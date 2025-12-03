import api from './client'
import {
  ApiResponse,
  Doctor,
  CreateDoctorRequest,
  UpdateDoctorRequest,
  DoctorsListParams,
  DoctorsResponse,
} from '@/lib/types'

export const doctorsApi = {
  list: async (params?: DoctorsListParams): Promise<DoctorsResponse> => {
    const response = await api.get<DoctorsResponse>('/doctors', { params })
    return response.data
  },

  get: async (id: number): Promise<ApiResponse<Doctor>> => {
    const response = await api.get<ApiResponse<Doctor>>(`/doctors/${id}`)
    return response.data
  },

  create: async (data: CreateDoctorRequest): Promise<ApiResponse<Doctor>> => {
    const response = await api.post<ApiResponse<Doctor>>('/doctors', data)
    return response.data
  },

  update: async (id: number, data: UpdateDoctorRequest): Promise<ApiResponse<Doctor>> => {
    const response = await api.put<ApiResponse<Doctor>>(`/doctors/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/doctors/${id}`)
    return response.data
  },

  freeze: async (id: number): Promise<ApiResponse<Doctor>> => {
    const response = await api.post<ApiResponse<Doctor>>(`/doctors/${id}/freeze`)
    return response.data
  },

  unfreeze: async (id: number): Promise<ApiResponse<Doctor>> => {
    const response = await api.post<ApiResponse<Doctor>>(`/doctors/${id}/unfreeze`)
    return response.data
  },
}

