'use client'

import { useState } from 'react'
import { usePayments, useDeletePayment } from '@/hooks/billing/usePayments'
import Breadcrumb from '@/components/common/Breadcrumb'
import SearchInput from '@/components/common/SearchInput'
import Pagination from '@/components/common/Pagination'
import PaymentStatusBadge from '@/components/common/PaymentStatusBadge'
import PaymentMethodBadge from '@/components/common/PaymentMethodBadge'
import { usePermissions } from '@/hooks/usePermissions'
import PaymentFormModal from '@/components/billing/PaymentFormModal'
import Link from 'next/link'
import { Payment } from '@/lib/types'

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
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

const formatCurrency = (amount: string) => {
  const numAmount = parseFloat(amount)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numAmount)
}

export default function PaymentsPage() {
  const { hasPermission, isAdmin } = usePermissions()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [methodFilter, setMethodFilter] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const deleteMutation = useDeletePayment()

  const { data, isLoading, error } = usePayments({
    page: currentPage,
    per_page: 15,
    search: searchTerm || undefined,
    status: (statusFilter && statusFilter !== '' ? statusFilter as 'pending' | 'completed' | 'failed' | 'refunded' : undefined),
    payment_method: (methodFilter && methodFilter !== '' ? methodFilter as 'card' | 'cash' | 'bank_transfer' | 'check' | 'other' : undefined),
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  })
  const dataTyped = data as any

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      setDeleteConfirm(null)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const canCreate = hasPermission('billing.create') || isAdmin
  const canDelete = hasPermission('billing.delete') || isAdmin

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Payments" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">Payments</h4>
                  <p className="text-muted mb-0">View and manage all payments.</p>
                </div>
                {canCreate && (
                  <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    <i className="uil-plus me-1"></i> Record Payment
                  </button>
                )}
              </div>

              {/* Search and Filters */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <SearchInput
                    placeholder="Search by transaction ID or invoice..."
                    onSearch={handleSearch}
                    className="w-100"
                    debounceMs={300}
                  />
                </div>
                <div className="col-md-2">
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
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <select
                    className="form-select"
                    value={methodFilter}
                    onChange={(e) => {
                      setMethodFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  >
                    <option value="">All Methods</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value)
                      setCurrentPage(1)
                    }}
                    placeholder="Start Date"
                  />
                </div>
                <div className="col-md-3">
                  <div className="d-flex gap-2">
                    <input
                      type="date"
                      className="form-control"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value)
                        setCurrentPage(1)
                      }}
                      placeholder="End Date"
                    />
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSearchTerm('')
                        setStatusFilter('')
                        setMethodFilter('')
                        setStartDate('')
                        setEndDate('')
                        setCurrentPage(1)
                      }}
                    >
                      Clear
                    </button>
                  </div>
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
                  <i className="mdi mdi-cash-multiple font-size-48 text-muted"></i>
                  <p className="text-muted mt-3">No payments found.</p>
                  {canCreate && (
                    <button className="btn btn-primary mt-2" onClick={() => setShowCreateModal(true)}>
                      Record First Payment
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Invoice</th>
                          <th>Amount</th>
                          <th>Method</th>
                          <th>Status</th>
                          <th>Transaction ID</th>
                          <th>Paid At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(dataTyped as any)?.data.map((payment: Payment) => (
                          <tr key={payment.id}>
                            <td>
                              {payment.invoice ? (
                                <Link
                                  href={`/billing/invoices/${payment.invoice_id}`}
                                  className="text-primary"
                                >
                                  {payment.invoice.invoice_number}
                                </Link>
                              ) : (
                                `#${payment.invoice_id}`
                              )}
                            </td>
                            <td className="fw-semibold">{formatCurrency(payment.amount)}</td>
                            <td>
                              <PaymentMethodBadge method={payment.payment_method} />
                            </td>
                            <td>
                              <PaymentStatusBadge status={payment.status} />
                            </td>
                            <td>{payment.transaction_id || '-'}</td>
                            <td>{formatDateTime(payment.paid_at)}</td>
                            <td>
                              {canDelete && (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => setDeleteConfirm(payment.id)}
                                  disabled={deleteMutation.isPending}
                                  title="Delete"
                                >
                                  <i className="mdi mdi-delete"></i>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {dataTyped?.meta && dataTyped?.links && (
                    <div className="mt-3">
                      <Pagination
                        meta={dataTyped.meta}
                        links={dataTyped.links}
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

      {/* Create Payment Modal */}
      {showCreateModal && (
        <PaymentFormModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
          }}
          invoiceId={0} // Will need to be selected in form
          maxAmount={undefined}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteConfirm(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this payment? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


