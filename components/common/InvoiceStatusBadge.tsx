'use client'

interface InvoiceStatusBadgeProps {
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
}

const statusConfig = {
  pending: {
    color: 'warning',
    label: 'Pending',
    icon: 'mdi-clock-outline',
  },
  paid: {
    color: 'success',
    label: 'Paid',
    icon: 'mdi-check-circle',
  },
  overdue: {
    color: 'danger',
    label: 'Overdue',
    icon: 'mdi-alert-circle',
  },
  cancelled: {
    color: 'secondary',
    label: 'Cancelled',
    icon: 'mdi-cancel',
  },
}

export default function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`badge bg-${config.color}-subtle text-${config.color}`}>
      <i className={`mdi ${config.icon} me-1`}></i>
      {config.label}
    </span>
  )
}


