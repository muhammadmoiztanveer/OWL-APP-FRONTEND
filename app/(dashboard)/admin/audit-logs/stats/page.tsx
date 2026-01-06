'use client'

import { useState } from 'react'
import { useAuditLogStats } from '@/hooks/auditLogs/useAuditLogs'
import Breadcrumb from '@/components/common/Breadcrumb'
import { usePermissions } from '@/hooks/usePermissions'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import dynamic from 'next/dynamic'

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function AuditLogStatsPage() {
  const { isAdmin } = usePermissions()
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const { data: stats, isLoading, error, refetch } = useAuditLogStats({
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  })
  const statsData = stats as any

  // Check if user is admin
  if (!isAdmin) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Audit Log Statistics" />
        <UnauthorizedMessage message="You do not have permission to view audit log statistics. Admin access required." />
      </>
    )
  }

  const handleDateChange = () => {
    refetch()
  }

  const clearDates = () => {
    setStartDate('')
    setEndDate('')
    setTimeout(() => refetch(), 100)
  }

  // Prepare chart data
  const actionChartOptions = {
    chart: {
      type: 'pie' as const,
    },
    labels: statsData ? Object.keys(statsData.by_action) : [],
    title: {
      text: 'Actions Distribution',
    },
    legend: {
      position: 'bottom' as const,
    },
  }

  const actionChartSeries: number[] = statsData ? Object.values(statsData.by_action) : []

  const resourceChartOptions = {
    chart: {
      type: 'bar' as const,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      categories: statsData ? Object.keys(statsData.by_resource_type) : [],
    },
    title: {
      text: 'Resource Types Distribution',
    },
  }

  const resourceChartSeries: Array<{ name: string; data: number[] }> = [
    {
      name: 'Count',
      data: statsData ? Object.values(statsData.by_resource_type) as number[] : [],
    },
  ]

  const statusChartOptions = {
    chart: {
      type: 'pie' as const,
    },
    labels: statsData ? Object.keys(statsData.by_status) : [],
    title: {
      text: 'Status Distribution',
    },
    legend: {
      position: 'bottom' as const,
    },
    colors: ['#10b981', '#ef4444', '#f59e0b'], // green, red, orange
  }

  const statusChartSeries: number[] = statsData ? Object.values(statsData.by_status) : []

  const successRate = stats
    ? ((statsData.by_status.success || 0) / statsData.total_logs) * 100
    : 0

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Audit Log Statistics" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">Audit Log Statistics</h4>
                  <p className="text-muted mb-0">Overview of system audit log activity and compliance metrics.</p>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary" onClick={() => refetch()} disabled={isLoading}>
                    <i className="mdi mdi-refresh me-1"></i> Refresh
                  </button>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onBlur={handleDateChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    onBlur={handleDateChange}
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button className="btn btn-outline-secondary" onClick={clearDates}>
                    <i className="mdi mdi-filter-remove me-1"></i> Clear Dates
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger">
              <i className="mdi mdi-alert-circle me-2"></i>
              Failed to load statistics. Please try again.
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="row">
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{statsData?.total_logs?.toLocaleString() || 0}</h4>
                      <p className="text-muted mb-0">Total Logs</p>
                    </div>
                    <div className="avatar-sm">
                      <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-18">
                        <i className="mdi mdi-file-document-multiple"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{statsData?.phi_access_logs?.toLocaleString() || 0}</h4>
                      <p className="text-muted mb-0">PHI Access Logs</p>
                    </div>
                    <div className="avatar-sm">
                      <div className="avatar-title bg-danger-subtle text-danger rounded-circle fs-18">
                        <i className="mdi mdi-lock"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">{successRate.toFixed(1)}%</h4>
                      <p className="text-muted mb-0">Success Rate</p>
                    </div>
                    <div className="avatar-sm">
                      <div className="avatar-title bg-success-subtle text-success rounded-circle fs-18">
                        <i className="mdi mdi-check-circle"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h4 className="mb-0">
                        {(statsData?.by_status.failed || 0) + (statsData?.by_status.error || 0)}
                      </h4>
                      <p className="text-muted mb-0">Failed/Error</p>
                    </div>
                    <div className="avatar-sm">
                      <div className="avatar-title bg-warning-subtle text-warning rounded-circle fs-18">
                        <i className="mdi mdi-alert-circle"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  {typeof window !== 'undefined' && (
                    <Chart
                      options={actionChartOptions}
                      series={actionChartSeries}
                      type="pie"
                      height={350}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  {typeof window !== 'undefined' && (
                    <Chart
                      options={statusChartOptions}
                      series={statusChartSeries}
                      type="pie"
                      height={350}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  {typeof window !== 'undefined' && (
                    <Chart
                      options={resourceChartOptions}
                      series={resourceChartSeries}
                      type="bar"
                      height={350}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top Users Table */}
          {stats && statsData.top_users && statsData.top_users.length > 0 && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title mb-4">Top Users by Activity</h5>
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Email</th>
                            <th className="text-end">Activity Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statsData.top_users.map((item: any, index: number) => (
                            <tr key={item.user_id}>
                              <td>
                                <span className="badge bg-primary-subtle text-primary">
                                  #{index + 1}
                                </span>
                              </td>
                              <td>
                                <div className="fw-medium">{item.user.name}</div>
                              </td>
                              <td>
                                <div className="text-muted">{item.user.email}</div>
                              </td>
                              <td className="text-end">
                                <span className="badge bg-info-subtle text-info">
                                  {item.count.toLocaleString()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

