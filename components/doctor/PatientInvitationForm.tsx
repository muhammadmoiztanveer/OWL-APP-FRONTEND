'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { doctorApi } from '@/lib/api/doctor'
import toast from 'react-hot-toast'

interface InvitationFormData {
  email: string
  expires_in_days: number
}

interface PatientInvitationFormProps {
  onSuccess?: () => void
}

export default function PatientInvitationForm({ onSuccess }: PatientInvitationFormProps) {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvitationFormData>({
    defaultValues: {
      email: '',
      expires_in_days: 7,
    },
  })

  const onSubmit = async (data: InvitationFormData) => {
    setLoading(true)
    try {
      const response = await doctorApi.createPatientInvitation({
        email: data.email,
        expires_in_days: data.expires_in_days,
      })

      if (response.success) {
        toast.success(`Invitation sent to ${data.email}`)
        reset()
        onSuccess?.()
      } else {
        toast.error(response.message || 'Failed to send invitation')
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        'Failed to send invitation'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Invite Patient</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">
              Patient Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="patient@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Invitation Expires In (days)</label>
            <input
              type="number"
              className={`form-control ${errors.expires_in_days ? 'is-invalid' : ''}`}
              min="1"
              max="30"
              {...register('expires_in_days', {
                required: 'Expiration days is required',
                min: { value: 1, message: 'Must be at least 1 day' },
                max: { value: 30, message: 'Cannot exceed 30 days' },
                valueAsNumber: true,
              })}
            />
            {errors.expires_in_days && (
              <div className="invalid-feedback">{errors.expires_in_days.message}</div>
            )}
            <small className="text-muted">Default: 7 days</small>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Sending...
                </>
              ) : (
                'Send Invitation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
