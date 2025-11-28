'use client'

import { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { rolesApi } from '@/lib/api/roles'
import { permissionsApi } from '@/lib/api/permissions'
import { Role, Permission, CreateRoleRequest, UpdateRoleRequest, PermissionGroup } from '@/lib/types'
import { useHasPermission } from '@/hooks/useHasPermission'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import Breadcrumb from '@/components/common/Breadcrumb'
import toast from 'react-hot-toast'

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const isAdmin = useIsAdmin()
  const canView = useHasPermission('view roles') || isAdmin
  const canCreate = useHasPermission('create roles') || isAdmin
  const canEdit = useHasPermission('edit roles') || isAdmin
  const canDelete = useHasPermission('delete roles') || isAdmin

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateRoleRequest>({
    defaultValues: {
      name: '',
      permissions: [],
    },
  })

  const selectedPermissions = watch('permissions') || []

  // Filter permission groups by search term and exclude admin-related permissions
  const filteredPermissionGroups = useMemo(() => {
    if (!permissionGroups || permissionGroups.length === 0) return []
    
    // Filter out admin module and admin-related permissions
    const filteredGroups = permissionGroups
      .filter((group) => group && group.module && typeof group.module === 'string' && group.module.toLowerCase() !== 'admin')
      .map((group) => ({
        ...group,
        permissions: (group.permissions || []).filter(
          (p) => p && p.name && typeof p.name === 'string' && !p.name.toLowerCase().includes('admin') && p.name.toLowerCase() !== 'admin'
        ),
      }))
      .filter((group) => group && group.permissions && group.permissions.length > 0)

    if (!searchTerm) return filteredGroups
    
    return filteredGroups
      .map((group) => ({
        ...group,
        permissions: (group.permissions || []).filter((p) =>
          p && p.name && typeof p.name === 'string' && p.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((group) => group && group.permissions && group.permissions.length > 0)
  }, [permissionGroups, searchTerm])

  const toggleModule = (moduleName: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(moduleName)) {
        newSet.delete(moduleName)
      } else {
        newSet.add(moduleName)
      }
      return newSet
    })
  }

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
        permissionsApi.grouped(),
      ])
      if (rolesRes.success && rolesRes.data) {
        // Filter out admin role - admins can do anything, no need to manage it
        setRoles(rolesRes.data.filter((role) => role?.name && role.name.toLowerCase() !== 'admin'))
      }
      if (permissionsRes.success && permissionsRes.data) {
        setPermissionGroups(permissionsRes.data || [])
        // Auto-expand all modules initially
        setExpandedModules(new Set((permissionsRes.data || []).map((g) => g?.module).filter(Boolean)))
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
    // Prevent editing admin role
    if (role?.name && role.name.toLowerCase() === 'admin') {
      toast.error('Admin role cannot be edited')
      return
    }
    setEditingRole(role)
    setSearchTerm('')
    reset({
      name: role.name,
      permissions: role.permissions?.map((p) => p.id) || [],
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    try {
      // Find the role to check if it's admin
      const roleToDelete = roles.find((r) => r.id === id)
      if (roleToDelete?.name && roleToDelete.name.toLowerCase() === 'admin') {
        toast.error('Admin role cannot be deleted')
        setDeleteConfirm(null)
        return
      }
      
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
    setSearchTerm('')
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
                <div>
                  <h4 className="card-title mb-0">Roles Management</h4>
                  <p className="text-muted mb-0">
                    Create and manage roles. Assign permissions to control access to features.
                  </p>
                </div>
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
          <div className="modal-dialog modal-dialog-centered modal-lg">
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
                    setSearchTerm('')
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
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Search permissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="border rounded p-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      {filteredPermissionGroups.length === 0 ? (
                        <p className="text-muted text-center mb-0">No permissions found</p>
                      ) : (
                        filteredPermissionGroups.map((group) => {
                          if (!group || !group.module || !group.permissions) return null
                          
                          const allSelected = (group.permissions || []).every((p) => p?.id && selectedPermissions.includes(p.id))
                          const isExpanded = expandedModules.has(group.module)
                          
                          return (
                            <div key={group.module} className="mb-3 border-bottom pb-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-link p-0 text-start d-flex align-items-center"
                                  onClick={() => toggleModule(group.module)}
                                  style={{ textDecoration: 'none' }}
                                >
                                  <i className={`uil ${isExpanded ? 'uil-angle-down' : 'uil-angle-right'} me-2`}></i>
                                  <h6 className="text-primary mb-0" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                    {group.label || group.module}
                                  </h6>
                                  <span className="badge bg-primary-subtle text-primary ms-2">
                                    {(group.permissions || []).length}
                                  </span>
                                </button>
                                {isExpanded && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-link p-0"
                                    style={{ fontSize: '0.75rem' }}
                                    onClick={() => {
                                      const current = watch('permissions') || []
                                      const permIds = (group.permissions || []).map((p) => p?.id).filter(Boolean) as number[]
                                      
                                      if (allSelected) {
                                        // Deselect all in this module
                                        setValue(
                                          'permissions',
                                          current.filter((id: number) => !permIds.includes(id))
                                        )
                                      } else {
                                        // Select all in this module
                                        const newPerms = [...current]
                                        permIds.forEach((id) => {
                                          if (!newPerms.includes(id)) {
                                            newPerms.push(id)
                                          }
                                        })
                                        setValue('permissions', newPerms)
                                      }
                                    }}
                                  >
                                    {allSelected ? 'Deselect All' : 'Select All'}
                                  </button>
                                )}
                              </div>
                              {isExpanded && (
                                <div className="ms-4 mt-2">
                                  {(group.permissions || []).map((permission) => {
                                    if (!permission || !permission.id) return null
                                    const isChecked = selectedPermissions.includes(permission.id)
                                    return (
                                      <div key={permission.id} className="form-check mb-2">
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
                                          {permission.name || ''}
                                        </label>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        }).filter(Boolean)
                      )}
                    </div>
                    {selectedPermissions.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted">
                          {selectedPermissions.length} permission{selectedPermissions.length !== 1 ? 's' : ''} selected
                        </small>
                      </div>
                    )}
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

