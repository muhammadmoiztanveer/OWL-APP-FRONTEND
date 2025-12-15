'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuditLogs } from '@/hooks/auditLogs/useAuditLogs'
import { auditLogsApi } from '@/lib/api/auditLogs'
import Breadcrumb from '@/components/common/Breadcrumb'
import Pagination from '@/components/common/Pagination'
import ActionBadge from '@/components/common/ActionBadge'
import AuditLogStatusBadge from '@/components/common/AuditLogStatusBadge'
import PhiAccessBadge from '@/components/common/PhiAccessBadge'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { AuditLogFilters } from '@/lib/types'
import toast from 'react-hot-toast'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'

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

const getUserInitials = (name: string | undefined) => {
  if (!name) return 'N/A'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export default function AuditLogsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAdmin } = usePermissions()
  const { user } = useAuth()

  // Check if user is admin
  if (!isAdmin) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Audit Logs" />
        <UnauthorizedMessage message="You do not have permission to view audit logs. Admin access required." />
      </>
    )
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<AuditLogFilters>({
    per_page: 15, // Default from backend
    page: 1,
  })
  const [exporting, setExporting] = useState(false)

  // Load filters from URL on mount
  useEffect(() => {
    const urlFilters: AuditLogFilters = {
      phi_only: searchParams.get('phi_only') === 'true' ? true : undefined,
      user_id: searchParams.get('user_id') ? parseInt(searchParams.get('user_id')!) : undefined,
      resource_type: searchParams.get('resource_type') || undefined,
      action: searchParams.get('action') || undefined,
      start_date: searchParams.get('start_date') || undefined,
      end_date: searchParams.get('end_date') || undefined,
      ip_address: searchParams.get('ip_address') || undefined,
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      per_page: parseInt(searchParams.get('per_page') || '15'),
      page: parseInt(searchParams.get('page') || '1'),
    }

    // Remove undefined values
    Object.keys(urlFilters).forEach((key) => {
      if (urlFilters[key as keyof AuditLogFilters] === undefined) {
        delete urlFilters[key as keyof AuditLogFilters]
      }
    })

    setFilters(urlFilters)
    setCurrentPage(urlFilters.page || 1)
  }, [searchParams])

  const { data, isLoading, error, refetch } = useAuditLogs({
    ...filters,
    page: currentPage,
  })

  const handleFilterChange = (newFilters: Partial<AuditLogFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }
    setFilters(updatedFilters)
    setCurrentPage(1)

    // Update URL
    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    router.push(`/admin/audit-logs?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({ per_page: 15, page: 1 })
    setCurrentPage(1)
    router.push('/admin/audit-logs')
  }

  const handlePerPageChange = (perPage: number) => {
    const updatedFilters = { ...filters, per_page: perPage, page: 1 }
    setFilters(updatedFilters)
    setCurrentPage(1)

    // Update URL
    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })
    router.push(`/admin/audit-logs?${params.toString()}`)
  }

  const handleExportCsv = async () => {
    setExporting(true)
    try {
      // Remove pagination from export filters
      const exportFilters = { ...filters }
      delete exportFilters.page
      delete exportFilters.per_page

      const blob = await auditLogsApi.exportCsv(exportFilters)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Audit logs exported successfully')
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to export audit logs'
      toast.error(message)
    } finally {
      setExporting(false)
    }
  }

  const handleExportJson = async () => {
    setExporting(true)
    try {
      // Remove pagination from export filters
      const exportFilters = { ...filters }
      delete exportFilters.page
      delete exportFilters.per_page

      const response = await auditLogsApi.exportJson(exportFilters)
      if (response.success && response.data) {
        const jsonStr = JSON.stringify(response.data, null, 2)
        const blob = new Blob([jsonStr], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success('Audit logs exported successfully')
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to export audit logs'
      toast.error(message)
    } finally {
      setExporting(false)
    }
  }

  const logs = data?.data || []
  const pagination = data?.meta

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Audit Logs" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">Audit Logs</h4>
                  <p className="text-muted mb-0">View and export system audit logs for HIPAA compliance.</p>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => refetch()}
                    disabled={isLoading}
                  >
                    <i className="mdi mdi-refresh me-1"></i> Refresh
                  </button>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-primary dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      disabled={exporting}
                    >
                      <i className="mdi mdi-download me-1"></i>
                      {exporting ? 'Exporting...' : 'Export'}
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button className="dropdown-item" onClick={handleExportCsv} disabled={exporting}>
                          <i className="mdi mdi-file-excel me-2"></i> Export CSV
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={handleExportJson} disabled={exporting}>
                          <i className="mdi mdi-code-json me-2"></i> Export JSON
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="row mb-3">
                <div className="col-md-12">
                  <div className="card bg-light">
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-2">
                          <label className="form-label">Records Per Page</label>
                          <select
                            className="form-select"
                            value={filters.per_page || 15}
                            onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
                          >
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                        </div>
                        <div className="col-md-2">
                          <div className="form-check mt-4">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="phiOnly"
                              checked={filters.phi_only || false}
                              onChange={(e) => handleFilterChange({ phi_only: e.target.checked || undefined })}
                            />
                            <label className="form-check-label" htmlFor="phiOnly">
                              PHI Access Only
                            </label>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Resource Type</label>
                          <select
                            className="form-select"
                            value={filters.resource_type || ''}
                            onChange={(e) => handleFilterChange({ resource_type: e.target.value || undefined })}
                          >
                            <option value="">All Types</option>
                            <option value="Patient">Patient</option>
                            <option value="Assessment">Assessment</option>
                            <option value="Invoice">Invoice</option>
                            <option value="Payment">Payment</option>
                            <option value="User">User</option>
                            <option value="Role">Role</option>
                            <option value="Permission">Permission</option>
                          </select>
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Action</label>
                          <select
                            className="form-select"
                            value={filters.action || ''}
                            onChange={(e) => handleFilterChange({ action: e.target.value || undefined })}
                          >
                            <option value="">All Actions</option>
                            <option value="create">Create</option>
                            <option value="read">Read</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                            <option value="login">Login</option>
                            <option value="logout">Logout</option>
                            <option value="export">Export</option>
                          </select>
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Status</label>
                          <select
                            className="form-select"
                            value={filters.status || ''}
                            onChange={(e) => handleFilterChange({ status: e.target.value || undefined })}
                          >
                            <option value="">All Statuses</option>
                            <option value="success">Success</option>
                            <option value="failed">Failed</option>
                            <option value="error">Error</option>
                          </select>
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Start Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={filters.start_date || ''}
                            onChange={(e) => handleFilterChange({ start_date: e.target.value || undefined })}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">End Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={filters.end_date || ''}
                            onChange={(e) => handleFilterChange({ end_date: e.target.value || undefined })}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">IP Address</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="192.168.1.1"
                            value={filters.ip_address || ''}
                            onChange={(e) => handleFilterChange({ ip_address: e.target.value || undefined })}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Search</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            value={filters.search || ''}
                            onChange={(e) => handleFilterChange({ search: e.target.value || undefined })}
                          />
                        </div>
                        <div className="col-md-12">
                          <button className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
                            <i className="mdi mdi-filter-remove me-1"></i> Clear Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger">
                  <i className="mdi mdi-alert-circle me-2"></i>
                  Failed to load audit logs. Please try again.
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-5">
                  <i className="mdi mdi-file-document-outline" style={{ fontSize: '48px', color: '#ccc' }}></i>
                  <p className="text-muted mt-3">No audit logs found</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Timestamp</th>
                          <th>User</th>
                          <th>Action</th>
                          <th>Resource</th>
                          <th>PHI</th>
                          <th>IP Address</th>
                          <th>Device</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log) => (
                          <tr key={log.id}>
                            <td>
                              <div className="text-nowrap">{formatDateTime(log.created_at)}</div>
                            </td>
                            <td>
                              {log.user ? (
                                <div className="d-flex align-items-center">
                                  <div
                                    className="avatar-xs me-2"
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '50%',
                                      backgroundColor: '#6c757d',
                                      color: 'white',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {getUserInitials(log.user.name)}
                                  </div>
                                  <div>
                                    <div className="fw-medium">{log.user.name}</div>
                                    <small className="text-muted">{log.user.email}</small>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted">System</span>
                              )}
                            </td>
                            <td>
                              <ActionBadge action={log.action} />
                            </td>
                            <td>
                              {log.resource_type ? (
                                <div>
                                  <div className="fw-medium">{log.resource_type}</div>
                                  {log.resource_id && (
                                    <small className="text-muted">#{log.resource_id}</small>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <PhiAccessBadge isPhiAccess={log.is_phi_access} />
                            </td>
                            <td>
                              <code className="text-muted">{log.ip_address || '-'}</code>
                            </td>
                            <td>
                              <div>
                                <div className="small">{log.browser || '-'}</div>
                                <small className="text-muted">{log.platform || '-'}</small>
                              </div>
                            </td>
                            <td>
                              <AuditLogStatusBadge status={log.status} />
                            </td>
                            <td>
                              <Link
                                href={`/admin/audit-logs/${log.id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="mdi mdi-eye me-1"></i> View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {data?.meta && data?.links && (
                    <div className="mt-3">
                      <Pagination
                        meta={data.meta}
                        links={data.links}
                        onPageChange={(page) => {
                          setCurrentPage(page)
                          handleFilterChange({ page })
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

