import api from './client'
import {
  ApiResponse,
  UserManagement,
  UpdateUserData,
  UsersListParams,
  PaginationMeta,
  PaginationLinks,
} from '@/lib/types'

export interface PaginatedUsersResponse {
  success: boolean
  data: UserManagement[]
  meta: PaginationMeta
  links: PaginationLinks
}

export const usersApi = {
  list: async (params?: UsersListParams): Promise<PaginatedUsersResponse> => {
    const response = await api.get<PaginatedUsersResponse>('/users', { params })
    return response.data
  },

  get: async (id: number): Promise<ApiResponse<UserManagement>> => {
    const response = await api.get<ApiResponse<UserManagement>>(`/users/${id}`)
    return response.data
  },

  update: async (id: number, data: UpdateUserData): Promise<ApiResponse<UserManagement>> => {
    const response = await api.put<ApiResponse<UserManagement>>(`/users/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/users/${id}`)
    return response.data
  },

  loginAs: async (userId: number): Promise<ApiResponse<UserManagement>> => {
    const response = await api.post<ApiResponse<UserManagement>>(`/users/${userId}/login-as`)
    return response.data
  },
}

