'use client'

import { useState } from 'react'
import { useInvoices, useDeleteInvoice } from '@/hooks/billing/useInvoices'
import Breadcrumb from '@/components/common/Breadcrumb'
import SearchInput from '@/components/common/SearchInput'
import Pagination from '@/components/common/Pagination'
import InvoiceStatusBadge from '@/components/common/InvoiceStatusBadge'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/contexts/AuthContext'
import InvoiceFormModal from '@/components/billing/InvoiceFormModal'
import Link from 'next/link'
import { Invoice } from '@/lib/types'

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateString
  }
}

const formatCurrency = (amount: string) => {
  const numAmount = parseFloat(amount)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numAmount)
}

export default function InvoicesPage() {
  const { user } = useAuth()
  const { hasPermission, isAdmin } = usePermissions()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const deleteMutation = useDeleteInvoice()

  const { data, isLoading, error } = useInvoices({
    page: currentPage,
    per_page: 15,
    search: searchTerm || undefined,
    status: statusFilter || undefined,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  })

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      setDeleteConfirm(null)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const canCreate = hasPermission('billing.create') || isAdmin
  const canDelete = hasPermission('billing.delete') || isAdmin

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Invoices" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">Invoices</h4>
                  <p className="text-muted mb-0">View and manage all invoices.</p>
                </div>
                {canCreate && (
                  <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    <i className="uil-plus me-1"></i> Create Invoice
                  </button>
                )}
              </div>

              {/* Search and Filters */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <SearchInput
                    placeholder="Search by invoice number or patient..."
                    onSearch={handleSearch}
                    className="w-100"
                    debounceMs={300}
                  />
                </div>
                <div className="col-md-2">
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
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value)
                      setCurrentPage(1)
                    }}
                    placeholder="Start Date"
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value)
                      setCurrentPage(1)
                    }}
                    placeholder="End Date"
                  />
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('')
                      setStartDate('')
                      setEndDate('')
                      setCurrentPage(1)
                    }}
                  >
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
              ) : data?.data.length === 0 ? (
                <div className="text-center py-5">
                  <i className="mdi mdi-file-document font-size-48 text-muted"></i>
                  <p className="text-muted mt-3">No invoices found.</p>
                  {canCreate && (
                    <button className="btn btn-primary mt-2" onClick={() => setShowCreateModal(true)}>
                      Create First Invoice
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Invoice #</th>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Due Date</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.data.map((invoice: Invoice) => (
                          <tr key={invoice.id}>
                            <td>
                              <Link
                                href={`/billing/invoices/${invoice.id}`}
                                className="text-primary fw-semibold"
                              >
                                {invoice.invoice_number}
                              </Link>
                            </td>
                            <td>{invoice.patient?.name || 'N/A'}</td>
                            <td>{invoice.doctor?.name || 'N/A'}</td>
                            <td className="fw-semibold">{formatCurrency(invoice.total)}</td>
                            <td>
                              <InvoiceStatusBadge status={invoice.status} />
                            </td>
                            <td>{formatDate(invoice.due_date)}</td>
                            <td>{formatDate(invoice.created_at)}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link
                                  href={`/billing/invoices/${invoice.id}`}
                                  className="btn btn-sm btn-info"
                                  title="View Details"
                                >
                                  <i className="mdi mdi-eye"></i>
                                </Link>
                                {canDelete && (
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => setDeleteConfirm(invoice.id)}
                                    disabled={deleteMutation.isPending}
                                    title="Delete"
                                  >
                                    <i className="mdi mdi-delete"></i>
                                  </button>
                                )}
                              </div>
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
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <InvoiceFormModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteConfirm(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this invoice? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


