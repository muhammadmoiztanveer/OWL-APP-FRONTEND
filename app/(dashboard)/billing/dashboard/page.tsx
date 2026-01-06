'use client'

import { useInvoiceStats } from '@/hooks/billing/useInvoices'
import Breadcrumb from '@/components/common/Breadcrumb'
import { usePermissions } from '@/hooks/usePermissions'
import Link from 'next/link'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function BillingDashboardPage() {
  const { hasPermission } = usePermissions()
  const { data: stats, isLoading, error } = useInvoiceStats()
  const statsData = stats as any

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Billing Dashboard" />

      <div className="row">
        {/* Statistics Cards */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h4 className="mb-0">
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                    ) : (
                      formatCurrency(statsData?.total_revenue || 0)
                    )}
                  </h4>
                  <p className="text-muted mb-0">Total Revenue</p>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-success-subtle text-success rounded-circle fs-18">
                    <i className="mdi mdi-currency-usd"></i>
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
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                    ) : (
                      statsData?.pending_count || 0
                    )}
                  </h4>
                  <p className="text-muted mb-0">Pending Invoices</p>
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

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h4 className="mb-0">
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                    ) : (
                      statsData?.overdue_count || 0
                    )}
                  </h4>
                  <p className="text-muted mb-0">Overdue Invoices</p>
                </div>
                <div className="avatar-sm">
                  <div className="avatar-title bg-danger-subtle text-danger rounded-circle fs-18">
                    <i className="mdi mdi-alert-circle"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Quick Actions</h5>
              <div className="d-flex flex-wrap gap-3">
                <Link href="/billing/invoices/new" className="btn btn-primary">
                  <i className="mdi mdi-file-document-plus me-1"></i>
                  Create Invoice
                </Link>
                <Link href="/billing/invoices" className="btn btn-secondary">
                  <i className="mdi mdi-file-document-multiple me-1"></i>
                  View All Invoices
                </Link>
                <Link href="/billing/payments/new" className="btn btn-success">
                  <i className="mdi mdi-cash-plus me-1"></i>
                  Record Payment
                </Link>
                {hasPermission('billing.manage') && (
                  <Link href="/billing/rates" className="btn btn-info">
                    <i className="mdi mdi-currency-usd me-1"></i>
                    Manage Rates
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


