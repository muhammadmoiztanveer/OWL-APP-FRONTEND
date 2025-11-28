'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/auth'
import { User, LoginRequest, RegisterRequest, ApiResponse } from '@/lib/types'
import { apiClient } from '@/lib/api/client'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const storedUser = localStorage.getItem('user')

        if (token && storedUser) {
          setUser(JSON.parse(storedUser))
          apiClient.setToken(token)
          // Refresh profile to get latest data
          await refreshProfile()
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
  }, [])

  const refreshProfile = async () => {
    try {
      const response = await authApi.getProfile()
      if (response.success && response.data) {
        setUser(response.data)
        localStorage.setItem('user', JSON.stringify(response.data))
      }
    } catch (error: any) {
      console.error('Error refreshing profile:', error)
      if (error.response?.status === 401) {
        handleLogout()
      }
    }
  }

  const login = async (data: LoginRequest) => {
    try {
      const response = await authApi.login(data)
      if (response.success && response.data) {
        const { user, token } = response.data
        setUser(user)
        apiClient.setToken(token)
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(user))
        toast.success('Login successful!')
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
        router.push('/dashboard')
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

  const logout = async () => {
    await handleLogout()
    toast.success('Logged out successfully')
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshProfile,
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

