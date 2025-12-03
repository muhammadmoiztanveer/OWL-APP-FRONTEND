'use client'

import { useState, useEffect } from 'react'
import { useAssessmentOrders, useSendInvite } from '@/hooks/doctor/useAssessmentOrders'
import Breadcrumb from '@/components/common/Breadcrumb'
import PermissionGate from '@/components/common/PermissionGate'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import SearchInput from '@/components/common/SearchInput'
import Pagination from '@/components/common/Pagination'
import StatusBadge from '@/components/common/StatusBadge'
import CreateAssessmentOrderModal from '@/components/doctor/CreateAssessmentOrderModal'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/contexts/AuthContext'
import { AssessmentOrder } from '@/lib/types'
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

export default function AssessmentOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { hasPermission } = usePermissions()
  const { refreshProfile } = useAuth()

  // Refresh permissions when page loads (only once on mount)
  useEffect(() => {
    refreshProfile().catch(() => {
      // Silently fail
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty array - only run once on mount

  const { data, isLoading, error } = useAssessmentOrders({
    page: currentPage,
    per_page: 15,
    search: searchTerm || undefined,
    status: statusFilter || undefined,
  })

  const sendInviteMutation = useSendInvite()

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleSendInvite = async (orderId: number) => {
    try {
      await sendInviteMutation.mutateAsync(orderId)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  // All orders from API
  const allOrders = data?.data || []

  if (error && (error as any).response?.status === 403) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessment Orders" />
        <UnauthorizedMessage message="You do not have permission to view assessment orders." />
      </>
    )
  }

  return (
    <PermissionGate permission="assessment-order.view" fallback={<UnauthorizedMessage />}>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Assessment Orders" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Assessment Orders
                  </h4>
                  <p className="text-muted mb-0">Manage patient assessment orders</p>
                </div>
                {hasPermission('assessment-order.create') && (
                  <button
                    className="btn btn-danger"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <i className="mdi mdi-plus me-1"></i>
                    New Order
                  </button>
                )}
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
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="sent">Sent</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
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

              {/* Single unified table for all assessment orders */}
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : allOrders.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Type</th>
                          <th>Ordered On</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allOrders.map((order) => (
                          <tr key={order.id}>
                            <td>{order.patient?.name || 'N/A'}</td>
                            <td className="text-capitalize">{order.assessment_type?.replace(/_/g, ' ')}</td>
                            <td>{formatDate(order.ordered_on)}</td>
                            <td>
                              <StatusBadge status={order.status} />
                            </td>
                            <td>
                              {hasPermission('assessment-order.update') && order.status === 'pending' && (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleSendInvite(order.id)}
                                  disabled={sendInviteMutation.isPending}
                                  title="Send invite to patient"
                                >
                                  {sendInviteMutation.isPending ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                  ) : (
                                    <>
                                      <i className="mdi mdi-email-outline me-1"></i>
                                      Send Invite
                                    </>
                                  )}
                                </button>
                              )}
                              {order.status === 'sent' && (
                                <span className="text-muted small">Invite sent</span>
                              )}
                              {order.status === 'completed' && (
                                <span className="text-success small">Completed</span>
                              )}
                              {order.status === 'cancelled' && (
                                <span className="text-muted small">Cancelled</span>
                              )}
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
              ) : (
                <div className="text-center py-5">
                  <i className="uil-clipboard-notes font-size-48 text-muted"></i>
                  <p className="text-muted mt-3">No assessment orders found</p>
                  {hasPermission('assessment-order.create') && (
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => setShowCreateModal(true)}
                    >
                      Create First Order
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Assessment Order Modal */}
      <CreateAssessmentOrderModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false)
          // The query will automatically refetch due to invalidation in the mutation
        }}
      />
    </PermissionGate>
  )
}

