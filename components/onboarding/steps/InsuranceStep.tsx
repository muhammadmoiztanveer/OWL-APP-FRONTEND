'use client'

import { useForm } from 'react-hook-form'
import { PatientProfile } from '@/lib/types'

interface InsuranceStepProps {
  data: Partial<PatientProfile>
  onChange: (data: Partial<PatientProfile>) => void
  onSubmit?: () => void
}

export default function InsuranceStep({ data, onChange, onSubmit }: InsuranceStepProps) {
  const {
    register,
    handleSubmit,
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
      <h2 className="mb-3">Insurance Information</h2>
      <p className="text-muted mb-4">This information is optional but helps with billing.</p>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-3">
          <label className="form-label">Insurance Provider</label>
          <input
            type="text"
            className="form-control"
            {...register('insurance_provider', {
              onChange: (e) => handleChange('insurance_provider', e.target.value || null),
            })}
            placeholder="e.g., Blue Cross Blue Shield"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Policy Number</label>
          <input
            type="text"
            className="form-control"
            {...register('insurance_policy_number', {
              onChange: (e) => handleChange('insurance_policy_number', e.target.value || null),
            })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Group Number</label>
          <input
            type="text"
            className="form-control"
            {...register('insurance_group_number', {
              onChange: (e) => handleChange('insurance_group_number', e.target.value || null),
            })}
          />
        </div>
      </form>
    </div>
  )
}
