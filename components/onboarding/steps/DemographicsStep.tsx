'use client'

import { useForm } from 'react-hook-form'
import { PatientProfile } from '@/lib/types'

interface DemographicsStepProps {
  data: Partial<PatientProfile>
  onChange: (data: Partial<PatientProfile>) => void
  onSubmit?: () => void
}

export default function DemographicsStep({ data, onChange, onSubmit }: DemographicsStepProps) {
  const {
    register,
    handleSubmit,
  } = useForm<Partial<PatientProfile>>({
    defaultValues: {
      ...data,
      preferred_language: data.preferred_language || 'en',
    },
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
      <h2 className="mb-3">Demographics</h2>
      <p className="text-muted mb-4">
        This information helps us provide personalized care. All fields are optional.
      </p>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select
            className="form-control"
            {...register('gender', {
              onChange: (e) => handleChange('gender', e.target.value || null),
            })}
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Ethnicity</label>
          <input
            type="text"
            className="form-control"
            {...register('ethnicity', {
              onChange: (e) => handleChange('ethnicity', e.target.value || null),
            })}
            placeholder="e.g., Hispanic, Non-Hispanic"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Race</label>
          <input
            type="text"
            className="form-control"
            {...register('race', {
              onChange: (e) => handleChange('race', e.target.value || null),
            })}
            placeholder="e.g., White, Black, Asian, etc."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Marital Status</label>
          <select
            className="form-control"
            {...register('marital_status', {
              onChange: (e) => handleChange('marital_status', e.target.value || null),
            })}
          >
            <option value="">Select</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
            <option value="separated">Separated</option>
            <option value="domestic_partnership">Domestic Partnership</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Preferred Language</label>
          <select
            className="form-control"
            {...register('preferred_language', {
              onChange: (e) => handleChange('preferred_language', e.target.value),
            })}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
            <option value="other">Other</option>
          </select>
        </div>
      </form>
    </div>
  )
}
