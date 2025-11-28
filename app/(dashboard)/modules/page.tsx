'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { modulesApi } from '@/lib/api/modules'
import { Module } from '@/lib/types'
import { useHasPermission } from '@/hooks/useHasPermission'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import Breadcrumb from '@/components/common/Breadcrumb'
import toast from 'react-hot-toast'

export default function ModulesPage() {
  const router = useRouter()
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const isAdmin = useIsAdmin()
  const canView = useHasPermission('view modules') || isAdmin
  const canCreate = useHasPermission('create modules') || isAdmin
  const canEdit = useHasPermission('edit modules') || isAdmin
  const canDelete = useHasPermission('delete modules') || isAdmin

  useEffect(() => {
    if (canView) {
      loadData()
    }
  }, [canView])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await modulesApi.list()
      if (response.success && response.data) {
        // Filter out admin module - admins can do anything, no need to manage it
        setModules(response.data.filter((module) => module?.name && module.name.toLowerCase() !== 'admin'))
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load modules')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      // Find the module to check if it's admin
      const moduleToDelete = modules.find((m) => m.id === id)
      if (moduleToDelete?.name && moduleToDelete.name.toLowerCase() === 'admin') {
        toast.error('Admin module cannot be deleted')
        setDeleteConfirm(null)
        return
      }
      
      setDeleting(true)
      const response = await modulesApi.delete(id)
      if (response.success) {
        toast.success('Module deleted successfully')
        setDeleteConfirm(null)
        loadData()
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete module'
      toast.error(message)
      if (error.response?.status === 422) {
        // Module has assigned permissions
        setDeleteConfirm(null)
      }
    } finally {
      setDeleting(false)
    }
  }

  if (!canView) {
    return (
      <>
        <Breadcrumb pagetitle="Pages" title="Modules" />
        <div className="alert alert-danger" role="alert">
          You don&apos;t have permission to view modules.
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="Pages" title="Modules" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-0">Modules Management</h4>
                  <p className="text-muted mb-0">
                    Create and manage modules. Each module automatically generates 4 CRUD permissions.
                  </p>
                </div>
                {canCreate && (
                  <Link href="/modules/create" className="btn btn-primary">
                    <i className="mdi mdi-plus me-2"></i>Create Module
                  </Link>
                )}
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : modules.length === 0 ? (
                <div className="text-center py-5">
                  <i className="uil-folder-open font-size-48 text-muted"></i>
                  <p className="text-muted mt-3">No modules found</p>
                  {canCreate && (
                    <Link href="/modules/create" className="btn btn-primary mt-2">
                      Create First Module
                    </Link>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-nowrap align-middle mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Label</th>
                        <th>Permissions</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modules.map((module) => (
                        <tr key={module.id}>
                          <td>{module.id}</td>
                          <td>
                            <code className="text-primary">{module.name}</code>
                          </td>
                          <td>{module.label}</td>
                          <td>
                            <span className="badge bg-primary">
                              {module.permissions?.length || 0} permission{module.permissions?.length !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {canEdit && (
                                <Link
                                  href={`/modules/${module.id}/edit`}
                                  className="btn btn-sm btn-primary"
                                >
                                  <i className="mdi mdi-pencil"></i>
                                </Link>
                              )}
                              {canDelete && (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => setDeleteConfirm(module.id)}
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
                  disabled={deleting}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete this module? This action cannot be undone.
                </p>
                <div className="alert alert-warning mb-0">
                  <i className="uil-exclamation-triangle me-2"></i>
                  If this module has permissions assigned to roles, deletion will be prevented.
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleting}
                >
                  {deleting ? (
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

