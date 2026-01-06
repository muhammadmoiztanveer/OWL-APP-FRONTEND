'use client'

import { useSubscriptionInvoice } from '@/hooks/billing/useSubscriptionInvoices'
import Breadcrumb from '@/components/common/Breadcrumb'
import { useParams } from 'next/navigation'
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

export default function DoctorInvoiceDetailPage() {
  const params = useParams()
  const invoiceId = parseInt(params.id as string)

  const { data: invoice, isLoading } = useSubscriptionInvoice(invoiceId)
  const invoiceData = invoice as any

  if (isLoading) {
    return (
      <>
        <Breadcrumb pagetitle="Billing" title="Invoice Details" />
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
        <Breadcrumb pagetitle="Billing" title="Invoice Details" />
        <div className="alert alert-danger">Invoice not found</div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="Billing" title="Invoice Details" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Invoice #{invoiceData.invoice_number}</h4>
              <Link href="/doctor/billing/invoices" className="btn btn-secondary">
                <i className="mdi mdi-arrow-left me-1"></i>Back to List
              </Link>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Invoice Information</h5>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Invoice Number:</strong></td>
                        <td>{invoiceData.invoice_number}</td>
                      </tr>
                      <tr>
                        <td><strong>Status:</strong></td>
                        <td>
                          {invoiceData.status === 'paid' ? (
                            <span className="badge bg-success-subtle text-success">Paid</span>
                          ) : invoiceData.status === 'overdue' ? (
                            <span className="badge bg-danger-subtle text-danger">Overdue</span>
                          ) : invoiceData.status === 'cancelled' ? (
                            <span className="badge bg-secondary-subtle text-secondary">Cancelled</span>
                          ) : (
                            <span className="badge bg-warning-subtle text-warning">Pending</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Invoice Type:</strong></td>
                        <td className="text-capitalize">{invoiceData.invoice_type}</td>
                      </tr>
                      <tr>
                        <td><strong>Due Date:</strong></td>
                        <td>{formatDate(invoiceData.due_date)}</td>
                      </tr>
                      {invoiceData.billing_period_start && invoiceData.billing_period_end && (
                        <>
                          <tr>
                            <td><strong>Billing Period Start:</strong></td>
                            <td>{formatDate(invoiceData.billing_period_start)}</td>
                          </tr>
                          <tr>
                            <td><strong>Billing Period End:</strong></td>
                            <td>{formatDate(invoiceData.billing_period_end)}</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="col-md-6">
                  {invoiceData.subscription && (
                    <>
                      <h5>Subscription Information</h5>
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td><strong>Package:</strong></td>
                            <td>{invoiceData.subscription.package?.name || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td><strong>Billing Cycle:</strong></td>
                            <td className="text-capitalize">{invoiceData.subscription.billing_cycle}</td>
                          </tr>
                          <tr>
                            <td><strong>Status:</strong></td>
                            <td>
                              {invoiceData.subscription.status === 'active' ? (
                                <span className="badge bg-success-subtle text-success">Active</span>
                              ) : (
                                <span className="badge bg-secondary-subtle text-secondary">
                                  {invoiceData.subscription.status}
                                </span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-md-6 offset-md-6">
                  <h5>Invoice Summary</h5>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td><strong>Subtotal:</strong></td>
                        <td className="text-end">{formatCurrency(invoiceData.subtotal)}</td>
                      </tr>
                      <tr>
                        <td><strong>Tax:</strong></td>
                        <td className="text-end">{formatCurrency(invoiceData.tax)}</td>
                      </tr>
                      {invoiceData.discount > 0 && (
                        <tr>
                          <td><strong>Discount:</strong></td>
                          <td className="text-end text-success">-{formatCurrency(invoiceData.discount)}</td>
                        </tr>
                      )}
                      <tr className="table-active">
                        <td><strong>Total:</strong></td>
                        <td className="text-end">
                          <strong>{formatCurrency(invoiceData.total)}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {invoiceData.paid_at && (
                <div className="alert alert-success mt-3">
                  <strong>Paid on:</strong> {formatDate(invoiceData.paid_at)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}







