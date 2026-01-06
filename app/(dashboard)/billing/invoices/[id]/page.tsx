'use client'

import { useParams, useRouter } from 'next/navigation'
import { useInvoice, useDeleteInvoice, useMarkInvoiceAsPaid } from '@/hooks/billing/useInvoices'
import Breadcrumb from '@/components/common/Breadcrumb'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import InvoiceStatusBadge from '@/components/common/InvoiceStatusBadge'
import PaymentStatusBadge from '@/components/common/PaymentStatusBadge'
import PaymentMethodBadge from '@/components/common/PaymentMethodBadge'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/contexts/AuthContext'
import PaymentFormModal from '@/components/billing/PaymentFormModal'
import InvoiceFormModal from '@/components/billing/InvoiceFormModal'
import Link from 'next/link'
import { useState } from 'react'

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

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

const formatCurrency = (amount: string | number) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numAmount)
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = parseInt(params.id as string, 10)

  const { user } = useAuth()
  const { hasPermission, isAdmin } = usePermissions()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const { data: invoice, isLoading, error, refetch } = useInvoice(id)
  const invoiceData = invoice as any
  const deleteMutation = useDeleteInvoice()
  const markPaidMutation = useMarkInvoiceAsPaid()

  const canEdit = hasPermission('billing.update') || isAdmin
  const canDelete = hasPermission('billing.delete') || isAdmin
  const canCreatePayment = hasPermission('billing.create') || isAdmin

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id)
      router.push('/billing/invoices')
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleMarkAsPaid = async () => {
    try {
      await markPaidMutation.mutateAsync(id)
      refetch()
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (error && (error as any).response?.status === 403) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Invoice Details" />
        <UnauthorizedMessage message="You do not have permission to view this invoiceData." />
      </>
    )
  }

  if (error && (error as any).response?.status === 404) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Invoice Details" />
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="uil-exclamation-octagon font-size-48 text-warning"></i>
                <h4 className="mt-3 mb-2">Invoice Not Found</h4>
                <p className="text-muted">The invoice you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <Link href="/billing/invoices" className="btn btn-primary mt-3">
                  Back to Invoices
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Invoice Details" />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    )
  }

  if (!invoice) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Invoice Details" />
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="uil-exclamation-octagon font-size-48 text-warning"></i>
                <h4 className="mt-3 mb-2">No Invoice Data</h4>
                <p className="text-muted">Unable to load invoice details.</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const balance = invoiceData.balance !== undefined ? invoiceData.balance : parseFloat(invoiceData.total) - (invoiceData.total_paid || 0)
  const hasBalance = balance > 0

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Invoice Details" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              {/* Invoice Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                  <h4 className="card-title mb-1">Invoice {invoiceData.invoice_number}</h4>
                  <p className="text-muted mb-0">Created: {formatDate(invoiceData.created_at)}</p>
                </div>
                <div className="text-end">
                  <InvoiceStatusBadge status={invoiceData.status} />
                  <div className="mt-2">
                    {canEdit && (
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => setShowEditModal(true)}
                      >
                        <i className="mdi mdi-pencil me-1"></i> Edit
                      </button>
                    )}
                    {invoiceData.status === 'pending' && (
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={handleMarkAsPaid}
                        disabled={markPaidMutation.isPending}
                      >
                        {markPaidMutation.isPending ? (
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                        ) : (
                          <>
                            <i className="mdi mdi-check me-1"></i> Mark as Paid
                          </>
                        )}
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setDeleteConfirm(true)}
                        disabled={deleteMutation.isPending}
                      >
                        <i className="mdi mdi-delete me-1"></i> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Patient & Doctor Info */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 className="mb-3">Bill To</h6>
                  <p className="mb-1 fw-semibold">{invoiceData.patient?.name || 'N/A'}</p>
                  <p className="text-muted mb-0">{invoiceData.patient?.email || ''}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="mb-3">From</h6>
                  <p className="mb-1 fw-semibold">{invoiceData.doctor?.name || 'N/A'}</p>
                  <p className="text-muted mb-0">{invoiceData.doctor?.email || ''}</p>
                </div>
              </div>

              {/* Assessment Info */}
              {invoiceData.assessment && (
                <div className="mb-4">
                  <h6 className="mb-2">Related Assessment</h6>
                  <Link
                    href={`/doctor/assessments/${invoiceData.assessment.id}`}
                    className="text-primary"
                  >
                    {invoiceData.assessment.assessment_type} - View Assessment
                  </Link>
                </div>
              )}

              {/* Invoice Line Items */}
              <div className="mb-4">
                <h6 className="mb-3">Invoice Details</h6>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th style={{ width: '70%' }}>Subtotal</th>
                        <td className="text-end">{formatCurrency(invoiceData.subtotal)}</td>
                      </tr>
                      <tr>
                        <th>Tax</th>
                        <td className="text-end">{formatCurrency(invoiceData.tax)}</td>
                      </tr>
                      {parseFloat(invoiceData.discount) > 0 && (
                        <tr>
                          <th>Discount</th>
                          <td className="text-end text-danger">-{formatCurrency(invoiceData.discount)}</td>
                        </tr>
                      )}
                      <tr className="table-active">
                        <th>
                          <strong>Total</strong>
                        </th>
                        <td className="text-end">
                          <strong>{formatCurrency(invoiceData.total)}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mb-4">
                <div className="row">
                  <div className="col-md-4">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="card-title">Total Amount</h6>
                        <h4 className="text-primary">{formatCurrency(invoiceData.total)}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="card-title">Total Paid</h6>
                        <h4 className="text-success">{formatCurrency(invoiceData.total_paid || 0)}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className={`card border ${hasBalance ? 'border-danger' : 'border-success'}`}>
                      <div className="card-body">
                        <h6 className="card-title">Balance</h6>
                        <h4 className={hasBalance ? 'text-danger' : 'text-success'}>
                          {formatCurrency(balance)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Payment History</h6>
                  {hasBalance && canCreatePayment && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => setShowPaymentModal(true)}
                    >
                      <i className="mdi mdi-cash-plus me-1"></i> Record Payment
                    </button>
                  )}
                </div>
                {invoiceData.payments && invoiceData.payments.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Method</th>
                          <th>Status</th>
                          <th>Transaction ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.payments.map((payment: any) => (
                          <tr key={payment.id}>
                            <td>{formatDateTime(payment.paid_at)}</td>
                            <td className="fw-semibold">{formatCurrency(payment.amount)}</td>
                            <td>
                              <PaymentMethodBadge method={payment.payment_method} />
                            </td>
                            <td>
                              <PaymentStatusBadge status={payment.status} />
                            </td>
                            <td>{payment.transaction_id || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="alert alert-info">
                    <i className="mdi mdi-information me-2"></i>
                    No payments recorded yet.
                  </div>
                )}
              </div>

              {/* Notes */}
              {invoiceData.notes && (
                <div className="mb-4">
                  <h6 className="mb-2">Notes</h6>
                  <p className="text-muted">{invoiceData.notes}</p>
                </div>
              )}

              {/* Due Date */}
              <div className="mb-4">
                <p className="mb-1">
                  <strong>Due Date:</strong> {formatDate(invoiceData.due_date)}
                </p>
                {invoiceData.paid_at && (
                  <p className="mb-0">
                    <strong>Paid At:</strong> {formatDateTime(invoiceData.paid_at)}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-top">
                <Link href="/billing/invoices" className="btn btn-secondary">
                  <i className="mdi mdi-arrow-left me-1"></i>
                  Back to Invoices
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && invoice && (
        <PaymentFormModal
          show={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false)
            refetch()
          }}
          invoiceId={invoiceData.id}
          maxAmount={balance}
        />
      )}

      {/* Edit Invoice Modal */}
      {showEditModal && invoice && (
        <InvoiceFormModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false)
            refetch()
          }}
          invoice={invoiceData as any}
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
                  onClick={() => setDeleteConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this invoice? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
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


