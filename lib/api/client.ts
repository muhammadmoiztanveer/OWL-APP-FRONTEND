import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ApiResponse } from '@/lib/types'

// Ensure API URL always points to Railway backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://owl-app-backend-production.up.railway.app/api'

class ApiClient {
  private client: AxiosInstance
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (value?: any) => void
    reject: (error?: any) => void
  }> = []

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - Add token to headers
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor - Handle 401 and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Don't redirect if already on login page
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            this.clearAuth()
            window.location.href = '/login'
          }
        }

        // Handle 403 Forbidden - show error but don't redirect
        if (error.response?.status === 403) {
          // Error will be handled by the calling component
          return Promise.reject(error)
        }

        // Handle 401 Unauthorized - token refresh logic
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`
                }
                return this.client(originalRequest)
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const newToken = await this.refreshToken()
            this.saveToken(newToken)
            this.processQueue(null, newToken)

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }
            return this.client(originalRequest)
          } catch (refreshError) {
            this.processQueue(refreshError, null)
            this.clearAuth()
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error)
      } else {
        promise.resolve(token)
      }
    })
    this.failedQueue = []
  }

  private async refreshToken(): Promise<string> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No token to refresh')
    }

    const response = await axios.post<ApiResponse<{ token: string }>>(
      `${API_BASE_URL}/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (response.data.success && response.data.data?.token) {
      return response.data.data.token
    }

    throw new Error('Failed to refresh token')
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  private clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  }

  // Public methods
  get instance(): AxiosInstance {
    return this.client
  }

  setToken(token: string): void {
    this.saveToken(token)
  }

  clearToken(): void {
    this.clearAuth()
  }
}

export const apiClient = new ApiClient()
export default apiClient.instance

