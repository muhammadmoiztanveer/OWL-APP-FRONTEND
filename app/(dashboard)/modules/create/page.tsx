'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { modulesApi } from '@/lib/api/modules'
import { CreateModuleRequest } from '@/lib/types'
import { useHasPermission } from '@/hooks/useHasPermission'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import Breadcrumb from '@/components/common/Breadcrumb'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function CreateModulePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isAdmin = useIsAdmin()
  const canCreate = useHasPermission('create modules') || isAdmin

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateModuleRequest>({
    defaultValues: {
      name: '',
      label: '',
    },
  })

  const name = watch('name')
  const label = watch('label')

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

  const onSubmit = async (data: CreateModuleRequest) => {
    try {
      setLoading(true)
      const response = await modulesApi.create(data)
      if (response.success) {
        toast.success('Module created successfully')
        router.push('/modules')
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {}).flat()[0] ||
        'Failed to create module'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!canCreate) {
    return (
      <>
        <Breadcrumb pagetitle="Pages" title="Create Module" />
        <div className="alert alert-danger" role="alert">
          You don&apos;t have permission to create modules.
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb pagetitle="Pages" title="Create Module" />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0">Create New Module</h4>
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
                        Use lowercase letters, numbers, and hyphens only. This will be used as a slug.
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
                        Display name for the module (e.g., &quot;Doctor&quot; instead of &quot;doctor&quot;).
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
                          The following 4 permissions will be automatically created:
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                          {permissionPreview.map((perm, index) => (
                            <span key={index} className="badge bg-primary">
                              {perm}
                            </span>
                          ))}
                        </div>
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
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="mdi mdi-check me-2"></i>Create Module
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

