import { useQuery } from '@tanstack/react-query'
import { auditLogsApi } from '@/lib/api/auditLogs'
import { AuditLogFilters, AuditLogStats } from '@/lib/types'
import toast from 'react-hot-toast'

export function useAuditLogs(params?: AuditLogFilters) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: async () => {
      console.log('Fetching audit logs with params:', params)
      const response = await auditLogsApi.listAuditLogs(params)
      console.log('Audit logs response:', { success: response.success, page: params?.page, meta: response.meta })
      if (!response.success) {
        throw new Error('Failed to fetch audit logs')
      }
      return response
    },
    staleTime: 0, // Always refetch when query key changes
    gcTime: 0, // Don't cache results (previously cacheTime)
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
  })
}

