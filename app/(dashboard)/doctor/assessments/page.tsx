'use client'

import { useState, useEffect } from 'react'
import { useAssessments } from '@/hooks/doctor/useAssessments'
import Breadcrumb from '@/components/common/Breadcrumb'
import PermissionGate from '@/components/common/PermissionGate'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import SearchInput from '@/components/common/SearchInput'
import Pagination from '@/components/common/Pagination'
import StatusBadge from '@/components/common/StatusBadge'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Assessment } from '@/lib/types'

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateString
  }
}

const formatAssessmentType = (type: string) => {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function DoctorAssessmentsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { hasPermission } = usePermissions()
  const { refreshProfile } = useAuth()

  // Refresh permissions when page loads (only once on mount)
  useEffect(() => {
    refreshProfile().catch(() => {
      // Silently fail
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty array - only run once on mount

  const { data, isLoading, error } = useAssessments({
    page: currentPage,
    per_page: 15,
    status: (statusFilter && statusFilter !== '' ? statusFilter as 'pending' | 'completed' | 'reviewed' : undefined),
  } as any)
  const dataTyped = data as any

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
    setCurrentPage(1)
  }

  if (error && (error as any).response?.status === 403) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessments" />
        <UnauthorizedMessage message="You do not have permission to view assessments." />
      </>
    )
  }

  return (
    <PermissionGate permission="assessment.view" fallback={<UnauthorizedMessage />}>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessments" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">All Assessments</h4>
                  <p className="text-muted mb-0">View and manage all patient assessments.</p>
                </div>
                <Link href="/doctor/assessments/ready-for-review" className="btn btn-danger">
                  <i className="uil-check-circle me-1"></i> Ready for Review
                </Link>
              </div>

              {/* Search and Filters */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <SearchInput
                    placeholder="Search by patient name or assessment type..."
                    onSearch={handleSearch}
                    className="w-100"
                    debounceMs={300}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="reviewed">Reviewed</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('')
                      setCurrentPage(1)
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (dataTyped as any)?.data.length === 0 ? (
                <div className="text-center py-5">
                  <i className="uil-clipboard-alt font-size-48 text-muted"></i>
                  <p className="text-muted mt-3">No assessments found.</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Type</th>
                          <th>Score</th>
                          <th>Status</th>
                          <th>Completed On</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(dataTyped as any)?.data.map((assessment: Assessment) => (
                          <tr key={assessment.id}>
                            <td>{assessment.patient?.name || 'N/A'}</td>
                            <td className="text-capitalize">{formatAssessmentType(assessment.assessment_type)}</td>
                            <td>
                              {assessment.assessment_type === 'comprehensive' ? (
                                <div>
                                  <div>PHQ-9: {assessment.phq9_score || 'N/A'}</div>
                                  <div>GAD-7: {assessment.gad7_score || 'N/A'}</div>
                                </div>
                              ) : (
                                assessment.score
                              )}
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
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {dataTyped?.meta && dataTyped?.links && (
                    <div className="mt-3">
                      <Pagination
                        meta={dataTyped?.meta}
                        links={dataTyped?.links}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PermissionGate>
  )
}

