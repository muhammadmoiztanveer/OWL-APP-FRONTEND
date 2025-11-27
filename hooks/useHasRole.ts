import { useAuth } from '@/contexts/AuthContext'

export function useHasRole(roleName: string): boolean {
  const { user } = useAuth()

  if (!user || !user.roles) {
    return false
  }

  return user.roles.some((role) => role.name === roleName)
}

