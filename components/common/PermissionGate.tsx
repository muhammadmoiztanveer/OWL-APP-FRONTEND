'use client'

import { ReactNode } from 'react'
import { usePermissions } from '@/hooks/usePermissions'

interface PermissionGateProps {
  permission?: string
  permissions?: string[]
  requireAll?: boolean
  role?: string
  fallback?: ReactNode
  children: ReactNode
}

export default function PermissionGate({
  permission,
  permissions,
  requireAll = false,
  role,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermission, hasRole, hasAnyPermission, hasAllPermissions, isAdmin } = usePermissions()

  // Admin bypasses all checks
  if (isAdmin) {
    return <>{children}</>
  }

  let hasAccess = false

  if (role) {
    hasAccess = hasRole(role)
  } else if (permission) {
    hasAccess = hasPermission(permission)
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions)
  } else {
    // No permission/role specified, allow access
    hasAccess = true
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

