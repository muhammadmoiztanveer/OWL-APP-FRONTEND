import { useCallback, useMemo, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  hasPermission,
  hasRole,
  hasAnyPermission as hasAnyPermissionUtil,
  hasAllPermissions as hasAllPermissionsUtil,
  isAdmin as isAdminUtil,
  getAllPermissions,
} from '@/lib/utils/permissions'

export function usePermissions() {
  const { user, impersonatingUser, isImpersonating } = useAuth()

  // When impersonating, use impersonated user's data
  const userToCheck = isImpersonating ? impersonatingUser : user

  // Memoize admin check (only true if actual user is admin and not impersonating)
  const isAdmin = useMemo(() => {
    if (isImpersonating) return false // When impersonating, admin bypass is disabled
    return isAdminUtil(user)
  }, [user, isImpersonating])

  // Memoize all permissions (uses user.allPermissions if available, otherwise builds from roles)
  const allPermissions = useMemo(() => getAllPermissions(userToCheck), [userToCheck])
  
  // Log permissions in development for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && userToCheck) {
      console.log('Permission check - User permissions:', {
        isImpersonating,
        actualUser: user?.name,
        impersonatedUser: impersonatingUser?.name,
        allPermissions: userToCheck.allPermissions?.map((p) => p.name) || [],
        directPermissions: userToCheck.directPermissions?.map((p) => p.name) || [],
        rolePermissions: userToCheck.roles?.flatMap((r) => r.permissions?.map((p) => p.name) || []) || [],
        computedAllPermissions: allPermissions.map((p) => p.name),
      })
    }
  }, [userToCheck, allPermissions, isImpersonating, user, impersonatingUser])

  // Permission checking function with admin bypass
  const checkPermission = useCallback(
    (permissionName: string): boolean => {
      // Admin can do anything (only when not impersonating)
      if (isAdmin) {
        return true
      }

      // Check permissions from both direct and role-based
      return hasPermission(userToCheck, permissionName)
    },
    [userToCheck, isAdmin]
  )

  // Role checking function
  const checkRole = useCallback(
    (roleName: string): boolean => {
      return hasRole(userToCheck, roleName)
    },
    [userToCheck]
  )

  // Check if user has any of the specified permissions
  const checkAnyPermission = useCallback(
    (permissionNames: string[]): boolean => {
      if (isAdmin) return true
      return hasAnyPermissionUtil(userToCheck, permissionNames)
    },
    [userToCheck, isAdmin]
  )

  // Check if user has all of the specified permissions
  const checkAllPermissions = useCallback(
    (permissionNames: string[]): boolean => {
      if (isAdmin) return true
      return hasAllPermissionsUtil(userToCheck, permissionNames)
    },
    [userToCheck, isAdmin]
  )

  return {
    user: userToCheck, // Return the user being checked (impersonated or actual)
    permissions: allPermissions, // All permissions (direct + role-based)
    roles: userToCheck?.roles || [],
    hasPermission: checkPermission,
    hasRole: checkRole,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,
    isAdmin,
  }
}

