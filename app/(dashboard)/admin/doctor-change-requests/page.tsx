'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { adminApi, DoctorChangeRequest } from '@/lib/api/admin'
import Breadcrumb from '@/components/common/Breadcrumb'
import PermissionGate from '@/components/common/PermissionGate'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import toast from 'react-hot-toast'

export default function AdminDoctorChangeRequestsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<DoctorChangeRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [processing, setProcessing] = useState<number | null>(null)

  useEffect(() => {
    fetchPendingRequests()
  }, [])

  const fetchPendingRequests = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getPendingDoctorChangeRequests()
      if (response.success && response.data) {
        setRequests(response.data)
      }
    } catch (err: any) {
      toast.error('Failed to fetch requests')
      console.error('Failed to fetch requests', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId: number) => {
    if (!confirm('Are you sure you want to approve this doctor change request? The patient will be transferred.')) {
      return
    }

    setProcessing(requestId)
    try {
      const response = await adminApi.approveDoctorChangeRequest(requestId, {
        admin_notes: adminNotes || undefined,
      })

      if (response.success) {
        toast.success('Request approved. Patient has been transferred.')
        fetchPendingRequests()
        setSelectedRequest(null)
        setAdminNotes('')
      } else {
        toast.error(response.message || 'Failed to approve request')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to approve request')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (requestId: number) => {
    if (!confirm('Are you sure you want to reject this doctor change request?')) {
      return
    }

    setProcessing(requestId)
    try {
      const response = await adminApi.rejectDoctorChangeRequest(requestId, {
        admin_notes: adminNotes || undefined,
      })

      if (response.success) {
        toast.success('Request rejected.')
        fetchPendingRequests()
        setSelectedRequest(null)
        setAdminNotes('')
      } else {
        toast.error(response.message || 'Failed to reject request')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject request')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <PermissionGate permission="admin.access" fallback={<UnauthorizedMessage />}>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Patient Doctor Change Requests" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Pending Doctor Change Requests</h5>
              <p className="text-muted mb-0">Review and approve/reject patient requests to change doctors</p>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-5">
                  <i className="mdi mdi-check-circle font-size-48 text-success mb-3"></i>
                  <p className="text-muted">No pending requests</p>
                </div>
              ) : (
                <div className="requests-list">
                  {requests.map((request) => (
                    <div key={request.id} className="card border mb-3">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-8">
                            <h5 className="mb-3">
                              Patient: {(request as any).patient?.name || 'Unknown'}
                            </h5>
                            <div className="mb-2">
                              <strong>Email:</strong> {(request as any).patient?.email || 'N/A'}
                            </div>
                            <div className="mb-2">
                              <strong>Current Doctor:</strong> {request.current_doctor.practice_name} -{' '}
                              {request.current_doctor.full_name}
                            </div>
                            <div className="mb-2">
                              <strong>Requested Doctor:</strong> {request.requested_doctor.practice_name} -{' '}
                              {request.requested_doctor.full_name}
                            </div>
                            {request.reason && (
                              <div className="mb-2">
                                <strong>Reason:</strong>
                                <p className="text-muted mb-0">{request.reason}</p>
                              </div>
                            )}
                            <div className="mb-2">
                              <strong>Requested:</strong>{' '}
                              {new Date(request.created_at).toLocaleString()}
                            </div>
                          </div>

                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">Admin Notes (Optional)</label>
                              <textarea
                                className="form-control"
                                placeholder="Add notes about your decision..."
                                rows={3}
                                value={selectedRequest === request.id ? adminNotes : ''}
                                onChange={(e) => {
                                  setSelectedRequest(request.id)
                                  setAdminNotes(e.target.value)
                                }}
                              />
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-success flex-fill"
                                onClick={() => handleApprove(request.id)}
                                disabled={processing === request.id}
                              >
                                {processing === request.id ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <i className="mdi mdi-check me-1"></i>
                                    Approve
                                  </>
                                )}
                              </button>
                              <button
                                className="btn btn-danger flex-fill"
                                onClick={() => handleReject(request.id)}
                                disabled={processing === request.id}
                              >
                                {processing === request.id ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <i className="mdi mdi-close me-1"></i>
                                    Reject
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PermissionGate>
  )
}
