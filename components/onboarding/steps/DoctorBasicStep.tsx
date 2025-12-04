'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { DoctorProfile } from '@/lib/types'

interface DoctorBasicStepProps {
  data: Partial<DoctorProfile>
  onChange: (data: Partial<DoctorProfile>) => void
  onSubmit?: () => void
  errors?: Record<string, string>
}

export default function DoctorBasicStep({
  data,
  onChange,
  onSubmit,
  errors: externalErrors,
}: DoctorBasicStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Partial<DoctorProfile>>({
    defaultValues: data,
  })

  // Update form when data prop changes (for pre-population)
  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data, reset])

  const onFormSubmit = (formData: Partial<DoctorProfile>) => {
    onChange(formData)
    if (onSubmit) {
      onSubmit()
    }
  }

  const handleChange = (field: keyof DoctorProfile, value: any) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="profile-step">
      <h2 className="mb-3">Basic Information</h2>
      <p className="text-muted mb-4">
        Please provide your basic information. All fields marked with <span className="text-danger">*</span> are
        required.
      </p>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">
              First Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.first_name || externalErrors?.first_name ? 'is-invalid' : ''}`}
              {...register('first_name', {
                required: 'First name is required',
                onChange: (e) => handleChange('first_name', e.target.value),
              })}
            />
            {(errors.first_name || externalErrors?.first_name) && (
              <div className="invalid-feedback">{errors.first_name?.message || externalErrors?.first_name}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Last Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.last_name || externalErrors?.last_name ? 'is-invalid' : ''}`}
              {...register('last_name', {
                required: 'Last name is required',
                onChange: (e) => handleChange('last_name', e.target.value),
              })}
            />
            {(errors.last_name || externalErrors?.last_name) && (
              <div className="invalid-feedback">{errors.last_name?.message || externalErrors?.last_name}</div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Email Address <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className={`form-control ${errors.email || externalErrors?.email ? 'is-invalid' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
              onChange: (e) => handleChange('email', e.target.value),
            })}
          />
          {(errors.email || externalErrors?.email) && (
            <div className="invalid-feedback">{errors.email?.message || externalErrors?.email}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className={`form-control ${errors.phone_number || externalErrors?.phone_number ? 'is-invalid' : ''}`}
            {...register('phone_number', {
              pattern: {
                value: /^[\d\s\-\+\(\)]+$/,
                message: 'Invalid phone number format',
              },
              onChange: (e) => handleChange('phone_number', e.target.value || null),
            })}
            placeholder="(555) 123-4567"
          />
          {(errors.phone_number || externalErrors?.phone_number) && (
            <div className="invalid-feedback">{errors.phone_number?.message || externalErrors?.phone_number}</div>
          )}
        </div>
      </form>
    </div>
  )
}
