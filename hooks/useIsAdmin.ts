import { useAuth } from '@/contexts/AuthContext'
import { useHasRole } from './useHasRole'

/**
 * Check if the current user is an admin
 * Admin is determined by having the "admin" role
 */
export function useIsAdmin(): boolean {
  return useHasRole('admin')
}

