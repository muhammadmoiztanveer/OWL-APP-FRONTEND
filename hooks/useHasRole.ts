import { useAuth } from '@/contexts/AuthContext'
import { hasRole } from '@/lib/utils/permissions'

export function useHasRole(roleName: string): boolean {
  const { user, impersonatingUser, isImpersonating } = useAuth()

  // When impersonating, check impersonated user's roles
  const userToCheck = isImpersonating ? impersonatingUser : user

  return hasRole(userToCheck, roleName)
}

