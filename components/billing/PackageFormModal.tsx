'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Package, CreatePackageRequest, UpdatePackageRequest } from '@/lib/types'
import { useCreatePackage, useUpdatePackage, usePackage } from '@/hooks/billing/usePackages'
import { useStripeSettings } from '@/hooks/settings/useStripeSettings'
import toast from 'react-hot-toast'

interface PackageFormModalProps {
  packageId?: number
  onClose: () => void
  onSuccess: () => void
}

export default function PackageFormModal({ packageId, onClose, onSuccess }: PackageFormModalProps) {
  const isEditing = !!packageId
  const { data: packageData, isLoading: loadingPackage } = usePackage(packageId || 0)
  const { data: stripeSettings } = useStripeSettings()
  const createMutation = useCreatePackage()
  const updateMutation = useUpdatePackage()

  const [features, setFeatures] = useState<string[]>([])
  const [featureInput, setFeatureInput] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<CreatePackageRequest>({
    defaultValues: {
      name: '',
      description: '',
      monthly_price: 0,
      yearly_price: undefined,
      features: [],
      max_patients: undefined,
      max_assessments_per_month: undefined,
      is_active: true,
      create_stripe_product: false,
    },
  })

  const createStripeProduct = watch('create_stripe_product')
  const isStripeConfigured =
    stripeSettings?.public_key_configured && stripeSettings?.secret_key_configured

  useEffect(() => {
    if (isEditing && packageData) {
      reset({
        name: packageData.name,
        description: packageData.description || '',
        monthly_price: packageData.monthly_price,
        yearly_price: packageData.yearly_price,
        max_patients: packageData.max_patients,
        max_assessments_per_month: packageData.max_assessments_per_month,
        is_active: packageData.is_active,
        create_stripe_product: false, // Don't create on edit
      })
      setFeatures(packageData.features || [])
    }
  }, [isEditing, packageData, reset])

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()])
      setFeatureInput('')
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: CreatePackageRequest | UpdatePackageRequest) => {
    try {
      const submitData = {
        ...data,
        features: features.length > 0 ? features : undefined,
      }

      if (isEditing && packageId) {
        await updateMutation.mutateAsync({ id: packageId, data: submitData as UpdatePackageRequest })
      } else {
        await createMutation.mutateAsync(submitData as CreatePackageRequest)
      }
      onSuccess()
    } catch (error: any) {
      // Error is handled by the mutation
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending || loadingPackage

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditing ? 'Edit Package' : 'Create New Package'}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">
                  Package Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  {...register('name', { required: 'Package name is required' })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  {...register('description')}
                  placeholder="Describe the package features and benefits..."
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Monthly Price ($) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control ${errors.monthly_price ? 'is-invalid' : ''}`}
                    {...register('monthly_price', {
                      required: 'Monthly price is required',
                      min: { value: 0, message: 'Price must be 0 or greater' },
                      valueAsNumber: true,
                    })}
                  />
                  {errors.monthly_price && (
                    <div className="invalid-feedback">{errors.monthly_price.message}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Yearly Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    {...register('yearly_price', {
                      min: { value: 0, message: 'Price must be 0 or greater' },
                      valueAsNumber: true,
                    })}
                  />
                  <small className="text-muted">Optional - leave empty if not applicable</small>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Max Patients</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    {...register('max_patients', { valueAsNumber: true })}
                    placeholder="Unlimited if empty"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Max Assessments Per Month</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    {...register('max_assessments_per_month', { valueAsNumber: true })}
                    placeholder="Unlimited if empty"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Features</label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addFeature()
                      }
                    }}
                    placeholder="Enter a feature and press Enter"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={addFeature}
                  >
                    Add
                  </button>
                </div>
                {features.length > 0 && (
                  <div className="d-flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <span key={index} className="badge bg-primary-subtle text-primary">
                        {feature}
                        <button
                          type="button"
                          className="ms-2 btn-close btn-close-sm"
                          onClick={() => removeFeature(index)}
                          aria-label="Remove"
                        ></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    {...register('is_active')}
                    id="is_active"
                  />
                  <label className="form-check-label" htmlFor="is_active">
                    Active (package is available for subscription)
                  </label>
                </div>
              </div>

              {!isEditing && isStripeConfigured && (
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      {...register('create_stripe_product')}
                      id="create_stripe_product"
                    />
                    <label className="form-check-label" htmlFor="create_stripe_product">
                      Create Stripe Product and Prices (requires Stripe configuration)
                    </label>
                  </div>
                  <small className="text-muted">
                    This will automatically create a product and prices in your Stripe account
                  </small>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Package' : 'Create Package'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


