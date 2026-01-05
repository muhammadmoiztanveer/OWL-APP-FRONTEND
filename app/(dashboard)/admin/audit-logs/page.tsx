'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuditLogs } from '@/hooks/auditLogs/useAuditLogs'
import Breadcrumb from '@/components/common/Breadcrumb'
import Pagination from '@/components/common/Pagination'
import SearchInput from '@/components/common/SearchInput'
import ActionBadge from '@/components/common/ActionBadge'
import AuditLogStatusBadge from '@/components/common/AuditLogStatusBadge'
import PhiAccessBadge from '@/components/common/PhiAccessBadge'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/contexts/AuthContext'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import Link from 'next/link'
import { AuditLogFilters, AuditLog, PaginationMeta, PaginationLinks } from '@/lib/types'

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
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [userFilter, setUserFilter] = useState<string>('')
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('')
  const [resourceIdFilter, setResourceIdFilter] = useState<string>('')
  const [ipAddressFilter, setIpAddressFilter] = useState<string>('')
  const [startDateFilter, setStartDateFilter] = useState<string>('')
  const [endDateFilter, setEndDateFilter] = useState<string>('')
  const [phiOnlyFilter, setPhiOnlyFilter] = useState<boolean>(false)

  const { isAdmin } = usePermissions()
  const { refreshProfile } = useAuth()

  // Refresh permissions when page loads (only once on mount)
  useEffect(() => {
    refreshProfile().catch(() => {
      // Silently fail
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty array - only run once on mount

  // Memoize filters to prevent unnecessary re-renders and query key changes
  const filters: AuditLogFilters = useMemo(() => ({
    page: currentPage,
    per_page: 15,
    search: searchTerm || undefined,
    action: actionFilter || undefined,
    status: statusFilter || undefined,
    user_id: userFilter ? parseInt(userFilter) : undefined,
    resource_type: resourceTypeFilter || undefined,
    resource_id: resourceIdFilter ? parseInt(resourceIdFilter) : undefined,
    ip_address: ipAddressFilter || undefined,
    start_date: startDateFilter || undefined,
    end_date: endDateFilter || undefined,
    phi_only: phiOnlyFilter || undefined,
  }), [
    currentPage,
    searchTerm,
    actionFilter,
    statusFilter,
    userFilter,
    resourceTypeFilter,
    resourceIdFilter,
    ipAddressFilter,
    startDateFilter,
    endDateFilter,
    phiOnlyFilter,
  ])

  const { data, isLoading, error } = useAuditLogs(filters)

  // The hook returns the full response: { success: true, data: [], meta: {}, links: {} }
  // Backend format: { success: true, data: [], meta: { current_page, last_page, per_page, total, from, to }, links: { first, last, prev, next } }
  // Type guard to ensure data has the expected structure
  const hasData = data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data) && 'meta' in data && 'links' in data
  const auditLogsData = hasData 
    ? (data as { success: boolean; data: AuditLog[]; meta: PaginationMeta; links: PaginationLinks }) 
    : null

  // Debug logging (remove in production)
  useEffect(() => {
    if (data) {
      console.log('Audit Logs Response:', {
        success: (data as any).success,
        dataLength: (data as any).data?.length,
        meta: (data as any).meta,
        links: (data as any).links,
        currentPage,
        filtersPage: filters.page,
      })
    }
  }, [data, currentPage, filters.page])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleActionFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActionFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setActionFilter('')
    setStatusFilter('')
    setUserFilter('')
    setResourceTypeFilter('')
    setResourceIdFilter('')
    setIpAddressFilter('')
    setStartDateFilter('')
    setEndDateFilter('')
    setPhiOnlyFilter(false)
    setCurrentPage(1)
  }

  if (!isAdmin) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Audit Logs" />
        <UnauthorizedMessage message="You do not have permission to view audit logs. Admin access required." />
      </>
    )
  }

  if (error && (error as any).response?.status === 403) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Audit Logs" />
        <UnauthorizedMessage message="You do not have permission to view audit logs." />
      </>
    )
  }

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
                  <p className="text-muted mb-0">View system activity and user actions.</p>
                </div>
                <Link href="/admin/audit-logs/stats" className="btn btn-primary">
                  <i className="mdi mdi-chart-bar me-1"></i>
                  View Statistics
                </Link>
              </div>

              {/* Filters */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label small text-muted">Search</label>
                  <SearchInput
                    placeholder="Search by user, action, or description..."
                    onSearch={handleSearch}
                    className="w-100"
                    debounceMs={300}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label small text-muted">Action</label>
                  <select
                    className="form-select"
                    value={actionFilter}
                    onChange={handleActionFilterChange}
                  >
                    <option value="">All Actions</option>
                    <option value="create">Create</option>
                    <option value="read">Read</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="view">View</option>
                    <option value="login">Login</option>
                    <option value="logout">Logout</option>
                    <option value="export">Export</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label small text-muted">Status</label>
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                  >
                    <option value="">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label small text-muted">Resource Type</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Patient, Assessment"
                    value={resourceTypeFilter}
                    onChange={(e) => {
                      setResourceTypeFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small text-muted">User ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="User ID"
                    value={userFilter}
                    onChange={(e) => {
                      setUserFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-2">
                  <label className="form-label small text-muted">Resource ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Resource ID"
                    value={resourceIdFilter}
                    onChange={(e) => {
                      setResourceIdFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label small text-muted">IP Address</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="IP Address"
                    value={ipAddressFilter}
                    onChange={(e) => {
                      setIpAddressFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label small text-muted">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDateFilter}
                    onChange={(e) => {
                      setStartDateFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label small text-muted">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDateFilter}
                    onChange={(e) => {
                      setEndDateFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label small text-muted">PHI Only</label>
                  <div className="form-check form-switch mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={phiOnlyFilter}
                      onChange={(e) => {
                        setPhiOnlyFilter(e.target.checked)
                        setCurrentPage(1)
                      }}
                    />
                    <label className="form-check-label small">Show PHI Access Only</label>
                  </div>
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button className="btn btn-secondary w-100" onClick={handleClearFilters}>
                    <i className="mdi mdi-filter-remove me-1"></i>
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
              ) : !auditLogsData || auditLogsData.data.length === 0 ? (
                <div className="text-center py-5">
                  <i className="uil-file-alt font-size-48 text-muted"></i>
                  <p className="text-muted mt-3">No audit logs found.</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>User</th>
                          <th>Action</th>
                          <th>Resource</th>
                          <th>Status</th>
                          <th>PHI Access</th>
                          <th>IP Address</th>
                          <th>Timestamp</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogsData.data.map((log: AuditLog) => (
                          <tr key={log.id}>
                            <td>#{log.id}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div
                                  className="avatar-xs me-2"
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: '#5C6BC0',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {getUserInitials(log.user?.name || log.user?.email)}
                                </div>
                                <div>
                                  <div className="fw-semibold">{log.user?.name || 'System'}</div>
                                  {log.user?.email && (
                                    <small className="text-muted d-block">{log.user.email}</small>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <ActionBadge action={log.action} />
                            </td>
                            <td>
                              <div>
                                <div className="fw-semibold">{log.resource_type || 'N/A'}</div>
                                {log.resource_id && (
                                  <small className="text-muted">ID: {log.resource_id}</small>
                                )}
                              </div>
                            </td>
                            <td>
                              <AuditLogStatusBadge status={log.status} />
                            </td>
                            <td>
                              <PhiAccessBadge isPhiAccess={log.is_phi_access} />
                            </td>
                            <td>
                              <code className="text-muted">{log.ip_address || 'N/A'}</code>
                            </td>
                            <td>{formatDateTime(log.created_at)}</td>
                            <td>
                              <Link
                                href={`/admin/audit-logs/${log.id}`}
                                className="btn btn-sm btn-primary"
                              >
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination - only show if there are multiple pages */}
                  {auditLogsData?.meta && auditLogsData?.links && (
                    auditLogsData.meta.last_page > 1 ? (
                      <div className="mt-3">
                        <Pagination
                          meta={auditLogsData.meta}
                          links={auditLogsData.links}
                          onPageChange={(page) => {
                            console.log('Page change requested:', page, 'Current state:', currentPage)
                            setCurrentPage(page)
                          }}
                        />
                      </div>
                    ) : (
                      <div className="mt-3 text-muted text-center">
                        <small>Showing all {auditLogsData.meta.total} results</small>
                      </div>
                    )
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



