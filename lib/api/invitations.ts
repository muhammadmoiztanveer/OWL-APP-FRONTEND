import api from './client'
import { ApiResponse } from '@/lib/types'

export interface InvitationValidationResponse {
  email: string
  doctor: {
    name: string
    practice_name: string
  }
  expires_at: string
}

export const invitationsApi = {
  validate: async (token: string): Promise<ApiResponse<InvitationValidationResponse>> => {
    const response = await api.get<ApiResponse<InvitationValidationResponse>>(
      `/invitations/validate?token=${token}`
    )
    return response.data
  },
}
