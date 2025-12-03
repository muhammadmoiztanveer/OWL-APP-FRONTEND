import { User, Permission } from '@/lib/types'

/**
 * Get all permissions for a user (both direct and through roles)
 * RECOMMENDED: Use user.allPermissions if available (from backend)
 */
export function getAllPermissions(user: User | null): Permission[] {
  if (!user) return []

  // RECOMMENDED: Use allPermissions array if available (from backend)
  if (user.allPermissions && user.allPermissions.length > 0) {
    return user.allPermissions
  }

  // Fallback: Build permissions array from roles and direct permissions
  const permissions = new Map<string, Permission>()

  // Add direct permissions (legacy support)
  if (user.directPermissions) {
    user.directPermissions.forEach((permission) => {
      permissions.set(permission.name, permission)
    })
  }

  // Legacy: Check user.permissions (for backward compatibility)
  if (user.permissions) {
    user.permissions.forEach((permission) => {
      permissions.set(permission.name, permission)
    })
  }

  // Add permissions through roles
  if (user.roles) {
    user.roles.forEach((role) => {
      if (role.permissions) {
        role.permissions.forEach((permission) => {
          permissions.set(permission.name, permission)
        })
      }
    })
  }

  return Array.from(permissions.values())
}

/**
 * Check if user has a specific permission
 * RECOMMENDED: Uses user.allPermissions array if available (from backend)
 * Falls back to checking roles and direct permissions
 */
export function hasPermission(user: User | null, permissionName: string): boolean {
  if (!user) return false

  // RECOMMENDED: Use allPermissions array if available (from backend)
  if (user.allPermissions?.some((p) => p.name === permissionName)) {
    return true
  }

  // Fallback: Check direct permissions
  if (user.directPermissions?.some((p) => p.name === permissionName)) {
    return true
  }

  // Legacy: Check user.permissions (for backward compatibility)
  if (user.permissions?.some((p) => p.name === permissionName)) {
    return true
  }

  // Fallback: Check permissions through roles
  if (user.roles?.some((role) => role.permissions?.some((p) => p.name === permissionName))) {
    return true
  }

  return false
}

/**
 * Check if user is an admin
 */
export function isAdmin(user: User | null): boolean {
  if (!user || !user.roles) return false
  return user.roles.some((role) => role.name === 'admin')
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, roleName: string): boolean {
  if (!user || !user.roles) return false
  return user.roles.some((role) => role.name === roleName)
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null, permissionNames: string[]): boolean {
  if (!user) return false
  return permissionNames.some((permission) => hasPermission(user, permission))
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null, permissionNames: string[]): boolean {
  if (!user) return false
  return permissionNames.every((permission) => hasPermission(user, permission))
}

