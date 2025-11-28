// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
}

// User Types
export interface Permission {
  id: number
  name: string
}

export interface Role {
  id: number
  name: string
  permissions?: Permission[]
}

export interface User {
  id: number
  name: string
  email: string
  roles?: Role[]
  permissions?: Permission[]
}

export interface AuthData {
  user: User
  token: string
}

// Auth Request Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
}

// Role Request Types
export interface CreateRoleRequest {
  name: string
  permissions: number[]
}

export interface UpdateRoleRequest {
  name?: string
  permissions?: number[]
}

// Permission Request Types
export interface CreatePermissionRequest {
  name: string
}

export interface UpdatePermissionRequest {
  name: string
}

// Module Types
export interface Module {
  id: number
  name: string
  label: string
  permissions?: Permission[]
}

export interface PermissionGroup {
  module: string
  label: string
  permissions: Permission[]
}

// Module Request Types
export interface CreateModuleRequest {
  name: string
  label: string
}

export interface UpdateModuleRequest {
  name?: string
  label?: string
}

