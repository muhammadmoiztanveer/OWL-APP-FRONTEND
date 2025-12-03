'use client'

import { useState, useEffect } from 'react'
import { usePatients, useDeletePatient } from '@/hooks/doctor/usePatients'
import Breadcrumb from '@/components/common/Breadcrumb'
import PermissionGate from '@/components/common/PermissionGate'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import SearchInput from '@/components/common/SearchInput'
import Pagination from '@/components/common/Pagination'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/contexts/AuthContext'
import PatientFormModal from '@/components/doctor/PatientFormModal'
import PatientDetailsModal from '@/components/doctor/PatientDetailsModal'
import toast from 'react-hot-toast'

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateString
  }
}

export default function PatientsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPatient, setEditingPatient] = useState<number | null>(null)
  const [viewingPatient, setViewingPatient] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const { hasPermission } = usePermissions()
  const { refreshProfile } = useAuth()

  // Refresh permissions when page loads to ensure latest permissions are fetched (only once on mount)
  useEffect(() => {
    refreshProfile().catch(() => {
      // Silently fail - permissions will be checked by PermissionGate
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty array - only run once on mount

  const { data, isLoading, error } = usePatients({
    page: currentPage,
    per_page: 15,
    search: searchTerm || undefined,
  })
  const deleteMutation = useDeletePatient()

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page on new search
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      setDeleteConfirm(null)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  if (error && (error as any).response?.status === 403) {
    return (
      <>
        <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Patients" />
        <UnauthorizedMessage message="You do not have permission to view patients." />
      </>
    )
  }

  return (
    <PermissionGate permission="patient.view" fallback={<UnauthorizedMessage />}>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Patients" />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">Patients Management</h4>
                  <p className="text-muted mb-0">Manage your patients and their information.</p>
                </div>
                <PermissionGate permission="patient.create">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <i className="mdi mdi-plus me-2"></i>Add Patient
                  </button>
                </PermissionGate>
              </div>

              {/* Search */}
              <div className="mb-3">
                <SearchInput
                  placeholder="Search by name or email..."
                  onSearch={handleSearch}
                  className="w-100"
                />
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : data && data.data.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Date of Birth</th>
                          <th>Phone</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.data.map((patient) => (
                          <tr key={patient.id}>
                            <td>{patient.name}</td>
                            <td>{patient.email}</td>
                            <td>{formatDate(patient.date_of_birth)}</td>
                            <td>{patient.phone || '-'}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-info"
                                  onClick={() => setViewingPatient(patient.id)}
                                  title="View Details"
                                >
                                  <i className="mdi mdi-eye"></i>
                                </button>
                                <PermissionGate permission="patient.update">
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => setEditingPatient(patient.id)}
                                    title="Edit"
                                  >
                                    <i className="mdi mdi-pencil"></i>
                                  </button>
                                </PermissionGate>
                                <PermissionGate permission="patient.delete">
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => setDeleteConfirm(patient.id)}
                                    title="Delete"
                                  >
                                    <i className="mdi mdi-delete"></i>
                                  </button>
                                </PermissionGate>
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
                  <i className="uil-user font-size-48 text-muted"></i>
                  <p className="text-muted mt-3">No patients found</p>
                  {hasPermission('patient.create') && (
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => setShowCreateModal(true)}
                    >
                      Add First Patient
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <PatientFormModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            // Data will be refetched automatically by React Query
          }}
        />
      )}

      {editingPatient && (
        <PatientFormModal
          patientId={editingPatient}
          onClose={() => setEditingPatient(null)}
          onSuccess={() => {
            setEditingPatient(null)
          }}
        />
      )}

      {/* View Details Modal */}
      {viewingPatient && (
        <PatientDetailsModal
          patientId={viewingPatient}
          onClose={() => setViewingPatient(null)}
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
                  disabled={deleteMutation.isPending}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this patient? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleteMutation.isPending}
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
    </PermissionGate>
  )
}

