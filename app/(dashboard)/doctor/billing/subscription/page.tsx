'use client'

import { useCurrentSubscription, useCancelSubscription } from '@/hooks/billing/useSubscriptions'
import Breadcrumb from '@/components/common/Breadcrumb'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

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

export default function DoctorSubscriptionPage() {
  const { data: subscription, isLoading, refetch } = useCurrentSubscription()
  const cancelMutation = useCancelSubscription()

  const handleCancel = async () => {
    const { value: reason } = await Swal.fire({
      title: 'Cancel Subscription?',
      text: 'Please provide a reason for cancellation (optional)',
      input: 'textarea',
      inputPlaceholder: 'Reason for cancellation...',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel subscription',
      inputValidator: (value) => {
        // Reason is optional
        return null
      },
    })

    if (reason !== undefined) {
      try {
        if (subscription) {
          await cancelMutation.mutateAsync({ id: subscription.id, reason: reason || undefined })
          refetch()
        }
      } catch (error) {
        // Error handled by mutation
      }
    }
  }

  if (isLoading) {
    return (
      <>
        <Breadcrumb pagetitle="Billing" title="My Subscription" />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    )
  }

  if (!subscription) {
    return (
      <>
        <Breadcrumb pagetitle="Billing" title="My Subscription" />
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="mdi mdi-package-variant text-muted" style={{ fontSize: '64px' }}></i>
                <h4 className="mt-3">No Active Subscription</h4>
                <p className="text-muted">You don't have an active subscription yet.</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="Billing" title="My Subscription" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Current Subscription</h4>
              {subscription.status === 'active' && (
                <button
                  className="btn btn-danger"
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-cancel me-1"></i>Cancel Subscription
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>{subscription.package?.name || 'N/A'}</h5>
                  {subscription.package?.description && (
                    <p className="text-muted">{subscription.package.description}</p>
                  )}

                  <div className="mt-4">
                    <h6>Subscription Details</h6>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>
                            {subscription.status === 'active' ? (
                              <span className="badge bg-success-subtle text-success">Active</span>
                            ) : subscription.status === 'suspended' ? (
                              <span className="badge bg-warning-subtle text-warning">Suspended</span>
                            ) : (
                              <span className="badge bg-secondary-subtle text-secondary">Cancelled</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Billing Cycle:</strong></td>
                          <td className="text-capitalize">{subscription.billing_cycle}</td>
                        </tr>
                        <tr>
                          <td><strong>Monthly Price:</strong></td>
                          <td>
                            {subscription.package?.monthly_price
                              ? formatCurrency(subscription.package.monthly_price)
                              : '-'}
                          </td>
                        </tr>
                        {subscription.billing_cycle === 'yearly' && subscription.package?.yearly_price && (
                          <tr>
                            <td><strong>Yearly Price:</strong></td>
                            <td>{formatCurrency(subscription.package.yearly_price)}</td>
                          </tr>
                        )}
                        <tr>
                          <td><strong>Start Date:</strong></td>
                          <td>{formatDate(subscription.start_date)}</td>
                        </tr>
                        <tr>
                          <td><strong>Next Billing Date:</strong></td>
                          <td>{formatDate(subscription.next_billing_date)}</td>
                        </tr>
                        {subscription.stripe_current_period_start && subscription.stripe_current_period_end && (
                          <>
                            <tr>
                              <td><strong>Current Period Start:</strong></td>
                              <td>{formatDate(subscription.stripe_current_period_start)}</td>
                            </tr>
                            <tr>
                              <td><strong>Current Period End:</strong></td>
                              <td>{formatDate(subscription.stripe_current_period_end)}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="col-md-6">
                  {subscription.package?.features && subscription.package.features.length > 0 && (
                    <div>
                      <h6>Package Features</h6>
                      <ul className="list-unstyled">
                        {subscription.package.features.map((feature, index) => (
                          <li key={index} className="mb-2">
                            <i className="mdi mdi-check-circle text-success me-2"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {subscription.package?.max_patients && (
                    <div className="mt-3">
                      <strong>Max Patients:</strong> {subscription.package.max_patients === -1 ? 'Unlimited' : subscription.package.max_patients}
                    </div>
                  )}

                  {subscription.package?.max_assessments_per_month && (
                    <div className="mt-2">
                      <strong>Max Assessments/Month:</strong>{' '}
                      {subscription.package.max_assessments_per_month === -1
                        ? 'Unlimited'
                        : subscription.package.max_assessments_per_month}
                    </div>
                  )}

                  {subscription.cancelled_at && (
                    <div className="alert alert-warning mt-3">
                      <strong>Cancelled:</strong> {formatDate(subscription.cancelled_at)}
                      {subscription.cancellation_reason && (
                        <div className="mt-2">
                          <strong>Reason:</strong> {subscription.cancellation_reason}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


