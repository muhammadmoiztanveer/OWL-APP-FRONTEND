'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { doctorsApi } from '@/lib/api/doctors'
import { Doctor, CreateDoctorRequest, UpdateDoctorRequest, DoctorsListParams } from '@/lib/types'
import { useHasPermission } from '@/hooks/useHasPermission'
import Breadcrumb from '@/components/common/Breadcrumb'
import toast from 'react-hot-toast'
import DoctorModal from '@/components/doctors/DoctorModal'

// Phone number formatter
const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [freezeConfirm, setFreezeConfirm] = useState<{ id: number; action: 'freeze' | 'unfreeze' } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [isFrozenFilter, setIsFrozenFilter] = useState<boolean | undefined>(undefined)
  const [sortBy, setSortBy] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [processing, setProcessing] = useState<number | null>(null)

  const canView = useHasPermission('view doctors')
  const canCreate = useHasPermission('create doctors')
  const canEdit = useHasPermission('edit doctors')
  const canDelete = useHasPermission('delete doctors')
  const canFreeze = useHasPermission('freeze doctors')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1) // Reset to first page on new search
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    if (canView) {
      loadDoctors()
    }
  }, [canView, debouncedSearch, currentPage, perPage, isFrozenFilter, sortBy, sortOrder])

  const loadDoctors = async () => {
    try {
      setLoading(true)
      const params: DoctorsListParams = {
        page: currentPage,
        per_page: perPage,
        search: debouncedSearch || undefined,
        is_frozen: isFrozenFilter,
        sort_by: sortBy || undefined,
        sort_order: sortOrder,
      }
      const response = await doctorsApi.list(params)
      if (response.success && response.data) {
        setDoctors(response.data)
        setTotalPages(response.meta.last_page)
        setTotal(response.meta.total)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      setProcessing(id)
      const response = await doctorsApi.delete(id)
      if (response.success) {
        toast.success('Doctor deleted successfully')
        setDeleteConfirm(null)
        loadDoctors()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete doctor')
    } finally {
      setProcessing(null)
    }
  }

  const handleFreezeToggle = async (id: number, action: 'freeze' | 'unfreeze') => {
    try {
      setProcessing(id)
      const response = action === 'freeze' 
        ? await doctorsApi.freeze(id)
        : await doctorsApi.unfreeze(id)
      
      if (response.success) {
        toast.success(`Doctor ${action === 'freeze' ? 'frozen' : 'unfrozen'} successfully`)
        setFreezeConfirm(null)
        loadDoctors()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${action} doctor`)
    } finally {
      setProcessing(null)
    }
  }

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setShowModal(true)
  }

  const handleCreate = () => {
    setEditingDoctor(null)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingDoctor(null)
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  if (!canView) {
    return (
      <>
        <Breadcrumb pagetitle="Pages" title="Doctors" />
        <div className="alert alert-danger" role="alert">
          You don&apos;t have permission to view doctors.
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="Pages" title="Doctors" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">Doctors Management</h4>
                  <p className="text-muted mb-0">
                    Manage doctor accounts and information.
                  </p>
                </div>
                {canCreate && (
                  <button className="btn btn-primary" onClick={handleCreate}>
                    <i className="mdi mdi-plus me-2"></i>Add New Doctor
                  </button>
                )}
              </div>

              {/* Filters and Search */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, email, or practice..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={isFrozenFilter === undefined ? '' : isFrozenFilter ? 'frozen' : 'active'}
                    onChange={(e) => {
                      const value = e.target.value
                      setIsFrozenFilter(value === '' ? undefined : value === 'frozen')
                      setCurrentPage(1)
                    }}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="frozen">Frozen</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : doctors.length === 0 ? (
                <div className="text-center py-5">
                  <i className="uil-user-md font-size-48 text-muted"></i>
                  <p className="text-muted mt-3">No doctors found</p>
                  {canCreate && (
                    <button className="btn btn-primary mt-2" onClick={handleCreate}>
                      Add First Doctor
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th>
                            <button
                              className="btn btn-link p-0 text-decoration-none"
                              onClick={() => handleSort('first_name')}
                            >
                              Name
                              {sortBy === 'first_name' && (
                                <i className={`mdi mdi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
                              )}
                            </button>
                          </th>
                          <th>
                            <button
                              className="btn btn-link p-0 text-decoration-none"
                              onClick={() => handleSort('email')}
                            >
                              Email
                              {sortBy === 'email' && (
                                <i className={`mdi mdi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
                              )}
                            </button>
                          </th>
                          <th>Practice</th>
                          <th>Specialty</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctors.map((doctor) => (
                          <tr key={doctor.id}>
                            <td>
                              {doctor.first_name} {doctor.last_name}
                            </td>
                            <td>{doctor.email}</td>
                            <td>{doctor.practice_name || '-'}</td>
                            <td>{doctor.specialty || '-'}</td>
                            <td>
                              {doctor.is_frozen ? (
                                <span className="badge bg-danger">Frozen</span>
                              ) : (
                                <span className="badge bg-success">Active</span>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                {canEdit && (
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleEdit(doctor)}
                                    disabled={processing === doctor.id}
                                  >
                                    <i className="mdi mdi-pencil"></i>
                                  </button>
                                )}
                                {canFreeze && (
                                  <button
                                    className={`btn btn-sm ${doctor.is_frozen ? 'btn-success' : 'btn-warning'}`}
                                    onClick={() => setFreezeConfirm({ id: doctor.id, action: doctor.is_frozen ? 'unfreeze' : 'freeze' })}
                                    disabled={processing === doctor.id}
                                  >
                                    <i className={`mdi mdi-${doctor.is_frozen ? 'lock-open' : 'lock'}`}></i>
                                  </button>
                                )}
                                {canDelete && (
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => setDeleteConfirm(doctor.id)}
                                    disabled={processing === doctor.id}
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <p className="text-muted mb-0">
                          Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, total)} of {total} doctors
                        </p>
                      </div>
                      <nav>
                        <ul className="pagination mb-0">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </button>
                          </li>
                          {(() => {
                            const pages: (number | string)[] = []
                            const showPages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => {
                              return (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 2 && page <= currentPage + 2)
                              )
                            })

                            showPages.forEach((page, index) => {
                              if (index > 0 && page - showPages[index - 1] > 1) {
                                pages.push('ellipsis')
                              }
                              pages.push(page)
                            })

                            return pages.map((item, index) => {
                              if (item === 'ellipsis') {
                                return (
                                  <li key={`ellipsis-${index}`} className="page-item disabled">
                                    <span className="page-link">...</span>
                                  </li>
                                )
                              }
                              const page = item as number
                              return (
                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                  <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(page)}
                                  >
                                    {page}
                                  </button>
                                </li>
                              )
                            })
                          })()}
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <DoctorModal
          doctor={editingDoctor}
          onClose={handleModalClose}
          onSuccess={loadDoctors}
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
                  disabled={processing === deleteConfirm}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this doctor? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={processing === deleteConfirm}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={processing === deleteConfirm}
                >
                  {processing === deleteConfirm ? (
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

      {/* Freeze/Unfreeze Confirmation Modal */}
      {freezeConfirm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {freezeConfirm.action === 'freeze' ? 'Freeze Doctor' : 'Unfreeze Doctor'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setFreezeConfirm(null)}
                  disabled={processing === freezeConfirm.id}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to {freezeConfirm.action} this doctor account?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setFreezeConfirm(null)}
                  disabled={processing === freezeConfirm.id}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${freezeConfirm.action === 'freeze' ? 'btn-warning' : 'btn-success'}`}
                  onClick={() => handleFreezeToggle(freezeConfirm.id, freezeConfirm.action)}
                  disabled={processing === freezeConfirm.id}
                >
                  {processing === freezeConfirm.id ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    freezeConfirm.action === 'freeze' ? 'Freeze' : 'Unfreeze'
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

