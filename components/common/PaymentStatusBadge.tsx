'use client'

interface PaymentStatusBadgeProps {
  status: 'pending' | 'completed' | 'failed' | 'refunded'
}

const statusConfig = {
  pending: {
    color: 'warning',
    label: 'Pending',
    icon: 'mdi-clock-outline',
  },
  completed: {
    color: 'success',
    label: 'Completed',
    icon: 'mdi-check-circle',
  },
  failed: {
    color: 'danger',
    label: 'Failed',
    icon: 'mdi-close-circle',
  },
  refunded: {
    color: 'info',
    label: 'Refunded',
    icon: 'mdi-refresh',
  },
}

export default function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`badge bg-${config.color}-subtle text-${config.color}`}>
      <i className={`mdi ${config.icon} me-1`}></i>
      {config.label}
    </span>
  )
}


