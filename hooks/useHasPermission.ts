import { useAuth } from '@/contexts/AuthContext'
import { useIsAdmin } from './useIsAdmin'
import { hasPermission } from '@/lib/utils/permissions'

export function useHasPermission(permissionName: string): boolean {
  const { user, impersonatingUser, isImpersonating } = useAuth()
  const isAdmin = useIsAdmin()

  // When impersonating, use impersonated user's permissions
  const userToCheck = isImpersonating ? impersonatingUser : user

  // Admin can do anything (only when not impersonating)
  if (isAdmin && !isImpersonating) {
    return true
  }

  // Check permissions from both direct and role-based
  return hasPermission(userToCheck, permissionName)
}

