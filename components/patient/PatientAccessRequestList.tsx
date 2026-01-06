'use client'

import { useEffect, useState } from 'react'
import { patientApi } from '@/lib/api/patient'
import toast from 'react-hot-toast'

interface AccessRequest {
  id: number
  patient_id: number
  requesting_doctor: {
    id: number
    full_name: string
    practice_name: string
  }
  current_doctor: {
    id: number
    full_name: string
    practice_name: string
  }
  status: 'pending' | 'approved' | 'rejected'
  message?: string
  created_at: string
}

export default function PatientAccessRequestList() {
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await (patientApi as any).getAccessRequests()
      if (response.success && response.data) {
        // Filter to show only pending requests
        setRequests(response.data.filter((r: AccessRequest) => r.status === 'pending'))
      }
    } catch (error: any) {
      toast.error('Failed to fetch access requests')
      console.error('Failed to fetch requests', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    if (!confirm('Are you sure you want to grant access to this doctor? Your records will be transferred.')) {
      return
    }

    try {
      const response = await (patientApi as any).approveAccessRequest(id)
      if (response.success) {
        toast.success('Access granted. Your records have been transferred.')
        fetchRequests()
      } else {
        toast.error(response.message || 'Failed to approve request')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve request')
    }
  }

  const handleReject = async (id: number) => {
    if (!confirm('Are you sure you want to reject this access request?')) {
      return
    }

    try {
      const response = await (patientApi as any).rejectAccessRequest(id)
      if (response.success) {
        toast.success('Access request rejected')
        fetchRequests()
      } else {
        toast.error(response.message || 'Failed to reject request')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject request')
    }
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
    return (
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Pending Access Requests</h5>
        </div>
        <div className="card-body text-center py-4">
          <p className="text-muted mb-0">No pending access requests</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Pending Access Requests</h5>
      </div>
      <div className="card-body">
        {requests.map((request) => (
          <div key={request.id} className="card border mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="mb-1">
                    <strong>{request.requesting_doctor.practice_name}</strong>
                  </h6>
                  <p className="text-muted mb-0 small">
                    Dr. {request.requesting_doctor.full_name} is requesting access to your records.
                  </p>
                  {request.message && (
                    <div className="mt-2">
                      <p className="mb-0 small">
                        <strong>Message:</strong> {request.message}
                      </p>
                    </div>
                  )}
                  <p className="text-muted mb-0 small mt-2">
                    Requested on {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleApprove(request.id)}
                >
                  <i className="mdi mdi-check me-1"></i>
                  Approve
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleReject(request.id)}
                >
                  <i className="mdi mdi-close me-1"></i>
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
