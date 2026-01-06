'use client'

import { useState } from 'react'
import { usePdfQueue, useRetryPdfGeneration } from '@/hooks/pdf/usePdfQueue'
import Breadcrumb from '@/components/common/Breadcrumb'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import SearchInput from '@/components/common/SearchInput'
import Pagination from '@/components/common/Pagination'
import PdfStatusBadge, { PdfStatusState } from '@/components/common/PdfStatusBadge'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import { PdfQueueItem } from '@/lib/types'
import Link from 'next/link'
import toast from 'react-hot-toast'

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

const formatAssessmentType = (type: string): string => {
  if (type === 'PHQ-9') return 'PHQ-9'
  if (type === 'GAD-7') return 'GAD-7'
  if (type === 'comprehensive') return 'Comprehensive'
  return type
}

const getStatusState = (status: string): PdfStatusState => {
  switch (status) {
    case 'completed':
      return PdfStatusState.READY
    case 'processing':
    case 'pending':
      return PdfStatusState.GENERATING
    case 'failed':
      return PdfStatusState.FAILED
    default:
      return PdfStatusState.UNKNOWN
  }
}

export default function PdfQueuePage() {
  const isAdmin = useIsAdmin()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data, isLoading, error } = usePdfQueue({
    page: currentPage,
    per_page: 15,
    search: searchTerm || undefined,
    status: (statusFilter !== 'all' && statusFilter ? statusFilter as 'pending' | 'completed' | 'failed' | 'processing' : undefined),
  })
  const dataTyped = data as any

  const retryMutation = useRetryPdfGeneration()

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleRetry = async (assessmentId: number) => {
    if (!window.confirm('Retry PDF generation for this assessment?')) {
      return
    }
    retryMutation.mutate(assessmentId)
  }

  if (!isAdmin) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="PDF Generation Queue" />
        <UnauthorizedMessage message="You do not have permission to view the PDF queue." />
      </>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="PDF Generation Queue" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">PDF Generation Queue</h4>
                  <p className="text-muted mb-0">Monitor and manage PDF generation for assessments.</p>
                </div>
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
                    onChange={(e) => {
                      setStatusFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('all')
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
              ) : dataTyped && dataTyped.data && Array.isArray(dataTyped.data) && dataTyped.data.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Queue ID</th>
                          <th>Assessment ID</th>
                          <th>Patient</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Attempts</th>
                          <th>Error</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataTyped.data.map((item: PdfQueueItem) => (
                          <tr key={item.id}>
                            <td>#{item.id}</td>
                            <td>
                              <Link
                                href={`/doctor/assessments/${item.assessment_id}`}
                                className="text-primary"
                              >
                                #{item.assessment_id}
                              </Link>
                            </td>
                            <td>{item.assessment?.patient?.name || 'N/A'}</td>
                            <td>{item.assessment ? formatAssessmentType(item.assessment.assessment_type) : 'N/A'}</td>
                            <td>
                              <PdfStatusBadge status={getStatusState(item.status)} />
                            </td>
                            <td>
                              <span className="badge bg-info">{item.attempts}</span>
                            </td>
                            <td>
                              {item.error_message ? (
                                <span className="text-danger small" title={item.error_message}>
                                  {item.error_message.length > 50
                                    ? `${item.error_message.substring(0, 50)}...`
                                    : item.error_message}
                                </span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>{formatDate(item.created_at)}</td>
                            <td>
                              {item.status === 'failed' && (
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() => handleRetry(item.assessment_id)}
                                  disabled={retryMutation.isPending}
                                  title="Retry PDF Generation"
                                >
                                  {retryMutation.isPending ? (
                                    <span
                                      className="spinner-border spinner-border-sm"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                  ) : (
                                    <>
                                      <i className="mdi mdi-reload me-1"></i>
                                      Retry
                                    </>
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {dataTyped.meta && dataTyped.links && (
                    <div className="mt-3">
                      <Pagination
                        meta={dataTyped.meta}
                        links={dataTyped.links}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <i className="mdi mdi-file-pdf-box font-size-48 text-muted"></i>
                  <p className="text-muted mt-3">No PDF queue items found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

