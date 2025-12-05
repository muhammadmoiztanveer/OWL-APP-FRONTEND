'use client'

import { useState } from 'react'
import { useSubscriptions } from '@/hooks/billing/useSubscriptions'
import Breadcrumb from '@/components/common/Breadcrumb'
import PermissionGate from '@/components/common/PermissionGate'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import Pagination from '@/components/common/Pagination'
import { Subscription } from '@/lib/types'
import Link from 'next/link'

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateString
  }
}

export default function SubscriptionsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { data: subscriptionsData, isLoading } = useSubscriptions({
    page: currentPage,
    per_page: 15,
    status: statusFilter || undefined,
  })

  return (
    <PermissionGate permission="billing.manage" fallback={<UnauthorizedMessage />}>
      <Breadcrumb pagetitle="Billing" title="Subscriptions" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Subscriptions</h4>
            </div>
            <div className="card-body">
              {/* Filters */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : subscriptionsData?.data && subscriptionsData.data.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>Doctor</th>
                          <th>Package</th>
                          <th>Status</th>
                          <th>Billing Cycle</th>
                          <th>Next Billing Date</th>
                          <th>Stripe Subscription ID</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptionsData.data.map((subscription: Subscription) => (
                          <tr key={subscription.id}>
                            <td>
                              {subscription.doctor?.full_name || 'N/A'}
                              <div className="text-muted small">{subscription.doctor?.email}</div>
                            </td>
                            <td>
                              {subscription.package?.name || 'N/A'}
                            </td>
                            <td>
                              {subscription.status === 'active' ? (
                                <span className="badge bg-success-subtle text-success">Active</span>
                              ) : subscription.status === 'suspended' ? (
                                <span className="badge bg-warning-subtle text-warning">Suspended</span>
                              ) : (
                                <span className="badge bg-secondary-subtle text-secondary">Cancelled</span>
                              )}
                            </td>
                            <td className="text-capitalize">{subscription.billing_cycle}</td>
                            <td>{formatDate(subscription.next_billing_date)}</td>
                            <td>
                              {subscription.stripe_subscription_id ? (
                                <span className="text-muted small" title={subscription.stripe_subscription_id}>
                                  {subscription.stripe_subscription_id.substring(0, 20)}...
                                </span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <Link
                                href={`/admin/billing/subscriptions/${subscription.id}`}
                                className="btn btn-sm btn-primary"
                              >
                                <i className="mdi mdi-eye"></i> View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {subscriptionsData.meta && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={subscriptionsData.meta.last_page}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">No subscriptions found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PermissionGate>
  )
}
