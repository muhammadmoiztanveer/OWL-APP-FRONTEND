'use client'

interface StatusBadgeProps {
  status: string
  className?: string
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case 'pending':
        return 'bg-warning text-dark'
      case 'sent':
        return 'bg-info text-white'
      case 'completed':
        return 'bg-success text-white'
      case 'reviewed':
        return 'bg-primary text-white'
      case 'cancelled':
        return 'bg-danger text-white'
      case 'active':
        return 'bg-success text-white'
      default:
        return 'bg-secondary text-white'
    }
  }

  return (
    <span className={`badge ${getStatusColor(status)} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

