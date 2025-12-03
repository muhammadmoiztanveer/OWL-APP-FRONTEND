'use client'

import { useState } from 'react'
import { useRates, useDeleteRate } from '@/hooks/billing/useRates'
import Breadcrumb from '@/components/common/Breadcrumb'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import SearchInput from '@/components/common/SearchInput'
import Pagination from '@/components/common/Pagination'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import RateFormModal from '@/components/billing/RateFormModal'
import { Rate } from '@/lib/types'
import toast from 'react-hot-toast'

const ASSESSMENT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'PHQ-9', label: 'PHQ-9' },
  { value: 'GAD-7', label: 'GAD-7' },
  { value: 'comprehensive', label: 'Comprehensive' },
]

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateString
  }
}

const formatCurrency = (amount: string, currency: string = 'USD') => {
  const numAmount = parseFloat(amount)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(numAmount)
}

export default function RatesPage() {
  const isAdmin = useIsAdmin()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [activeFilter, setActiveFilter] = useState<string>('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingRate, setEditingRate] = useState<Rate | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const deleteMutation = useDeleteRate()

  const { data, isLoading, error } = useRates({
    page: currentPage,
    per_page: 15,
    search: searchTerm || undefined,
    assessment_type: typeFilter || undefined,
    is_active: activeFilter === '' ? undefined : activeFilter === 'true',
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

  if (!isAdmin) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Billing Rates" />
        <UnauthorizedMessage message="You do not have permission to view billing rates." />
      </>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Billing Rates" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">Billing Rates</h4>
                  <p className="text-muted mb-0">Manage assessment rates and pricing.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                  <i className="uil-plus me-1"></i> Add Rate
                </button>
              </div>

              {/* Search and Filters */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <SearchInput
                    placeholder="Search rates..."
                    onSearch={handleSearch}
                    className="w-100"
                    debounceMs={300}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  >
                    {ASSESSMENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={activeFilter}
                    onChange={(e) => {
                      setActiveFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                  >
                    <option value="">All Statuses</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() => {
                      setSearchTerm('')
                      setTypeFilter('')
                      setActiveFilter('')
                      setCurrentPage(1)
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : data && data.data && data.data.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Assessment Type</th>
                          <th>Amount</th>
                          <th>Currency</th>
                          <th>Status</th>
                          <th>Effective From</th>
                          <th>Effective To</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.data.map((rate: Rate) => (
                          <tr key={rate.id}>
                            <td>
                              <span className="badge bg-info-subtle text-info">
                                {rate.assessment_type === 'comprehensive' ? 'Comprehensive' : rate.assessment_type}
                              </span>
                            </td>
                            <td className="fw-semibold">{formatCurrency(rate.amount, rate.currency)}</td>
                            <td>{rate.currency}</td>
                            <td>
                              {rate.is_active ? (
                                <span className="badge bg-success-subtle text-success">Active</span>
                              ) : (
                                <span className="badge bg-secondary-subtle text-secondary">Inactive</span>
                              )}
                            </td>
                            <td>{formatDate(rate.effective_from)}</td>
                            <td>{formatDate(rate.effective_to)}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => setEditingRate(rate)}
                                  title="Edit"
                                >
                                  <i className="mdi mdi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => setDeleteConfirm(rate.id)}
                                  disabled={deleteMutation.isPending}
                                  title="Delete"
                                >
                                  <i className="mdi mdi-delete"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {data.meta && data.links && (
                    <div className="mt-3">
                      <Pagination
                        meta={data.meta}
                        links={data.links}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <i className="mdi mdi-currency-usd font-size-48 text-muted"></i>
                  <p className="text-muted mt-3">No rates found.</p>
                  <button className="btn btn-primary mt-2" onClick={() => setShowCreateModal(true)}>
                    Add First Rate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingRate) && (
        <RateFormModal
          show={showCreateModal || !!editingRate}
          onClose={() => {
            setShowCreateModal(false)
            setEditingRate(null)
          }}
          onSuccess={() => {
            setShowCreateModal(false)
            setEditingRate(null)
          }}
          rate={editingRate || undefined}
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
                <p>Are you sure you want to delete this rate? This action cannot be undone.</p>
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


