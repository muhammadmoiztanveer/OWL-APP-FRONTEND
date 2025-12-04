'use client'

interface ActionBadgeProps {
  action: 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'export' | string
}

const actionConfig = {
  create: {
    color: 'success',
    label: 'Created',
    icon: 'mdi-plus-circle',
  },
  read: {
    color: 'info',
    label: 'Viewed',
    icon: 'mdi-eye',
  },
  update: {
    color: 'warning',
    label: 'Updated',
    icon: 'mdi-pencil',
  },
  delete: {
    color: 'danger',
    label: 'Deleted',
    icon: 'mdi-delete',
  },
  login: {
    color: 'primary',
    label: 'Login',
    icon: 'mdi-login',
  },
  logout: {
    color: 'secondary',
    label: 'Logout',
    icon: 'mdi-logout',
  },
  export: {
    color: 'info',
    label: 'Exported',
    icon: 'mdi-download',
  },
}

export default function ActionBadge({ action }: ActionBadgeProps) {
  const config = actionConfig[action as keyof typeof actionConfig] || {
    color: 'secondary',
    label: action,
    icon: 'mdi-file-document',
  }

  return (
    <span className={`badge bg-${config.color}-subtle text-${config.color}`}>
      <i className={`mdi ${config.icon} me-1`}></i>
      {config.label}
    </span>
  )
}

