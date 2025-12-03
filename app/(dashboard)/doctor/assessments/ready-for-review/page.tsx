'use client'

import { useState, useEffect } from 'react'
import { useReadyForReview, useMarkAsReviewed } from '@/hooks/doctor/useAssessments'
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
import toast from 'react-hot-toast'

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

export default function ReadyForReviewPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const { hasPermission } = usePermissions()
  const { refreshProfile } = useAuth()

  // Refresh permissions when page loads (only once on mount)
  useEffect(() => {
    refreshProfile().catch(() => {
      // Silently fail
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty array - only run once on mount

  const { data, isLoading, error, refetch } = useReadyForReview({
    page: currentPage,
    per_page: 15,
  })

  const markAsReviewedMutation = useMarkAsReviewed()

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleMarkAsReviewed = async (assessmentId: number) => {
    try {
      await markAsReviewedMutation.mutateAsync(assessmentId)
      refetch() // Refresh the list
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (error && (error as any).response?.status === 403) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessments Ready for Review" />
        <UnauthorizedMessage message="You do not have permission to view assessments ready for review." />
      </>
    )
  }

  // Filter by search term on client side (since API might not support search for ready-for-review)
  const filteredAssessments = data?.data.filter((assessment: Assessment) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      assessment.patient?.name?.toLowerCase().includes(searchLower) ||
      assessment.assessment_type?.toLowerCase().includes(searchLower)
    )
  }) || []

  return (
    <PermissionGate permission="assessment.view" fallback={<UnauthorizedMessage />}>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessments Ready for Review" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">Assessments Ready for Review</h4>
                  <p className="text-muted mb-0">Review completed assessments that require your attention.</p>
                </div>
              </div>

              {/* Search */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <SearchInput
                    placeholder="Search by patient name or assessment type..."
                    onSearch={handleSearch}
                    className="w-100"
                    debounceMs={300}
                  />
                </div>
                <div className="col-md-6">
                  <Link href="/doctor/assessments" className="btn btn-secondary">
                    <i className="uil-list-ul me-1"></i> View All Assessments
                  </Link>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : filteredAssessments.length === 0 ? (
                <div className="text-center py-5">
                  <i className="uil-check-circle font-size-48 text-success"></i>
                  <p className="text-muted mt-3">No assessments ready for review.</p>
                  <p className="text-muted small">All completed assessments have been reviewed.</p>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <h5 className="mb-0">Completed Assessments</h5>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Type</th>
                          <th>Score</th>
                          <th>Completed On</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAssessments.map((assessment: Assessment) => (
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
                            <td>{formatDate(assessment.completed_on)}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link
                                  href={`/doctor/assessments/${assessment.id}`}
                                  className="btn btn-sm btn-info"
                                  title="View Details"
                                >
                                  <i className="mdi mdi-eye"></i> View
                                </Link>
                                {hasPermission('assessment.update') && (
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleMarkAsReviewed(assessment.id)}
                                    disabled={markAsReviewedMutation.isPending}
                                    title="Mark as Reviewed"
                                  >
                                    {markAsReviewedMutation.isPending ? (
                                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                      <>
                                        <i className="mdi mdi-check-circle me-1"></i>
                                        Review
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {data?.meta && data?.links && (
                    <div className="mt-3">
                      <Pagination
                        meta={data.meta}
                        links={data.links}
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

