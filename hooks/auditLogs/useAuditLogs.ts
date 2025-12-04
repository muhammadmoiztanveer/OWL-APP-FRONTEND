import { useQuery } from '@tanstack/react-query'
import { auditLogsApi } from '@/lib/api/auditLogs'
import { AuditLogFilters, AuditLogStats } from '@/lib/types'
import toast from 'react-hot-toast'

export function useAuditLogs(params?: AuditLogFilters) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: async () => {
      const response = await auditLogsApi.listAuditLogs(params)
      if (!response.success) {
        throw new Error('Failed to fetch audit logs')
      }
      return response
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to load audit logs'
      toast.error(message)
    },
  })
}

export function useAuditLog(id: number) {
  return useQuery({
    queryKey: ['audit-log', id],
    queryFn: async () => {
      const response = await auditLogsApi.getAuditLog(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch audit log')
      }
      return response.data
    },
    enabled: !!id,
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to load audit log'
      toast.error(message)
    },
  })
}

export function useAuditLogStats(params?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: ['audit-logs-stats', params],
    queryFn: async () => {
      const response = await auditLogsApi.getAuditLogStats(params)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch audit log statistics')
      }
      return response.data
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to load statistics'
      toast.error(message)
    },
  })
}

