'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { PatientProfile } from '@/lib/types'

interface BasicInformationStepProps {
  data: Partial<PatientProfile>
  onChange: (data: Partial<PatientProfile>) => void
  onSubmit?: () => void
  errors?: Record<string, string>
}

export default function BasicInformationStep({
  data,
  onChange,
  onSubmit,
  errors: externalErrors,
}: BasicInformationStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<Partial<PatientProfile>>({
    defaultValues: data,
  })

  // Update form when data prop changes (for pre-population)
  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data, reset])

  const formData = watch()

  // Update parent on change
  const handleChange = (field: keyof PatientProfile, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const onFormSubmit = (formData: Partial<PatientProfile>) => {
    onChange(formData)
    if (onSubmit) {
      onSubmit()
    }
  }

  return (
    <div className="profile-step">
      <h2 className="mb-3">Basic Information</h2>
      <p className="text-muted mb-4">
        Please provide your basic information. All fields marked with <span className="text-danger">*</span> are
        required.
      </p>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-3">
          <label className="form-label">
            Full Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.name || externalErrors?.name ? 'is-invalid' : ''}`}
            {...register('name', {
              required: 'Name is required',
              onChange: (e) => handleChange('name', e.target.value),
            })}
          />
          {(errors.name || externalErrors?.name) && (
            <div className="invalid-feedback">{errors.name?.message || externalErrors?.name}</div>
          )}
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
          <label className="form-label">
            Date of Birth <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className={`form-control ${errors.date_of_birth || externalErrors?.date_of_birth ? 'is-invalid' : ''}`}
            {...register('date_of_birth', {
              required: 'Date of birth is required',
              validate: (value) => {
                if (!value) return true
                const date = new Date(value)
                const today = new Date()
                if (date >= today) {
                  return 'Date of birth must be in the past'
                }
                return true
              },
              onChange: (e) => handleChange('date_of_birth', e.target.value),
            })}
            max={new Date().toISOString().split('T')[0]}
          />
          {(errors.date_of_birth || externalErrors?.date_of_birth) && (
            <div className="invalid-feedback">
              {errors.date_of_birth?.message || externalErrors?.date_of_birth}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">
            Phone Number <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            className={`form-control ${errors.phone || externalErrors?.phone ? 'is-invalid' : ''}`}
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[\d\s\-\+\(\)]+$/,
                message: 'Invalid phone number format',
              },
              onChange: (e) => handleChange('phone', e.target.value),
            })}
            placeholder="(555) 123-4567"
          />
          {(errors.phone || externalErrors?.phone) && (
            <div className="invalid-feedback">{errors.phone?.message || externalErrors?.phone}</div>
          )}
        </div>
      </form>
    </div>
  )
}
