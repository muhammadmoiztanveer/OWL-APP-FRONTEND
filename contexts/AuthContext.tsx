'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/auth'
import { usersApi } from '@/lib/api/users'
import { apiClient } from '@/lib/api/client'
import { LoginRequest, RegisterRequest, User, AuthData } from '@/lib/types'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  impersonatingUser: User | null
  isImpersonating: boolean
  loginAsDoctor: (doctorId: number) => Promise<void>
  stopImpersonating: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [impersonatingUser, setImpersonatingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user')
          const storedImpersonatingUser = localStorage.getItem('impersonating_user')
          const token = localStorage.getItem('auth_token')
          
          if (storedUser && token) {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
            apiClient.setToken(token)
          } else {
            setUser(null)
          }

          if (storedImpersonatingUser) {
            const parsedImpersonatingUser = JSON.parse(storedImpersonatingUser)
            setImpersonatingUser(parsedImpersonatingUser)
          } else {
            setImpersonatingUser(null)
          }
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error)
        setUser(null)
        setImpersonatingUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Try to fetch profile if token exists but user is not loaded
  useEffect(() => {
    const fetchProfile = async () => {
      if (typeof window === 'undefined') return
      
      const token = localStorage.getItem('auth_token')
      if (token && !user) {
        try {
          const response = await authApi.getProfile()
          if (response.success && response.data) {
            setUser(response.data)
            localStorage.setItem('user', JSON.stringify(response.data))
            apiClient.setToken(token)
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
          // Clear invalid token
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          setUser(null)
        }
      }
    }

    if (!loading) {
      fetchProfile()
    }
  }, [loading, user])

  const login = useCallback(async (data: LoginRequest) => {
    try {
      const response = await authApi.login(data)
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data
        
        // Store token and user
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token)
          localStorage.setItem('user', JSON.stringify(userData))
        }
        
        apiClient.setToken(token)
        setUser(userData)
        
        toast.success('Login successful!')
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      toast.error(errorMessage)
      throw error
    }
  }, [router])

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await authApi.register(data)
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data
        
        // Store token and user
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token)
          localStorage.setItem('user', JSON.stringify(userData))
        }
        
        apiClient.setToken(token)
        setUser(userData)
        
        toast.success('Registration successful!')
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      toast.error(errorMessage)
      throw error
    }
  }, [router])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage and state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
      
      apiClient.clearToken()
      setUser(null)
      
      toast.success('Logged out successfully')
      
      // Redirect to login
      router.push('/login')
    }
  }, [router])

  const refreshProfile = useCallback(async () => {
    try {
      const response = await authApi.getProfile()
      if (response.success && response.data) {
        setUser(response.data)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data))
        }
      }
    } catch (error) {
      console.error('Error refreshing profile:', error)
      // If profile fetch fails, user might not be authenticated
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      }
      apiClient.clearToken()
      setUser(null)
    }
  }, [])

  const loginAsDoctor = useCallback(async (doctorId: number) => {
    try {
      const response = await usersApi.loginAs(doctorId)
      if (response.success && response.data) {
        const impersonatedUser = response.data as unknown as User
        
        // Store impersonating user in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('impersonating_user', JSON.stringify(impersonatedUser))
        }
        
        setImpersonatingUser(impersonatedUser)
        toast.success(`Now impersonating ${impersonatedUser.name}`)
      } else {
        throw new Error(response.message || 'Failed to start impersonation')
      }
    } catch (error: any) {
      console.error('Impersonation error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to start impersonation'
      toast.error(errorMessage)
      throw error
    }
  }, [])

  const stopImpersonating = useCallback(async () => {
    try {
      const response = await usersApi.stopImpersonation()
      if (response.success) {
        // Clear impersonating user
        if (typeof window !== 'undefined') {
          localStorage.removeItem('impersonating_user')
        }
        
        setImpersonatingUser(null)
        
        // Refresh current user profile
        await refreshProfile()
        
        toast.success('Stopped impersonating')
      } else {
        throw new Error(response.message || 'Failed to stop impersonation')
      }
    } catch (error: any) {
      console.error('Stop impersonation error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to stop impersonation'
      toast.error(errorMessage)
      throw error
    }
  }, [refreshProfile])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    refreshProfile,
    impersonatingUser,
    isImpersonating: !!impersonatingUser,
    loginAsDoctor,
    stopImpersonating,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
