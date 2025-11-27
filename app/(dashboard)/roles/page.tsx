'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { rolesApi } from '@/lib/api/roles'
import { permissionsApi } from '@/lib/api/permissions'
import { Role, Permission, CreateRoleRequest, UpdateRoleRequest } from '@/lib/types'
import { useHasPermission } from '@/hooks/useHasPermission'
import Breadcrumb from '@/components/common/Breadcrumb'
import toast from 'react-hot-toast'

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const canView = useHasPermission('view roles')
  const canCreate = useHasPermission('create roles')
  const canEdit = useHasPermission('edit roles')
  const canDelete = useHasPermission('delete roles')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<CreateRoleRequest>({
    defaultValues: {
      name: '',
      permissions: [],
    },
  })

  const selectedPermissions = watch('permissions') || []

  useEffect(() => {
    if (canView) {
      loadData()
    }
  }, [canView])

  const loadData = async () => {
    try {
      setLoading(true)
      const [rolesRes, permissionsRes] = await Promise.all([
        rolesApi.list(),
        permissionsApi.list(),
      ])
      if (rolesRes.success && rolesRes.data) {
        setRoles(rolesRes.data)
      }
      if (permissionsRes.success && permissionsRes.data) {
        setPermissions(permissionsRes.data)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CreateRoleRequest) => {
    try {
      if (editingRole) {
        const response = await rolesApi.update(editingRole.id, data)
        if (response.success) {
          toast.success('Role updated successfully')
          setShowModal(false)
          setEditingRole(null)
          reset()
          loadData()
        }
      } else {
        const response = await rolesApi.create(data)
        if (response.success) {
          toast.success('Role created successfully')
          setShowModal(false)
          reset()
          loadData()
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save role')
    }
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    reset({
      name: role.name,
      permissions: role.permissions?.map((p) => p.id) || [],
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await rolesApi.delete(id)
      if (response.success) {
        toast.success('Role deleted successfully')
        setDeleteConfirm(null)
        loadData()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete role')
    }
  }

  const openCreateModal = () => {
    setEditingRole(null)
    reset({ name: '', permissions: [] })
    setShowModal(true)
  }

  if (!canView) {
    return (
      <>
        <Breadcrumb pagetitle="Pages" title="Roles" />
        <div className="alert alert-danger" role="alert">
          You don&apos;t have permission to view roles.
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="Pages" title="Roles" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0">Roles Management</h4>
                {canCreate && (
                  <button className="btn btn-primary" onClick={openCreateModal}>
                    <i className="mdi mdi-plus me-2"></i>Create Role
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
                        <th>Permissions</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map((role) => (
                        <tr key={role.id}>
                          <td>{role.id}</td>
                          <td>{role.name}</td>
                          <td>
                            {role.permissions && role.permissions.length > 0 ? (
                              <div className="d-flex flex-wrap gap-1">
                                {role.permissions.map((p) => (
                                  <span key={p.id} className="badge bg-success">
                                    {p.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted">No permissions</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {canEdit && (
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleEdit(role)}
                                >
                                  <i className="mdi mdi-pencil"></i>
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => setDeleteConfirm(role.id)}
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
                  {editingRole ? 'Edit Role' : 'Create Role'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false)
                    setEditingRole(null)
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

                  <div className="mb-3">
                    <label className="form-label">Permissions</label>
                    <div className="border rounded p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {permissions.map((permission) => {
                        const isChecked = selectedPermissions.includes(permission.id)
                        return (
                          <div key={permission.id} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`perm-${permission.id}`}
                              checked={isChecked}
                              onChange={(e) => {
                                const current = watch('permissions') || []
                                if (e.target.checked) {
                                  setValue('permissions', [...current, permission.id])
                                } else {
                                  setValue(
                                    'permissions',
                                    current.filter((id: number) => id !== permission.id)
                                  )
                                }
                              }}
                            />
                            <label className="form-check-label" htmlFor={`perm-${permission.id}`}>
                              {permission.name}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false)
                      setEditingRole(null)
                      reset()
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingRole ? 'Update' : 'Create'}
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
                <p>Are you sure you want to delete this role? This action cannot be undone.</p>
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

