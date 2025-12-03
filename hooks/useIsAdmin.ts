import { useAuth } from '@/contexts/AuthContext'
import { isAdmin } from '@/lib/utils/permissions'

/**
 * Check if the current user is an admin
 * Admin is determined by having the "admin" role
 */
export function useIsAdmin(): boolean {
  const { user } = useAuth()
  return isAdmin(user)
}

