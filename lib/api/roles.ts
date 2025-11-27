import api from './client'
import {
  ApiResponse,
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
} from '@/lib/types'

export const rolesApi = {
  list: async (): Promise<ApiResponse<Role[]>> => {
    const response = await api.get<ApiResponse<Role[]>>('/roles')
    return response.data
  },

  get: async (id: number): Promise<ApiResponse<Role>> => {
    const response = await api.get<ApiResponse<Role>>(`/roles/${id}`)
    return response.data
  },

  create: async (data: CreateRoleRequest): Promise<ApiResponse<Role>> => {
    const response = await api.post<ApiResponse<Role>>('/roles', data)
    return response.data
  },

  update: async (id: number, data: UpdateRoleRequest): Promise<ApiResponse<Role>> => {
    const response = await api.put<ApiResponse<Role>>(`/roles/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/roles/${id}`)
    return response.data
  },
}

