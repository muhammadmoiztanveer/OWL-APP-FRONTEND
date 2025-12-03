'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { modulesApi } from '@/lib/api/modules'
import { UpdateModuleRequest, Module } from '@/lib/types'
import { useHasPermission } from '@/hooks/useHasPermission'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import Breadcrumb from '@/components/common/Breadcrumb'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function EditModulePage() {
  const router = useRouter()
  const params = useParams()
  const moduleId = parseInt(params.id as string)
  const [loading, setLoading] = useState(false)
  const [module, setModule] = useState<Module | null>(null)
  const [loadingModule, setLoadingModule] = useState(true)
  const canEdit = useHasPermission('edit modules')

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateModuleRequest>({
    defaultValues: {
      name: '',
      label: '',
    },
  })

  const name = watch('name')
  const label = watch('label')

  useEffect(() => {
    if (canEdit && moduleId) {
      loadModule()
    }
  }, [canEdit, moduleId])

  const loadModule = async () => {
    try {
      setLoadingModule(true)
      const response = await modulesApi.get(moduleId)
      if (response.success && response.data) {
        // Prevent editing admin module
        if (response.data?.name && response.data.name.toLowerCase() === 'admin') {
          toast.error('Admin module cannot be edited')
          router.push('/modules')
          return
        }
        setModule(response.data)
        reset({
          name: response.data.name,
          label: response.data.label,
        })
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load module')
      router.push('/modules')
    } finally {
      setLoadingModule(false)
    }
  }

  // Generate permission preview
  const permissionPreview = name
    ? [
        `${name}.view`,
        `${name}.create`,
        `${name}.update`,
        `${name}.delete`,
      ]
    : []

  // Slug validation function
  const validateSlug = (value: string) => {
    if (!value) return 'Name is required'
    if (!/^[a-z0-9-]+$/.test(value)) {
      return 'Name must be lowercase letters, numbers, and hyphens only'
    }
    if (value.startsWith('-') || value.endsWith('-')) {
      return 'Name cannot start or end with a hyphen'
    }
    return true
  }

  const onSubmit = async (data: UpdateModuleRequest) => {
    try {
      setLoading(true)
      const response = await modulesApi.update(moduleId, data)
      if (response.success) {
        toast.success('Module updated successfully')
        router.push('/modules')
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {}).flat()[0] ||
        'Failed to update module'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!canEdit) {
    return (
      <>
        <Breadcrumb pagetitle="Pages" title="Edit Module" />
        <div className="alert alert-danger" role="alert">
          You don&apos;t have permission to edit modules.
        </div>
      </>
    )
  }

  if (loadingModule) {
    return (
      <>
        <Breadcrumb pagetitle="Pages" title="Edit Module" />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    )
  }

  if (!module) {
    return (
      <>
        <Breadcrumb pagetitle="Pages" title="Edit Module" />
        <div className="alert alert-danger" role="alert">
          Module not found.
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="Pages" title="Edit Module" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0">Edit Module</h4>
                <Link href="/modules" className="btn btn-secondary">
                  <i className="mdi mdi-arrow-left me-2"></i>Back to Modules
                </Link>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Module Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="e.g., doctor, patient, appointment"
                        {...register('name', {
                          required: 'Module name is required',
                          validate: validateSlug,
                          onChange: (e) => {
                            // Auto-format to lowercase and replace spaces with hyphens
                            const value = e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, '-')
                              .replace(/[^a-z0-9-]/g, '')
                            e.target.value = value
                          },
                        })}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name.message}</div>
                      )}
                      <small className="form-text text-muted">
                        Use lowercase letters, numbers, and hyphens only. Changing this will update permission names.
                      </small>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Module Label <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.label ? 'is-invalid' : ''}`}
                        placeholder="e.g., Doctor, Patient, Appointment"
                        {...register('label', {
                          required: 'Module label is required',
                          minLength: {
                            value: 2,
                            message: 'Label must be at least 2 characters',
                          },
                        })}
                      />
                      {errors.label && (
                        <div className="invalid-feedback">{errors.label.message}</div>
                      )}
                      <small className="form-text text-muted">
                        Display name for the module.
                      </small>
                    </div>
                  </div>
                </div>

                {/* Permission Preview */}
                {name && (
                  <div className="mb-4">
                    <label className="form-label">Permissions Preview</label>
                    <div className="card bg-light">
                      <div className="card-body">
                        <p className="text-muted mb-2">
                          Current permissions (will be updated if name changes):
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                          {permissionPreview.map((perm, index) => (
                            <span key={index} className="badge bg-primary">
                              {perm}
                            </span>
                          ))}
                        </div>
                        {module.permissions && module.permissions.length > 0 && (
                          <div className="mt-3">
                            <p className="text-muted mb-2">Existing permissions:</p>
                            <div className="d-flex flex-wrap gap-2">
                              {module.permissions.map((perm) => (
                                <span key={perm.id} className="badge bg-success">
                                  {perm.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="mdi mdi-check me-2"></i>Update Module
                      </>
                    )}
                  </button>
                  <Link href="/modules" className="btn btn-secondary">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

