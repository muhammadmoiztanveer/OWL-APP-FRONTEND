'use client'

import { useSubscriptionInvoice, useSendInvoiceEmail, useMarkInvoiceAsPaid } from '@/hooks/billing/useSubscriptionInvoices'
import Breadcrumb from '@/components/common/Breadcrumb'
import PermissionGate from '@/components/common/PermissionGate'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import { useParams, useRouter } from 'next/navigation'
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

export default function SubscriptionInvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = parseInt(params.id as string)

  const { data: invoice, isLoading, refetch } = useSubscriptionInvoice(invoiceId)
  const sendEmailMutation = useSendInvoiceEmail()
  const markPaidMutation = useMarkInvoiceAsPaid()

  const handleSendEmail = async () => {
    try {
      await sendEmailMutation.mutateAsync(invoiceId)
      refetch()
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleMarkPaid = async () => {
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

  if (isLoading) {
    return (
      <PermissionGate permission="billing.manage" fallback={<UnauthorizedMessage />}>
        <Breadcrumb pagetitle="Billing" title="Invoice Details" />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PermissionGate>
    )
  }

  if (!invoice) {
    return (
      <PermissionGate permission="billing.manage" fallback={<UnauthorizedMessage />}>
        <Breadcrumb pagetitle="Billing" title="Invoice Details" />
        <div className="alert alert-danger">Invoice not found</div>
      </PermissionGate>
    )
  }

  return (
    <PermissionGate permission="billing.manage" fallback={<UnauthorizedMessage />}>
      <Breadcrumb pagetitle="Billing" title="Invoice Details" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Invoice #{invoice.invoice_number}</h4>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleSendEmail}
                  disabled={sendEmailMutation.isPending}
                >
                  {sendEmailMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-email me-1"></i>Send Email
                    </>
                  )}
                </button>
                {invoice.status !== 'paid' && (
                  <button
                    className="btn btn-success"
                    onClick={handleMarkPaid}
                    disabled={markPaidMutation.isPending}
                  >
                    {markPaidMutation.isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="mdi mdi-check me-1"></i>Mark as Paid
                      </>
                    )}
                  </button>
                )}
                <Link href="/admin/billing/subscription-invoices" className="btn btn-secondary">
                  <i className="mdi mdi-arrow-left me-1"></i>Back to List
                </Link>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Invoice Information</h5>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Invoice Number:</strong></td>
                        <td>{invoice.invoice_number}</td>
                      </tr>
                      <tr>
                        <td><strong>Status:</strong></td>
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
                      </tr>
                      <tr>
                        <td><strong>Invoice Type:</strong></td>
                        <td className="text-capitalize">{invoice.invoice_type}</td>
                      </tr>
                      <tr>
                        <td><strong>Due Date:</strong></td>
                        <td>{formatDate(invoice.due_date)}</td>
                      </tr>
                      {invoice.billing_period_start && invoice.billing_period_end && (
                        <>
                          <tr>
                            <td><strong>Billing Period Start:</strong></td>
                            <td>{formatDate(invoice.billing_period_start)}</td>
                          </tr>
                          <tr>
                            <td><strong>Billing Period End:</strong></td>
                            <td>{formatDate(invoice.billing_period_end)}</td>
                          </tr>
                        </>
                      )}
                      <tr>
                        <td><strong>Email Sent:</strong></td>
                        <td>
                          <span className="badge bg-info-subtle text-info">
                            {invoice.email_send_count} time{invoice.email_send_count !== 1 ? 's' : ''}
                          </span>
                          {invoice.sent_at && (
                            <div className="text-muted small">Last sent: {formatDate(invoice.sent_at)}</div>
                          )}
                        </td>
                      </tr>
                      {invoice.stripe_invoice_id && (
                        <tr>
                          <td><strong>Stripe Invoice ID:</strong></td>
                          <td>
                            <span className="text-muted small" title={invoice.stripe_invoice_id}>
                              {invoice.stripe_invoice_id}
                            </span>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="col-md-6">
                  <h5>Doctor Information</h5>
                  {invoice.doctor ? (
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Name:</strong></td>
                          <td>{invoice.doctor.full_name}</td>
                        </tr>
                        <tr>
                          <td><strong>Email:</strong></td>
                          <td>{invoice.doctor.email}</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-muted">No doctor information available</p>
                  )}

                  {invoice.subscription && (
                    <>
                      <h5 className="mt-4">Subscription Information</h5>
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td><strong>Package:</strong></td>
                            <td>{invoice.subscription.package?.name || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td><strong>Billing Cycle:</strong></td>
                            <td className="text-capitalize">{invoice.subscription.billing_cycle}</td>
                          </tr>
                          <tr>
                            <td><strong>Status:</strong></td>
                            <td>
                              {invoice.subscription.status === 'active' ? (
                                <span className="badge bg-success-subtle text-success">Active</span>
                              ) : (
                                <span className="badge bg-secondary-subtle text-secondary">
                                  {invoice.subscription.status}
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
                        <td className="text-end">{formatCurrency(invoice.subtotal)}</td>
                      </tr>
                      <tr>
                        <td><strong>Tax:</strong></td>
                        <td className="text-end">{formatCurrency(invoice.tax)}</td>
                      </tr>
                      {invoice.discount > 0 && (
                        <tr>
                          <td><strong>Discount:</strong></td>
                          <td className="text-end text-success">-{formatCurrency(invoice.discount)}</td>
                        </tr>
                      )}
                      <tr className="table-active">
                        <td><strong>Total:</strong></td>
                        <td className="text-end">
                          <strong>{formatCurrency(invoice.total)}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {invoice.paid_at && (
                <div className="alert alert-success mt-3">
                  <strong>Paid on:</strong> {formatDate(invoice.paid_at)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PermissionGate>
  )
}


