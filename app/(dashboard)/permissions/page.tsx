'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { permissionsApi } from '@/lib/api/permissions'
import { Permission, CreatePermissionRequest, UpdatePermissionRequest } from '@/lib/types'
import { useHasPermission } from '@/hooks/useHasPermission'
import Breadcrumb from '@/components/common/Breadcrumb'
import toast from 'react-hot-toast'

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const canView = useHasPermission('view permissions')
  const canCreate = useHasPermission('create permissions')
  const canEdit = useHasPermission('edit permissions')
  const canDelete = useHasPermission('delete permissions')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePermissionRequest>({
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    if (canView) {
      loadData()
    }
  }, [canView])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await permissionsApi.list()
      if (response.success && response.data) {
        setPermissions(response.data)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load permissions')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CreatePermissionRequest) => {
    try {
      if (editingPermission) {
        const response = await permissionsApi.update(editingPermission.id, data)
        if (response.success) {
          toast.success('Permission updated successfully')
          setShowModal(false)
          setEditingPermission(null)
          reset()
          loadData()
        }
      } else {
        const response = await permissionsApi.create(data)
        if (response.success) {
          toast.success('Permission created successfully')
          setShowModal(false)
          reset()
          loadData()
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save permission')
    }
  }

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission)
    reset({ name: permission.name })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await permissionsApi.delete(id)
      if (response.success) {
        toast.success('Permission deleted successfully')
        setDeleteConfirm(null)
        loadData()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete permission')
    }
  }

  const openCreateModal = () => {
    setEditingPermission(null)
    reset({ name: '' })
    setShowModal(true)
  }

  if (!canView) {
    return (
      <>
        <Breadcrumb pagetitle="Pages" title="Permissions" />
        <div className="alert alert-danger" role="alert">
          You don&apos;t have permission to view permissions.
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="Pages" title="Permissions" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0">Permissions Management</h4>
                {canCreate && (
                  <button className="btn btn-primary" onClick={openCreateModal}>
                    <i className="mdi mdi-plus me-2"></i>Create Permission
                  </button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-nowrap align-middle mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissions.map((permission) => (
                        <tr key={permission.id}>
                          <td>{permission.id}</td>
                          <td>
                            <span className="badge bg-success">{permission.name}</span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {canEdit && (
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleEdit(permission)}
                                >
                                  <i className="mdi mdi-pencil"></i>
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => setDeleteConfirm(permission.id)}
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingPermission ? 'Edit Permission' : 'Create Permission'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false)
                    setEditingPermission(null)
                    reset()
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name.message}</div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false)
                      setEditingPermission(null)
                      reset()
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingPermission ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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
                <p>Are you sure you want to delete this permission? This action cannot be undone.</p>
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
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

