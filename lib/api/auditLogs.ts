import api from './client'
import {
  ApiResponse,
  AuditLog,
  AuditLogFilters,
  AuditLogStats,
  PaginationMeta,
  PaginationLinks,
} from '@/lib/types'

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: PaginationMeta
  links: PaginationLinks
}

export const auditLogsApi = {
  // List audit logs with filters and pagination
  listAuditLogs: async (params?: AuditLogFilters): Promise<PaginatedResponse<AuditLog>> => {
    const response = await api.get<PaginatedResponse<AuditLog>>('/audit-logs', { params })
    return response.data
  },

  // Get single audit log by ID
  getAuditLog: async (id: number): Promise<ApiResponse<AuditLog>> => {
    const response = await api.get<ApiResponse<AuditLog>>(`/audit-logs/${id}`)
    return response.data
  },

  // Get audit log statistics
  getAuditLogStats: async (params?: { start_date?: string; end_date?: string }): Promise<ApiResponse<AuditLogStats>> => {
    const response = await api.get<ApiResponse<AuditLogStats>>('/audit-logs/stats', { params })
    return response.data
  },

  // Export audit logs as CSV
  exportCsv: async (params?: AuditLogFilters): Promise<Blob> => {
    const response = await api.get('/audit-logs/export/csv', {
      params,
      responseType: 'blob',
    })
    return response.data
  },

  // Export audit logs as JSON
  exportJson: async (params?: AuditLogFilters): Promise<ApiResponse<AuditLog[]>> => {
    const response = await api.get<ApiResponse<AuditLog[]>>('/audit-logs/export/json', { params })
    return response.data
  },
}

