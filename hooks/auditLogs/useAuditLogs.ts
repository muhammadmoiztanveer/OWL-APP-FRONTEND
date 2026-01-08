import { useQuery } from '@tanstack/react-query'
import { auditLogsApi, PaginatedResponse } from '@/lib/api/auditLogs'
import { AuditLog, AuditLogFilters, AuditLogStats } from '@/lib/types'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import { usePermissions } from '@/hooks/usePermissions'

export function useAuditLogs(params?: AuditLogFilters) {
  const isAdmin = useIsAdmin()
  const { hasPermission } = usePermissions()

  return useQuery<PaginatedResponse<AuditLog>>({
    queryKey: ['audit-logs', params],
    queryFn: async () => {
      if (!isAdmin && !hasPermission('audit_log.view')) {
        throw new Error('You do not have permission to view audit logs')
      }
      const response = await auditLogsApi.listAuditLogs(params)
      if (!response.success) {
        throw new Error('Failed to fetch audit logs')
      }
      return response
    },
    enabled: isAdmin || hasPermission('audit_log.view'),
  })
}

export function useAuditLog(id: number) {
  const isAdmin = useIsAdmin()
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['audit-log', id],
    queryFn: async () => {
      if (!isAdmin && !hasPermission('audit_log.view')) {
        throw new Error('You do not have permission to view audit logs')
      }
      const response = await auditLogsApi.getAuditLog(id)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch audit log')
      }
      return response.data
    },
    enabled: !!id && (isAdmin || hasPermission('audit_log.view')),
  })
}

export function useAuditLogStats(params?: { start_date?: string; end_date?: string }) {
  const isAdmin = useIsAdmin()
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['audit-log-stats', params],
    queryFn: async () => {
      if (!isAdmin && !hasPermission('audit_log.view')) {
        throw new Error('You do not have permission to view audit log statistics')
      }
      const response = await auditLogsApi.getAuditLogStats(params)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch audit log statistics')
      }
      return response.data
    },
    enabled: isAdmin || hasPermission('audit_log.view'),
  })
}
