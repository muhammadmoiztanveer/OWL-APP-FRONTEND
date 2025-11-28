import api from './client'
import {
  ApiResponse,
  Module,
  CreateModuleRequest,
  UpdateModuleRequest,
  PermissionGroup,
} from '@/lib/types'

export const modulesApi = {
  list: async (): Promise<ApiResponse<Module[]>> => {
    const response = await api.get<ApiResponse<Module[]>>('/modules')
    return response.data
  },

  get: async (id: number): Promise<ApiResponse<Module>> => {
    const response = await api.get<ApiResponse<Module>>(`/modules/${id}`)
    return response.data
  },

  create: async (data: CreateModuleRequest): Promise<ApiResponse<Module>> => {
    const response = await api.post<ApiResponse<Module>>('/modules', data)
    return response.data
  },

  update: async (id: number, data: UpdateModuleRequest): Promise<ApiResponse<Module>> => {
    const response = await api.put<ApiResponse<Module>>(`/modules/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/modules/${id}`)
    return response.data
  },

  getGroupedPermissions: async (): Promise<ApiResponse<PermissionGroup[]>> => {
    const response = await api.get<ApiResponse<PermissionGroup[]>>('/permissions/grouped')
    return response.data
  },
}

