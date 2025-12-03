'use client'

interface AccountTypeBadgeProps {
  accountType: string | null | undefined
  className?: string
}

export default function AccountTypeBadge({ accountType, className = '' }: AccountTypeBadgeProps) {
  if (!accountType) {
    return (
      <span className={`badge bg-secondary ${className}`}>
        User
      </span>
    )
  }

  const getAccountTypeColor = (type: string) => {
    const normalizedType = type.toLowerCase()
    switch (normalizedType) {
      case 'admin':
        return 'bg-danger text-white'
      case 'doctor':
        return 'bg-info text-white'
      case 'patient':
        return 'bg-success text-white'
      case 'user':
        return 'bg-secondary text-white'
      default:
        return 'bg-secondary text-white'
    }
  }

  return (
    <span className={`badge ${getAccountTypeColor(accountType)} ${className}`}>
      {accountType.charAt(0).toUpperCase() + accountType.slice(1)}
    </span>
  )
}

