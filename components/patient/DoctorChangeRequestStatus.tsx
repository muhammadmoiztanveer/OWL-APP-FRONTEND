'use client'

import { useEffect, useState } from 'react'
import { patientApi, DoctorChangeRequest } from '@/lib/api/patient'
import toast from 'react-hot-toast'

export default function DoctorChangeRequestStatus() {
  const [requests, setRequests] = useState<DoctorChangeRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await patientApi.getDoctorChangeRequests()
      if (response.success && response.data) {
        // Show all requests (pending, approved, rejected)
        setRequests(response.data)
      }
    } catch (err: any) {
      console.error('Failed to fetch requests', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; text: string }> = {
      pending: { class: 'bg-warning', text: 'Pending Approval' },
      approved: { class: 'bg-success', text: 'Approved' },
      rejected: { class: 'bg-danger', text: 'Rejected' },
    }
    return badges[status] || badges.pending
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (requests.length === 0) {
    return null
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Doctor Change Requests</h5>
      </div>
      <div className="card-body">
        {requests.map((request) => {
          const badge = getStatusBadge(request.status)
          return (
            <div key={request.id} className="card border mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className={`badge ${badge.class}`}>{badge.text}</span>
                      <span className="text-muted small">
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mb-1">
                      <strong>From:</strong> {request.current_doctor.practice_name} -{' '}
                      {request.current_doctor.full_name}
                    </p>
                    <p className="mb-1">
                      <strong>To:</strong> {request.requested_doctor.practice_name} -{' '}
                      {request.requested_doctor.full_name}
                    </p>
                    {request.reason && (
                      <p className="mb-1">
                        <strong>Reason:</strong> {request.reason}
                      </p>
                    )}
                    {request.status === 'rejected' && request.admin_notes && (
                      <div className="alert alert-warning mt-2 mb-0">
                        <strong>Admin Notes:</strong> {request.admin_notes}
                      </div>
                    )}
                    {request.status === 'approved' && (
                      <div className="alert alert-success mt-2 mb-0">
                        <i className="mdi mdi-check-circle me-2"></i>
                        Your doctor change request has been approved. You have been transferred to the new doctor.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
