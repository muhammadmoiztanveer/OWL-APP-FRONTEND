'use client'

import { useEffect } from 'react'
import { useDashboardStats } from '@/hooks/doctor/useDashboardStats'
import { useAuth } from '@/contexts/AuthContext'
import Breadcrumb from '@/components/common/Breadcrumb'
import PermissionGate from '@/components/common/PermissionGate'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import StatusBadge from '@/components/common/StatusBadge'
import Link from 'next/link'
// Simple date formatter
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateString
  }
}

export default function DoctorDashboardPage() {
  const { refreshProfile } = useAuth()

  // Refresh permissions when page loads to ensure latest permissions are fetched
  useEffect(() => {
    refreshProfile().catch(() => {
      // Silently fail - permissions will be checked by PermissionGate
    })
  }, [refreshProfile])

  const { data, isLoading, error } = useDashboardStats()
  const dataTyped = data as any

  if (error && (error as any).response?.status === 403) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Dashboard" />
        <UnauthorizedMessage message="You do not have permission to view the dashboard." />
      </>
    )
  }

  return (
    <PermissionGate permission="patient.view" fallback={<UnauthorizedMessage />}>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Dashboard" />

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : dataTyped ? (
        <>
          {/* Stats Cards */}
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{dataTyped.stats.total_active_patients}</h4>
                      <p className="text-muted mb-0">Total Active Patients</p>
                    </div>
                    <div className="avatar-sm">
                      <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-18">
                        <i className="mdi mdi-account-group"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{dataTyped.stats.total_assessments}</h4>
                      <p className="text-muted mb-0">Total Assessments</p>
                    </div>
                    <div className="avatar-sm">
                      <div className="avatar-title bg-success-subtle text-success rounded-circle fs-18">
                        <i className="mdi mdi-clipboard-text"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{dataTyped.stats.pending_orders}</h4>
                      <p className="text-muted mb-0">Pending Orders</p>
                    </div>
                    <div className="avatar-sm">
                      <div className="avatar-title bg-warning-subtle text-warning rounded-circle fs-18">
                        <i className="mdi mdi-clock-outline"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Assessments */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">Recent Assessments</h5>
                    <Link href="/doctor/assessments" className="btn btn-sm btn-primary">
                      View All
                    </Link>
                  </div>
                  {dataTyped.recent_assessments && dataTyped.recent_assessments.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-nowrap align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Patient Name</th>
                            <th>Assessment Type</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th>Completed Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataTyped.recent_assessments.map((assessment: any) => (
                            <tr key={assessment.id}>
                              <td>{assessment.patient?.name || 'N/A'}</td>
                              <td>{assessment.assessment_type}</td>
                              <td>
                                <span className="fw-bold">{assessment.score}</span>
                              </td>
                              <td>
                                <StatusBadge status={assessment.status} />
                              </td>
                              <td>{formatDate(assessment.completed_on)}</td>
                              <td>
                                <Link
                                  href={`/doctor/assessments/${assessment.id}`}
                                  className="btn btn-sm btn-primary"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted mb-0">No recent assessments</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted">No data available</p>
        </div>
      )}
    </PermissionGate>
  )
}

