'use client'

import { useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useHasRole } from '@/hooks/useHasRole'
import { useDashboardStats } from '@/hooks/doctor/useDashboardStats'
import { useOnboardingGuard } from '@/hooks/onboarding/useOnboardingGuard'
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard'
import { useInvoiceStats } from '@/hooks/billing/useInvoices'
import Breadcrumb from '@/components/common/Breadcrumb'
import PermissionGate from '@/components/common/PermissionGate'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import StatusBadge from '@/components/common/StatusBadge'
import InvoiceStatusBadge from '@/components/common/InvoiceStatusBadge'
import PaymentStatusBadge from '@/components/common/PaymentStatusBadge'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Image from 'next/image'

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

// Simple date formatter
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateString
  }
}

export default function DashboardPage() {
  const { user, refreshProfile, impersonatingUser, isImpersonating } = useAuth()
  const hasDoctorRole = useHasRole('doctor')
  const isAdmin = useHasRole('admin')
  
  // Check onboarding status and redirect if incomplete (only for patients)
  const { isOnboardingComplete, isLoading: onboardingLoading } = useOnboardingGuard()
  
  // Refresh permissions when page loads (only once on mount)
  useEffect(() => {
    refreshProfile().catch(() => {
      // Silently fail
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty array - only run once on mount
  
  // Show loading while checking onboarding (only for patients)
  const isPatient = user?.account_type === 'patient'
  if (isPatient && onboardingLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }
  
  // Don't render dashboard if onboarding is incomplete (guard will redirect) - skip for non-patients
  if (isPatient && !isOnboardingComplete) {
    return null
  }

  // When impersonating, show doctor dashboard
  // Otherwise, show doctor dashboard if user has doctor role (and not admin)
  const shouldShowDoctorDashboard = isImpersonating || (hasDoctorRole && !isAdmin)

  // Fetch doctor dashboard stats if showing doctor dashboard
  const { data: doctorDashboardData, isLoading: doctorLoading, error: doctorError } = useDashboardStats()
  
  // Fetch admin dashboard stats if admin
  const { data: adminDashboardData, isLoading: adminLoading } = useAdminDashboard()
  const { data: invoiceStats } = useInvoiceStats()

  useEffect(() => {
    // Initialize counterup (vanilla JS version)
    if (typeof window !== 'undefined') {
      const initCounterup = () => {
        const counters = document.querySelectorAll('[data-plugin="counterup"]')
        counters.forEach((counter) => {
          const target = parseFloat(counter.textContent?.replace(/[^0-9.]/g, '') || '0')
          const duration = 1200
          const increment = target / (duration / 16) // 60fps
          let current = 0

          const updateCounter = () => {
            current += increment
            if (current < target) {
              const formatted = counter.textContent?.includes('$')
                ? `$${Math.floor(current).toLocaleString()}`
                : counter.textContent?.includes('%')
                ? `${Math.floor(current)}%`
                : Math.floor(current).toLocaleString()
              counter.textContent = formatted
              requestAnimationFrame(updateCounter)
            } else {
              const formatted = counter.textContent?.includes('$')
                ? `$${target.toLocaleString()}`
                : counter.textContent?.includes('%')
                ? `${Math.floor(target)}%`
                : Math.floor(target).toLocaleString()
              counter.textContent = formatted
            }
          }
          updateCounter()
        })
      }

      setTimeout(initCounterup, 500)
    }
  }, [adminDashboardData, invoiceStats])

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount)
  }

  // Show doctor dashboard if impersonating or user is a doctor (and not admin)
  if (shouldShowDoctorDashboard) {
    if (doctorError && (doctorError as any).response?.status === 403) {
      return (
        <>
          <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Dashboard" />
          <UnauthorizedMessage message="You do not have permission to view the dashboard." />
        </>
      )
    }

    return (
      <PermissionGate permission="patient.view" fallback={<UnauthorizedMessage />}>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Dashboard" />

        {doctorLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : doctorDashboardData ? (
          <>
            {/* Stats Cards */}
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <h4 className="mb-0">{doctorDashboardData.stats.total_active_patients}</h4>
                        <p className="text-muted mb-0">Total Active Patients</p>
                      </div>
                      <div className="avatar-sm">
                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-18">
                          <i className="mdi mdi-account-group"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <h4 className="mb-0">{doctorDashboardData.stats.total_assessments}</h4>
                        <p className="text-muted mb-0">Total Assessments</p>
                      </div>
                      <div className="avatar-sm">
                        <div className="avatar-title bg-success-subtle text-success rounded-circle fs-18">
                          <i className="mdi mdi-clipboard-text"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <h4 className="mb-0">{doctorDashboardData.stats.pending_orders}</h4>
                        <p className="text-muted mb-0">Pending Orders</p>
                      </div>
                      <div className="avatar-sm">
                        <div className="avatar-title bg-warning-subtle text-warning rounded-circle fs-18">
                          <i className="mdi mdi-clock-outline"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Assessments */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0">Recent Assessments</h5>
                      <Link href="/doctor/assessments" className="btn btn-sm btn-primary">
                        View All
                      </Link>
                    </div>
                    {doctorDashboardData.recent_assessments && doctorDashboardData.recent_assessments.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-nowrap align-middle mb-0">
                          <thead>
                            <tr>
                              <th>Patient</th>
                              <th>Type</th>
                              <th>Score</th>
                              <th>Status</th>
                              <th>Date</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {doctorDashboardData.recent_assessments.map((assessment) => (
                              <tr key={assessment.id}>
                                <td>{assessment.patient?.name || 'N/A'}</td>
                                <td>{assessment.assessment_type}</td>
                                <td>
                                  <span className="fw-bold">{assessment.score ?? 'N/A'}</span>
                                </td>
                                <td>
                                  <StatusBadge status={assessment.status} />
                                </td>
                                <td>{formatDate(assessment.completed_on)}</td>
                                <td>
                                  <Link
                                    href={`/doctor/assessments/${assessment.id}`}
                                    className="btn btn-sm btn-danger"
                                  >
                                    <i className="mdi mdi-eye me-1"></i>
                                    View
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted mb-0">No recent assessments</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No data available</p>
          </div>
        )}
      </PermissionGate>
    )
  }

  // Show admin/default dashboard for admin users
  if (adminLoading) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Dashboard" />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    )
  }

  const stats = adminDashboardData || {
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    activeDoctors: 0,
    frozenDoctors: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    overdueInvoices: 0,
    recentUsers: [],
    recentDoctors: [],
    recentInvoices: [],
    recentPayments: [],
  }

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Dashboard" />

      <div className="row">
        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h4 className="mb-0">
                    {formatCurrency(stats.totalRevenue)}
                  </h4>
                  <p className="text-muted mb-0">Total Revenue</p>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-18">
                    <i className="mdi mdi-currency-usd"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h4 className="mb-0">
                    <span data-plugin="counterup">{stats.totalUsers}</span>
                  </h4>
                  <p className="text-muted mb-0">Total Users</p>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-success-subtle text-success rounded-circle fs-18">
                    <i className="mdi mdi-account-group"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h4 className="mb-0">
                    <span data-plugin="counterup">{stats.totalDoctors}</span>
                  </h4>
                  <p className="text-muted mb-0">Total Doctors</p>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-info-subtle text-info rounded-circle fs-18">
                    <i className="mdi mdi-stethoscope"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h4 className="mb-0">
                    <span data-plugin="counterup">{stats.totalPatients}</span>
                  </h4>
                  <p className="text-muted mb-0">Total Patients</p>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-warning-subtle text-warning rounded-circle fs-18">
                    <i className="mdi mdi-account-heart"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h4 className="mb-0">
                    <span data-plugin="counterup">{stats.pendingInvoices}</span>
                  </h4>
                  <p className="text-muted mb-0">Pending Invoices</p>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-warning-subtle text-warning rounded-circle fs-18">
                    <i className="mdi mdi-file-document-clock"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h4 className="mb-0">
                    <span data-plugin="counterup">{stats.paidInvoices}</span>
                  </h4>
                  <p className="text-muted mb-0">Paid Invoices</p>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-success-subtle text-success rounded-circle fs-18">
                    <i className="mdi mdi-file-document-check"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h4 className="mb-0">
                    <span data-plugin="counterup">{stats.overdueInvoices}</span>
                  </h4>
                  <p className="text-muted mb-0">Overdue Invoices</p>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-danger-subtle text-danger rounded-circle fs-18">
                    <i className="mdi mdi-file-document-alert"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title mb-0">Recent Users</h4>
                <Link href="/users" className="btn btn-sm btn-primary">
                  View All
                </Link>
              </div>
              {stats.recentUsers && stats.recentUsers.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-nowrap align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className="badge bg-info-subtle text-info text-capitalize">
                              {user.account_type}
                            </span>
                          </td>
                          <td>{formatDate(user.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No recent users</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title mb-0">Recent Doctors</h4>
                <Link href="/doctors" className="btn btn-sm btn-primary">
                  View All
                </Link>
              </div>
              {stats.recentDoctors && stats.recentDoctors.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-nowrap align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentDoctors.map((doctor) => (
                        <tr key={doctor.id}>
                          <td>{`${doctor.first_name} ${doctor.last_name}`}</td>
                          <td>{doctor.email}</td>
                          <td>
                            {doctor.is_frozen ? (
                              <span className="badge bg-danger-subtle text-danger">Frozen</span>
                            ) : (
                              <span className="badge bg-success-subtle text-success">Active</span>
                            )}
                          </td>
                          <td>{formatDate(doctor.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No recent doctors</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title mb-0">Recent Invoices</h4>
                <Link href="/billing/invoices" className="btn btn-sm btn-primary">
                  View All
                </Link>
              </div>
              {stats.recentInvoices && stats.recentInvoices.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-nowrap align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Invoice #</th>
                        <th>Doctor</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td>
                            <Link href={`/billing/invoices/${invoice.id}`} className="text-body fw-bold">
                              {invoice.invoice_number}
                            </Link>
                          </td>
                          <td>{invoice.doctor_name}</td>
                          <td>{formatCurrency(parseFloat(invoice.total))}</td>
                          <td>
                            <InvoiceStatusBadge status={invoice.status as any} />
                          </td>
                          <td>{formatDate(invoice.due_date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No recent invoices</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title mb-0">Recent Payments</h4>
                <Link href="/billing/payments" className="btn btn-sm btn-primary">
                  View All
                </Link>
              </div>
              {stats.recentPayments && stats.recentPayments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-nowrap align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Invoice #</th>
                        <th>Doctor</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentPayments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{payment.invoice_number}</td>
                          <td>{payment.doctor_name}</td>
                          <td>{formatCurrency(parseFloat(payment.amount))}</td>
                          <td className="text-capitalize">{payment.payment_method}</td>
                          <td>
                            <PaymentStatusBadge status={payment.status as any} />
                          </td>
                          <td>{formatDate(payment.paid_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No recent payments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title mb-0">Quick Actions</h4>
              </div>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <Link href="/users" className="card text-decoration-none h-100">
                    <div className="card-body text-center d-flex flex-column">
                      <i className="mdi mdi-account-group text-primary mb-3" style={{ fontSize: '48px' }}></i>
                      <h5 className="mb-2">Manage Users</h5>
                      <p className="text-muted mb-0">View and manage all users</p>
                    </div>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link href="/doctors" className="card text-decoration-none h-100">
                    <div className="card-body text-center d-flex flex-column">
                      <i className="mdi mdi-stethoscope text-info mb-3" style={{ fontSize: '48px' }}></i>
                      <h5 className="mb-2">Manage Doctors</h5>
                      <p className="text-muted mb-0">View and manage doctors</p>
                    </div>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link href="/billing/invoices" className="card text-decoration-none h-100">
                    <div className="card-body text-center d-flex flex-column">
                      <i className="mdi mdi-file-document text-success mb-3" style={{ fontSize: '48px' }}></i>
                      <h5 className="mb-2">View Invoices</h5>
                      <p className="text-muted mb-0">Manage billing invoices</p>
                    </div>
                  </Link>
                </div>
                <div className="col-md-3 mb-3">
                  <Link href="/billing/payments" className="card text-decoration-none h-100">
                    <div className="card-body text-center d-flex flex-column">
                      <i className="mdi mdi-cash-multiple text-warning mb-3" style={{ fontSize: '48px' }}></i>
                      <h5 className="mb-2">View Payments</h5>
                      <p className="text-muted mb-0">Track all payments</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

