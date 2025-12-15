import api from './client'
import {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  AuthData,
  User,
} from '@/lib/types'

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthData>> => {
    const response = await api.post<ApiResponse<AuthData>>('/login', data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<AuthData>> => {
    const response = await api.post<ApiResponse<AuthData>>('/register', data)
    return response.data
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/logout')
    return response.data
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/profile')
    return response.data
  },

  registerPatient: async (data: {
    token: string
    name: string
    password: string
    password_confirmation: string
  }): Promise<ApiResponse<AuthData>> => {
    const response = await api.post<ApiResponse<AuthData>>('/register/patient', data)
    return response.data
  },
}

