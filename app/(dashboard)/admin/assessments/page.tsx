'use client'

import { useState, useEffect } from 'react'
import { useAdminAssessments } from '@/hooks/admin/useAdminAssessments'
import Breadcrumb from '@/components/common/Breadcrumb'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import SearchInput from '@/components/common/SearchInput'
import Pagination from '@/components/common/Pagination'
import StatusBadge from '@/components/common/StatusBadge'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Assessment } from '@/lib/types'
import { AdminAssessmentsListParams } from '@/lib/api/admin'

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
  if (type === 'PHQ-9') return 'PHQ-9'
  if (type === 'GAD-7') return 'GAD-7'
  if (type === 'comprehensive') return 'Comprehensive'
  return type.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function AdminAssessmentsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [assessmentTypeFilter, setAssessmentTypeFilter] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('completed_on')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const isAdmin = useIsAdmin()
  const { refreshProfile } = useAuth()

  // Refresh permissions when page loads (only once on mount)
  useEffect(() => {
    refreshProfile().catch(() => {
      // Silently fail
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty array - only run once on mount

  const params: any = {
    page: currentPage,
    per_page: 15,
    status: (statusFilter && statusFilter !== '' ? statusFilter as 'pending' | 'completed' | 'reviewed' : undefined),
    sort_by: sortBy,
    sort_order: sortOrder,
  }

  const { data, isLoading, error } = useAdminAssessments(params)
  const dataTyped = data as any

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleAssessmentTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAssessmentTypeFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
    setCurrentPage(1)
  }

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc')
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setAssessmentTypeFilter('')
    setSortBy('completed_on')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  if (!isAdmin) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="All Assessments" />
        <UnauthorizedMessage message="Only administrators can view all assessments." />
      </>
    )
  }

  if (error && (error as any).response?.status === 403) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="All Assessments" />
        <UnauthorizedMessage message="You do not have permission to view all assessments." />
      </>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="All Assessments" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">All Assessments</h4>
                  <p className="text-muted mb-0">View all assessments across all doctors.</p>
                </div>
              </div>

              {/* Filters */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <SearchInput
                    placeholder="Search by patient name or assessment type..."
                    onSearch={handleSearch}
                    className="w-100"
                    debounceMs={300}
                  />
                </div>
                <div className="col-md-2">
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
                <div className="col-md-2">
                  <select
                    className="form-select"
                    value={assessmentTypeFilter}
                    onChange={handleAssessmentTypeFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="PHQ-9">PHQ-9</option>
                    <option value="GAD-7">GAD-7</option>
                    <option value="comprehensive">Comprehensive</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <select className="form-select" value={sortBy} onChange={handleSortChange}>
                    <option value="completed_on">Completed Date</option>
                    <option value="created_at">Created Date</option>
                    <option value="score">Score</option>
                    <option value="assessment_type">Type</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <select className="form-select" value={sortOrder} onChange={handleSortOrderChange}>
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <button className="btn btn-secondary btn-sm" onClick={handleClearFilters}>
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
              ) : (data && (data as any).data && (data as any).data.length === 0) ? (
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
                          <th>Assessment</th>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Assigned By</th>
                          <th>Status</th>
                          <th>Score</th>
                          <th>Completed</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data as any)?.data?.map((assessment: Assessment) => (
                          <tr key={(assessment as any).id}>
                            <td>
                              <div className="fw-semibold">{formatAssessmentType((assessment as any).assessment_type)}</div>
                              <small className="text-muted">ID: #{(assessment as any).id}</small>
                            </td>
                            <td>
                              <div>{(assessment as any).patient?.name || 'N/A'}</div>
                              {(assessment as any).patient?.email && (
                                <small className="text-muted">{(assessment as any).patient.email}</small>
                              )}
                            </td>
                            <td>
                              <div>{(assessment as any).doctor?.first_name && (assessment as any).doctor?.last_name 
                                ? `${(assessment as any).doctor.first_name} ${(assessment as any).doctor.last_name}`
                                : (assessment as any).doctor?.full_name || 'N/A'}</div>
                              {(assessment as any).doctor?.practice_name && (
                                <small className="text-muted">{(assessment as any).doctor.practice_name}</small>
                              )}
                            </td>
                            <td>
                              {(assessment as any).assessment_order?.assigned_by_doctor ? (
                                <>
                                  <div>
                                    {(assessment as any).assessment_order.assigned_by_doctor.first_name && 
                                     (assessment as any).assessment_order.assigned_by_doctor.last_name
                                      ? `${(assessment as any).assessment_order.assigned_by_doctor.first_name} ${(assessment as any).assessment_order.assigned_by_doctor.last_name}`
                                      : (assessment as any).assessment_order.assigned_by_doctor.full_name || 'N/A'}
                                  </div>
                                  {(assessment as any).assessment_order.assigned_by_doctor.practice_name && (
                                    <small className="text-muted">
                                      {(assessment as any).assessment_order.assigned_by_doctor.practice_name}
                                    </small>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted">N/A</span>
                              )}
                            </td>
                            <td>
                              <StatusBadge status={(assessment as any).status} />
                            </td>
                            <td>
                              {(assessment as any).assessment_type === 'comprehensive' ? (
                                <div>
                                  <div>PHQ-9: {(assessment as any).phq9_score ?? 'N/A'}</div>
                                  <div>GAD-7: {(assessment as any).gad7_score ?? 'N/A'}</div>
                                </div>
                              ) : (
                                (assessment as any).score ?? 'N/A'
                              )}
                            </td>
                            <td>{formatDate((assessment as any).completed_on)}</td>
                            <td>
                              <Link
                                href={`/admin/assessments/${(assessment as any).id}`}
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
                  {(data as any)?.meta && (data as any)?.links && (
                    <div className="mt-3">
                      <Pagination
                        meta={(data as any).meta}
                        links={(data as any).links}
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
    </>
  )
}



