'use client'

interface RoleBadgeProps {
  role: { id: number; name: string } | string
  className?: string
}

export default function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const roleName = typeof role === 'string' ? role : role.name

  const getRoleColor = (name: string) => {
    const normalizedName = name.toLowerCase()
    switch (normalizedName) {
      case 'admin':
        return 'bg-danger text-white'
      case 'doctor':
        return 'bg-primary text-white'
      case 'patient':
        return 'bg-success text-white'
      default:
        return 'bg-secondary text-white'
    }
  }

  return (
    <span className={`badge ${getRoleColor(roleName)} ${className}`}>
      {roleName}
    </span>
  )
}

