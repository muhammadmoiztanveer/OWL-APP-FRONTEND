import api from './client'
import { ApiResponse, StripeSettings } from '@/lib/types'

export const settingsApi = {
  // Stripe Settings
  getStripeSettings: async (): Promise<ApiResponse<StripeSettings>> => {
    const response = await api.get<ApiResponse<StripeSettings>>('/settings/stripe')
    return response.data
  },

  testStripeConnection: async (): Promise<ApiResponse<StripeSettings>> => {
    const response = await api.post<ApiResponse<StripeSettings>>('/settings/stripe/test')
    return response.data
  },

  updateSetting: async (key: string, value: string): Promise<ApiResponse<{ key: string; value: string }>> => {
    const response = await api.put<ApiResponse<{ key: string; value: string }>>(`/settings/${key}`, { value })
    return response.data
  },
}






