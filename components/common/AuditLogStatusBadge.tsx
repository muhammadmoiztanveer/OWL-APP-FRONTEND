'use client'

interface AuditLogStatusBadgeProps {
  status: 'success' | 'failed' | 'error'
}

const statusConfig = {
  success: {
    color: 'success',
    label: 'Success',
    icon: 'mdi-check-circle',
  },
  failed: {
    color: 'danger',
    label: 'Failed',
    icon: 'mdi-close-circle',
  },
  error: {
    color: 'warning',
    label: 'Error',
    icon: 'mdi-alert-circle',
  },
}

export default function AuditLogStatusBadge({ status }: AuditLogStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.success

  return (
    <span className={`badge bg-${config.color}-subtle text-${config.color}`}>
      <i className={`mdi ${config.icon} me-1`}></i>
      {config.label}
    </span>
  )
}

