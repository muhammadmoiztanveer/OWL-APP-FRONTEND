'use client'

import { useSubscription, useCancelSubscription } from '@/hooks/billing/useSubscriptions'
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

export default function SubscriptionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const subscriptionId = parseInt(params.id as string)

  const { data: subscription, isLoading, refetch } = useSubscription(subscriptionId)
  const subscriptionData = subscription as any
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
        await cancelMutation.mutateAsync({ id: subscriptionId, reason: reason || undefined })
        refetch()
      } catch (error) {
        // Error handled by mutation
      }
    }
  }

  if (isLoading) {
    return (
      <PermissionGate permission="billing.manage" fallback={<UnauthorizedMessage />}>
        <Breadcrumb pagetitle="Billing" title="Subscription Details" />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PermissionGate>
    )
  }

  if (!subscription) {
    return (
      <PermissionGate permission="billing.manage" fallback={<UnauthorizedMessage />}>
        <Breadcrumb pagetitle="Billing" title="Subscription Details" />
        <div className="alert alert-danger">Subscription not found</div>
      </PermissionGate>
    )
  }

  return (
    <PermissionGate permission="billing.manage" fallback={<UnauthorizedMessage />}>
      <Breadcrumb pagetitle="Billing" title="Subscription Details" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Subscription Details</h4>
              <div className="d-flex gap-2">
                {subscriptionData.status === 'active' && (
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
                <Link href="/admin/billing/subscriptions" className="btn btn-secondary">
                  <i className="mdi mdi-arrow-left me-1"></i>Back to List
                </Link>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Subscription Information</h5>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Status:</strong></td>
                        <td>
                          {subscriptionData.status === 'active' ? (
                            <span className="badge bg-success-subtle text-success">Active</span>
                          ) : subscriptionData.status === 'suspended' ? (
                            <span className="badge bg-warning-subtle text-warning">Suspended</span>
                          ) : (
                            <span className="badge bg-secondary-subtle text-secondary">Cancelled</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Billing Cycle:</strong></td>
                        <td className="text-capitalize">{subscriptionData.billing_cycle}</td>
                      </tr>
                      <tr>
                        <td><strong>Start Date:</strong></td>
                        <td>{formatDate(subscriptionData.start_date)}</td>
                      </tr>
                      <tr>
                        <td><strong>Next Billing Date:</strong></td>
                        <td>{formatDate(subscriptionData.next_billing_date)}</td>
                      </tr>
                      {subscriptionData.stripe_current_period_start && subscriptionData.stripe_current_period_end && (
                        <>
                          <tr>
                            <td><strong>Current Period Start:</strong></td>
                            <td>{formatDate(subscriptionData.stripe_current_period_start)}</td>
                          </tr>
                          <tr>
                            <td><strong>Current Period End:</strong></td>
                            <td>{formatDate(subscriptionData.stripe_current_period_end)}</td>
                          </tr>
                        </>
                      )}
                      {subscriptionData.stripe_subscription_id && (
                        <tr>
                          <td><strong>Stripe Subscription ID:</strong></td>
                          <td>
                            <span className="text-muted small" title={subscriptionData.stripe_subscription_id}>
                              {subscriptionData.stripe_subscription_id}
                            </span>
                          </td>
                        </tr>
                      )}
                      {subscriptionData.stripe_customer_id && (
                        <tr>
                          <td><strong>Stripe Customer ID:</strong></td>
                          <td>
                            <span className="text-muted small" title={subscriptionData.stripe_customer_id}>
                              {subscriptionData.stripe_customer_id}
                            </span>
                          </td>
                        </tr>
                      )}
                      {subscriptionData.cancelled_at && (
                        <tr>
                          <td><strong>Cancelled At:</strong></td>
                          <td>{formatDate(subscriptionData.cancelled_at)}</td>
                        </tr>
                      )}
                      {subscriptionData.cancellation_reason && (
                        <tr>
                          <td><strong>Cancellation Reason:</strong></td>
                          <td>{subscriptionData.cancellation_reason}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="col-md-6">
                  <h5>Doctor Information</h5>
                  {subscriptionData.doctor ? (
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Name:</strong></td>
                          <td>{subscriptionData.doctor.full_name}</td>
                        </tr>
                        <tr>
                          <td><strong>Email:</strong></td>
                          <td>{subscriptionData.doctor.email}</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-muted">No doctor information available</p>
                  )}

                  {subscriptionData.package && (
                    <>
                      <h5 className="mt-4">Package Information</h5>
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td><strong>Package Name:</strong></td>
                            <td>{subscriptionData.package.name}</td>
                          </tr>
                          {subscriptionData.package.description && (
                            <tr>
                              <td><strong>Description:</strong></td>
                              <td>{subscriptionData.package.description}</td>
                            </tr>
                          )}
                          <tr>
                            <td><strong>Monthly Price:</strong></td>
                            <td>
                              {subscriptionData.package.monthly_price
                                ? formatCurrency(subscriptionData.package.monthly_price)
                                : '-'}
                            </td>
                          </tr>
                          {subscriptionData.package.yearly_price && (
                            <tr>
                              <td><strong>Yearly Price:</strong></td>
                              <td>{formatCurrency(subscriptionData.package.yearly_price)}</td>
                            </tr>
                          )}
                          <tr>
                            <td><strong>Status:</strong></td>
                            <td>
                              {subscriptionData.package.is_active ? (
                                <span className="badge bg-success-subtle text-success">Active</span>
                              ) : (
                                <span className="badge bg-secondary-subtle text-secondary">Inactive</span>
                              )}
                            </td>
                          </tr>
                          {subscriptionData.package.max_patients && (
                            <tr>
                              <td><strong>Max Patients:</strong></td>
                              <td>
                                {subscriptionData.package.max_patients === -1
                                  ? 'Unlimited'
                                  : subscriptionData.package.max_patients}
                              </td>
                            </tr>
                          )}
                          {subscriptionData.package.max_assessments_per_month && (
                            <tr>
                              <td><strong>Max Assessments/Month:</strong></td>
                              <td>
                                {subscriptionData.package.max_assessments_per_month === -1
                                  ? 'Unlimited'
                                  : subscriptionData.package.max_assessments_per_month}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {subscriptionData.package.features && subscriptionData.package.features.length > 0 && (
                        <div className="mt-3">
                          <h6>Package Features</h6>
                          <ul className="list-unstyled">
                            {subscriptionData.package.features.map((feature: any, index: number) => (
                              <li key={index} className="mb-2">
                                <i className="mdi mdi-check-circle text-success me-2"></i>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PermissionGate>
  )
}







