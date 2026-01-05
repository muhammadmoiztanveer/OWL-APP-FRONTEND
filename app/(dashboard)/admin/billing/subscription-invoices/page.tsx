'use client'

import { useState } from 'react'
import { useSubscriptionInvoices, useGenerateMonthlyInvoices, useSendInvoiceEmail, useMarkInvoiceAsPaid } from '@/hooks/billing/useSubscriptionInvoices'
import Breadcrumb from '@/components/common/Breadcrumb'
import PermissionGate from '@/components/common/PermissionGate'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import Pagination from '@/components/common/Pagination'
import { BillingInvoice } from '@/lib/types'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function SubscriptionInvoicesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const { data: invoicesData, isLoading, refetch } = useSubscriptionInvoices({
    page: currentPage,
    per_page: 15,
    status: statusFilter || undefined,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  })
  const generateMutation = useGenerateMonthlyInvoices()
  const sendEmailMutation = useSendInvoiceEmail()
  const markPaidMutation = useMarkInvoiceAsPaid()

  const handleGenerateInvoices = async () => {
    const result = await Swal.fire({
      title: 'Generate Monthly Invoices?',
      text: 'This will generate invoices for all active subscriptions. Continue?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, generate',
    })

    if (result.isConfirmed) {
      try {
        await generateMutation.mutateAsync()
        refetch()
      } catch (error) {
        // Error handled by mutation
      }
    }
  }

  const handleSendEmail = async (invoiceId: number) => {
    try {
      await sendEmailMutation.mutateAsync(invoiceId)
      refetch()
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleMarkPaid = async (invoiceId: number) => {
    const result = await Swal.fire({
      title: 'Mark as Paid?',
      text: 'This will mark the invoice as paid. Continue?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, mark as paid',
    })

    if (result.isConfirmed) {
      try {
        await markPaidMutation.mutateAsync(invoiceId)
        refetch()
      } catch (error) {
        // Error handled by mutation
      }
    }
  }

  return (
    <PermissionGate permission="billing.manage" fallback={<UnauthorizedMessage />}>
      <Breadcrumb pagetitle="Billing" title="Subscription Invoices" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Subscription Invoices</h4>
              <button
                className="btn btn-primary"
                onClick={handleGenerateInvoices}
                disabled={generateMutation.isPending}
              >
                {generateMutation.isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-file-document-plus me-1"></i>Generate Monthly Invoices
                  </>
                )}
              </button>
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
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={() => {
                      setStatusFilter('')
                      setStartDate('')
                      setEndDate('')
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
              ) : invoicesData?.data && invoicesData.data.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>Invoice #</th>
                          <th>Doctor</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Due Date</th>
                          <th>Billing Period</th>
                          <th>Email Sent</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoicesData.data.map((invoice: BillingInvoice) => (
                          <tr key={invoice.id}>
                            <td>
                              <Link href={`/admin/billing/subscription-invoices/${invoice.id}`}>
                                {invoice.invoice_number}
                              </Link>
                            </td>
                            <td>
                              {invoice.doctor?.full_name || 'N/A'}
                              <div className="text-muted small">{invoice.doctor?.email}</div>
                            </td>
                            <td>{formatCurrency(invoice.total)}</td>
                            <td>
                              {invoice.status === 'paid' ? (
                                <span className="badge bg-success-subtle text-success">Paid</span>
                              ) : invoice.status === 'overdue' ? (
                                <span className="badge bg-danger-subtle text-danger">Overdue</span>
                              ) : invoice.status === 'cancelled' ? (
                                <span className="badge bg-secondary-subtle text-secondary">Cancelled</span>
                              ) : (
                                <span className="badge bg-warning-subtle text-warning">Pending</span>
                              )}
                            </td>
                            <td>{formatDate(invoice.due_date)}</td>
                            <td>
                              {invoice.billing_period_start && invoice.billing_period_end ? (
                                <>
                                  {formatDate(invoice.billing_period_start)} -{' '}
                                  {formatDate(invoice.billing_period_end)}
                                </>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td>
                              <span className="badge bg-info-subtle text-info">
                                {invoice.email_send_count} time{invoice.email_send_count !== 1 ? 's' : ''}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleSendEmail(invoice.id)}
                                  disabled={sendEmailMutation.isPending}
                                  title="Send Email"
                                >
                                  <i className="mdi mdi-email"></i>
                                </button>
                                {invoice.status !== 'paid' && (
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleMarkPaid(invoice.id)}
                                    disabled={markPaidMutation.isPending}
                                    title="Mark as Paid"
                                  >
                                    <i className="mdi mdi-check"></i>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {invoicesData.meta && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={invoicesData.meta.last_page}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">No invoices found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PermissionGate>
  )
}






