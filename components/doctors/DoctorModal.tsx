'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { doctorsApi } from '@/lib/api/doctors'
import { Doctor, CreateDoctorRequest, UpdateDoctorRequest } from '@/lib/types'
import toast from 'react-hot-toast'

interface DoctorModalProps {
  doctor: Doctor | null
  onClose: () => void
  onSuccess: () => void
}

// Phone number formatter
const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
}

export default function DoctorModal({ doctor, onClose, onSuccess }: DoctorModalProps) {
  const [loading, setLoading] = useState(false)
  const isEditing = !!doctor

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateDoctorRequest>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      practice_name: '',
      specialty: '',
      website: '',
      office_hours: '',
      street_address: '',
      city: '',
      state: '',
      zip_code: '',
    },
  })

  const phoneValue = watch('phone_number')

  useEffect(() => {
    if (doctor) {
      reset({
        first_name: doctor.first_name || '',
        last_name: doctor.last_name || '',
        email: doctor.email || '',
        phone_number: doctor.phone_number || '',
        practice_name: doctor.practice_name || '',
        specialty: doctor.specialty || '',
        website: doctor.website || '',
        office_hours: doctor.office_hours || '',
        street_address: doctor.street_address || '',
        city: doctor.city || '',
        state: doctor.state || '',
        zip_code: doctor.zip_code || '',
      })
    }
  }, [doctor, reset])

  // Format phone number on change
  useEffect(() => {
    if (phoneValue) {
      const formatted = formatPhoneNumber(phoneValue)
      if (formatted !== phoneValue) {
        setValue('phone_number', formatted)
      }
    }
  }, [phoneValue, setValue])

  const onSubmit = async (data: CreateDoctorRequest) => {
    try {
      setLoading(true)
      
      // Clean phone number (remove formatting for API)
      const cleanData = {
        ...data,
        phone_number: data.phone_number?.replace(/\D/g, '') || undefined,
        state: data.state?.toUpperCase().slice(0, 2) || undefined,
      }

      if (isEditing && doctor) {
        const response = await doctorsApi.update(doctor.id, cleanData)
        if (response.success) {
          toast.success('Doctor updated successfully')
          onSuccess()
          onClose()
        }
      } else {
        const response = await doctorsApi.create(cleanData)
        if (response.success) {
          toast.success('Doctor created successfully')
          onSuccess()
          onClose()
        }
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {}).flat()[0] ||
        `Failed to ${isEditing ? 'update' : 'create'} doctor`
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  // URL validation
  const validateUrl = (value: string | undefined) => {
    if (!value) return true
    try {
      new URL(value.startsWith('http') ? value : `https://${value}`)
      return true
    } catch {
      return 'Please enter a valid URL'
    }
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          {/* Dark Gray Header */}
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title mb-0 text-white">
              {isEditing ? 'Edit Doctor' : 'Add New Doctor'}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body p-4">
              {/* Two Column Layout */}
              <div className="row">
                {/* Left Column */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                      {...register('first_name', { required: 'First name is required' })}
                    />
                    {errors.first_name && (
                      <div className="invalid-feedback">{errors.first_name.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                      {...register('last_name', { required: 'Last name is required' })}
                    />
                    {errors.last_name && (
                      <div className="invalid-feedback">{errors.last_name.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                      placeholder="(xxx) xxx-xxxx"
                      maxLength={14}
                      {...register('phone_number', {
                        validate: (value) => {
                          if (!value) return true
                          const numbers = value.replace(/\D/g, '')
                          return numbers.length === 10 || 'Phone number must be 10 digits'
                        },
                      })}
                    />
                    {errors.phone_number && (
                      <div className="invalid-feedback">{errors.phone_number.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Practice Name</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register('practice_name')}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Specialty</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register('specialty')}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-md-6">
                  {/* <div className="mb-3">
                    <label className="form-label">Website</label>
                    <input
                      type="text"
                      className={`form-control ${errors.website ? 'is-invalid' : ''}`}
                      placeholder="https://example.com"
                      {...register('website', {
                        validate: validateUrl,
                      })}
                    />
                    {errors.website && (
                      <div className="invalid-feedback">{errors.website.message}</div>
                    )}
                  </div> */}

                  <div className="mb-3">
                    <label className="form-label">Office Hours</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      {...register('office_hours')}
                    />
                  </div>

                  {/* Address Section */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Address</label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register('street_address')}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register('city')}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                        placeholder="CA"
                        maxLength={2}
                        {...register('state', {
                          validate: (value) => {
                            if (!value) return true
                            return value.length === 2 || 'State must be 2 characters'
                          },
                        })}
                        onChange={(e) => {
                          setValue('state', e.target.value.toUpperCase())
                        }}
                      />
                      {errors.state && (
                        <div className="invalid-feedback">{errors.state.message}</div>
                      )}
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Zip Code</label>
                      <input
                        type="text"
                        className="form-control"
                        maxLength={10}
                        {...register('zip_code')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-check me-2"></i>
                    {isEditing ? 'Update' : 'Submit'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

