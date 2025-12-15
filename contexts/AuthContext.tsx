'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/auth'
import { usersApi } from '@/lib/api/users'
import { onboardingApi } from '@/lib/api/onboarding'
import { User, LoginRequest, RegisterRequest, ApiResponse } from '@/lib/types'
import { apiClient } from '@/lib/api/client'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  impersonatingUser: User | null // User being impersonated (doctor)
  isImpersonating: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  loginAsDoctor: (doctorUserId: number) => Promise<void>
  stopImpersonating: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [impersonatingUser, setImpersonatingUser] = useState<User | null>(null)
  const router = useRouter()

  // Define handleLogout first since it's used by other functions
  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      setUser(null)
      apiClient.clearToken()
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }

  // Define refreshProfile after handleLogout - memoized with useCallback to prevent infinite loops
  const refreshProfile = useCallback(async () => {
    try {
      const response = await authApi.getProfile()
      if (response.success && response.data) {
        const updatedUser = response.data
        
        // ✅ CRITICAL: Verify account_type exists and preserve it
        if (!updatedUser.account_type) {
          // If account_type is missing from API response, preserve it from current user
          if (user?.account_type) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('Profile response missing account_type, preserving existing:', user.account_type)
            }
            // Merge current account_type into updated user
            const userWithAccountType = { ...updatedUser, account_type: user.account_type }
            setUser(userWithAccountType)
            localStorage.setItem('user', JSON.stringify(userWithAccountType))
            return userWithAccountType
          } else {
            // No existing account_type either - this is a critical backend issue
            if (process.env.NODE_ENV === 'development') {
              console.error('CRITICAL: Profile response missing account_type and no existing value!', {
                updatedUser,
                currentUser: user,
              })
            }
            // Still update user but log warning - backend should be fixed
            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))
            return updatedUser
          }
        }
        
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        // Log user structure in development for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('User profile refreshed:', {
            id: updatedUser.id,
            name: updatedUser.name,
            account_type: updatedUser.account_type, // ← Critical field
            roles: updatedUser.roles?.map((r) => ({
              name: r.name,
              permissions: r.permissions?.map((p) => p.name) || [],
            })),
            directPermissions: updatedUser.directPermissions?.map((p) => p.name) || [],
            allPermissions: updatedUser.allPermissions?.map((p) => p.name) || [],
            legacyPermissions: updatedUser.permissions?.map((p) => p.name) || [],
          })
        }
        
        return updatedUser
      }
    } catch (error: any) {
      console.error('Error refreshing profile:', error)
      if (error.response?.status === 401) {
        handleLogout()
      }
      throw error
    }
  }, [user]) // Include user in dependencies to access current user

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const storedUser = localStorage.getItem('user')

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser)
          
          // ✅ Verify account_type exists before setting user
          if (parsedUser && parsedUser.account_type) {
            setUser(parsedUser)
            apiClient.setToken(token)
            
            // Log for debugging
            if (process.env.NODE_ENV === 'development') {
              console.log('=== AUTH CONTEXT INIT DEBUG ===')
              console.log('1. Loaded User from Storage:', parsedUser)
              console.log('2. User Account Type:', parsedUser.account_type)
            }
            
            // Refresh profile to get latest data (but preserve account_type)
            await refreshProfile()
          } else {
            // If account_type missing, fetch from API
            console.warn('User data missing account_type, fetching from API...')
            apiClient.setToken(token)
            await refreshProfile()
          }
        }
      } catch (error) {
        console.error('Error loading user:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (data: LoginRequest) => {
    try {
      const response = await authApi.login(data)
      if (response.success && response.data) {
        const { user, token } = response.data
        setUser(user)
        apiClient.setToken(token)
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        // Log user structure in development for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('User logged in:', {
            id: user.id,
            name: user.name,
            account_type: user.account_type,
            roles: user.roles?.map((r) => ({
              name: r.name,
              permissions: r.permissions?.map((p) => p.name) || [],
            })),
            directPermissions: user.directPermissions?.map((p) => p.name) || [],
            allPermissions: user.allPermissions?.map((p) => p.name) || [],
            legacyPermissions: user.permissions?.map((p) => p.name) || [],
          })
        }
        
        toast.success('Login successful!')
        
        // ✅ NEW: Redirect patients to patient dashboard (onboarding is optional)
        if (user.account_type === 'patient') {
          router.push('/patient/dashboard')
          return
        }
        
        router.push('/dashboard')
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        error.message ||
        'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authApi.register(data)
      if (response.success && response.data) {
        const { user, token } = response.data
        setUser(user)
        apiClient.setToken(token)
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(user))
        toast.success('Registration successful!')
        
        // New users should go through onboarding
        router.push('/onboarding')
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {}).flat()[0] ||
        error.message ||
        'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const logout = async () => {
    // Clear impersonation if active
    if (impersonatingUser) {
      setImpersonatingUser(null)
      localStorage.removeItem('impersonating_user')
    }
    await handleLogout()
    toast.success('Logged out successfully')
  }

  const loginAsDoctor = async (doctorUserId: number) => {
    try {
      const response = await usersApi.loginAs(doctorUserId)
      if (response.success && response.data) {
        // Convert UserManagement to User type
        const doctorUserData = response.data
        const doctorUser: User = {
          id: doctorUserData.id,
          name: doctorUserData.name,
          email: doctorUserData.email,
          account_type: doctorUserData.account_type as any,
          roles: doctorUserData.roles,
          permissions: doctorUserData.permissions,
          directPermissions: doctorUserData.directPermissions,
          allPermissions: doctorUserData.allPermissions,
          doctor: doctorUserData.doctor,
          created_at: doctorUserData.created_at,
          updated_at: doctorUserData.updated_at,
        }
        setImpersonatingUser(doctorUser)
        localStorage.setItem('impersonating_user', JSON.stringify(doctorUser))
        toast.success(`Now viewing as ${doctorUser.name}`)
        router.push('/dashboard')
      } else {
        throw new Error(response.message || 'Failed to login as doctor')
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to login as doctor'
      toast.error(message)
      throw error
    }
  }

  const stopImpersonating = () => {
    setImpersonatingUser(null)
    localStorage.removeItem('impersonating_user')
    toast.success('Returned to admin view')
    router.push('/dashboard')
  }

  // Load impersonation state on mount
  useEffect(() => {
    const storedImpersonating = localStorage.getItem('impersonating_user')
    if (storedImpersonating) {
      try {
        setImpersonatingUser(JSON.parse(storedImpersonating))
      } catch (error) {
        console.error('Error loading impersonating user:', error)
        localStorage.removeItem('impersonating_user')
      }
    }
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    impersonatingUser,
    isImpersonating: !!impersonatingUser,
    login,
    register,
    logout,
    refreshProfile,
    loginAsDoctor,
    stopImpersonating,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

