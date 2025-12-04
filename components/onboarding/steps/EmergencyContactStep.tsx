'use client'

import { useForm } from 'react-hook-form'
import { PatientProfile } from '@/lib/types'

interface EmergencyContactStepProps {
  data: Partial<PatientProfile>
  onChange: (data: Partial<PatientProfile>) => void
  onSubmit?: () => void
}

export default function EmergencyContactStep({ data, onChange, onSubmit }: EmergencyContactStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<PatientProfile>>({
    defaultValues: data,
  })

  const onFormSubmit = (formData: Partial<PatientProfile>) => {
    onChange(formData)
    if (onSubmit) {
      onSubmit()
    }
  }

  const handleChange = (field: keyof PatientProfile, value: any) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="profile-step">
      <h2 className="mb-3">Emergency Contact</h2>
      <p className="text-muted mb-4">
        Please provide an emergency contact person. This information is optional but recommended.
      </p>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-3">
          <label className="form-label">Emergency Contact Name</label>
          <input
            type="text"
            className="form-control"
            {...register('emergency_contact_name', {
              onChange: (e) => handleChange('emergency_contact_name', e.target.value || null),
            })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Emergency Contact Phone</label>
          <input
            type="tel"
            className={`form-control ${errors.emergency_contact_phone ? 'is-invalid' : ''}`}
            {...register('emergency_contact_phone', {
              pattern: {
                value: /^[\d\s\-\+\(\)]+$/,
                message: 'Invalid phone number format',
              },
              onChange: (e) => handleChange('emergency_contact_phone', e.target.value || null),
            })}
            placeholder="(555) 123-4567"
          />
          {errors.emergency_contact_phone && (
            <div className="invalid-feedback">{errors.emergency_contact_phone.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Relationship</label>
          <input
            type="text"
            className="form-control"
            {...register('emergency_contact_relationship', {
              onChange: (e) => handleChange('emergency_contact_relationship', e.target.value || null),
            })}
            placeholder="e.g., Spouse, Parent, Friend"
          />
        </div>
      </form>
    </div>
  )
}
