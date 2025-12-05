'use client'

import { useState } from 'react'
import { useSubscriptionInvoices } from '@/hooks/billing/useSubscriptionInvoices'
import Breadcrumb from '@/components/common/Breadcrumb'
import Pagination from '@/components/common/Pagination'
import { BillingInvoice } from '@/lib/types'
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

export default function DoctorInvoicesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { data: invoicesData, isLoading } = useSubscriptionInvoices({
    page: currentPage,
    per_page: 15,
    status: statusFilter || undefined,
  })

  return (
    <>
      <Breadcrumb pagetitle="Billing" title="My Invoices" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">My Invoices</h4>
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
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Due Date</th>
                          <th>Billing Period</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoicesData.data.map((invoice: BillingInvoice) => (
                          <tr key={invoice.id}>
                            <td>
                              <Link href={`/doctor/billing/invoices/${invoice.id}`}>
                                {invoice.invoice_number}
                              </Link>
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
                              <Link
                                href={`/doctor/billing/invoices/${invoice.id}`}
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
    </>
  )
}
