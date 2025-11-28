import { useAuth } from '@/contexts/AuthContext'

export function useHasPermission(permissionName: string): boolean {
  const { user } = useAuth()

  if (!user || !user.permissions) {
    return false
  }

  return user.permissions.some((permission) => permission.name === permissionName)
}

