'use client'

interface PaymentMethodBadgeProps {
  method: 'cash' | 'card' | 'bank_transfer' | 'check' | 'other'
}

const methodConfig = {
  cash: {
    color: 'success',
    label: 'Cash',
    icon: 'mdi-cash',
  },
  card: {
    color: 'primary',
    label: 'Card',
    icon: 'mdi-credit-card',
  },
  bank_transfer: {
    color: 'info',
    label: 'Bank Transfer',
    icon: 'mdi-bank-transfer',
  },
  check: {
    color: 'warning',
    label: 'Check',
    icon: 'mdi-checkbook',
  },
  other: {
    color: 'secondary',
    label: 'Other',
    icon: 'mdi-dots-horizontal',
  },
}

export default function PaymentMethodBadge({ method }: PaymentMethodBadgeProps) {
  const config = methodConfig[method] || methodConfig.other

  return (
    <span className={`badge bg-${config.color}-subtle text-${config.color}`}>
      <i className={`mdi ${config.icon} me-1`}></i>
      {config.label}
    </span>
  )
}


