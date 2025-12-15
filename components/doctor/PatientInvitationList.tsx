'use client'

import { useEffect, useState } from 'react'
import { doctorApi } from '@/lib/api/doctor'
import toast from 'react-hot-toast'

interface PatientInvitation {
  id: number
  email: string
  token: string
  expires_at: string
  used_at: string | null
  created_at: string
  user?: { id: number; name: string } | null
}

interface PatientInvitationListProps {
  includeUsed?: boolean
  refreshTrigger?: number
}

export default function PatientInvitationList({
  includeUsed = true,
  refreshTrigger = 0,
}: PatientInvitationListProps) {
  const [invitations, setInvitations] = useState<PatientInvitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvitations()
  }, [includeUsed, refreshTrigger])

  const fetchInvitations = async () => {
    setLoading(true)
    try {
      const response = await doctorApi.getPatientInvitations(includeUsed)
      if (response.success && response.data) {
        setInvitations(response.data)
      }
    } catch (error: any) {
      toast.error('Failed to fetch invitations')
      console.error('Failed to fetch invitations', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async (id: number) => {
    if (!confirm('Are you sure you want to resend this invitation?')) return

    try {
      const response = await doctorApi.resendPatientInvitation(id)
      if (response.success) {
        toast.success('Invitation resent successfully')
        fetchInvitations()
      } else {
        toast.error(response.message || 'Failed to resend invitation')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend invitation')
    }
  }

  const getStatus = (invitation: PatientInvitation): { label: string; badge: string } => {
    if (invitation.used_at) {
      return { label: 'Used', badge: 'bg-success' }
    }
    if (new Date(invitation.expires_at) < new Date()) {
      return { label: 'Expired', badge: 'bg-danger' }
    }
    return { label: 'Pending', badge: 'bg-warning' }
  }

  const copyInvitationLink = (invitation: PatientInvitation) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const invitationUrl = `${baseUrl}/onboarding?token=${invitation.token}`
    navigator.clipboard.writeText(invitationUrl)
    toast.success('Invitation link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading invitations...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Patient Invitations</h5>
      </div>
      <div className="card-body">
        {invitations.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted mb-0">No invitations found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Expires</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => {
                  const status = getStatus(inv)
                  return (
                    <tr key={inv.id}>
                      <td>{inv.email}</td>
                      <td>
                        <span className={`badge ${status.badge}`}>{status.label}</span>
                      </td>
                      <td>{new Date(inv.expires_at).toLocaleDateString()}</td>
                      <td>{new Date(inv.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-2">
                          {status.label === 'Pending' && (
                            <>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => copyInvitationLink(inv)}
                                title="Copy invitation link"
                              >
                                <i className="mdi mdi-content-copy"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleResend(inv.id)}
                                title="Resend invitation"
                              >
                                <i className="mdi mdi-email-send"></i>
                              </button>
                            </>
                          )}
                          {status.label === 'Expired' && (
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => handleResend(inv.id)}
                              title="Resend expired invitation"
                            >
                              <i className="mdi mdi-email-send"></i> Resend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
