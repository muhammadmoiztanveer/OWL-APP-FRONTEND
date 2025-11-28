import api from './client'
import {
  ApiResponse,
  Permission,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  PermissionGroup,
} from '@/lib/types'

export const permissionsApi = {
  list: async (): Promise<ApiResponse<Permission[]>> => {
    const response = await api.get<ApiResponse<Permission[]>>('/permissions')
    return response.data
  },

  grouped: async (): Promise<ApiResponse<PermissionGroup[]>> => {
    const response = await api.get<ApiResponse<PermissionGroup[]>>('/permissions/grouped')
    return response.data
  },

  get: async (id: number): Promise<ApiResponse<Permission>> => {
    const response = await api.get<ApiResponse<Permission>>(`/permissions/${id}`)
    return response.data
  },

  create: async (data: CreatePermissionRequest): Promise<ApiResponse<Permission>> => {
    const response = await api.post<ApiResponse<Permission>>('/permissions', data)
    return response.data
  },

  update: async (id: number, data: UpdatePermissionRequest): Promise<ApiResponse<Permission>> => {
    const response = await api.put<ApiResponse<Permission>>(`/permissions/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/permissions/${id}`)
    return response.data
  },
}

