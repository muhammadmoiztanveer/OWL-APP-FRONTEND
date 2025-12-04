'use client'

import { useForm } from 'react-hook-form'
import { DoctorProfile } from '@/lib/types'

interface DoctorPracticeStepProps {
  data: Partial<DoctorProfile>
  onChange: (data: Partial<DoctorProfile>) => void
  onSubmit?: () => void
}

export default function DoctorPracticeStep({ data, onChange, onSubmit }: DoctorPracticeStepProps) {
  const {
    register,
    handleSubmit,
  } = useForm<Partial<DoctorProfile>>({
    defaultValues: data,
  })

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
      <h2 className="mb-3">Practice Information</h2>
      <p className="text-muted mb-4">This information is optional but helps patients find you.</p>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-3">
          <label className="form-label">Practice Name</label>
          <input
            type="text"
            className="form-control"
            {...register('practice_name', {
              onChange: (e) => handleChange('practice_name', e.target.value || null),
            })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Specialty</label>
          <input
            type="text"
            className="form-control"
            {...register('specialty', {
              onChange: (e) => handleChange('specialty', e.target.value || null),
            })}
            placeholder="e.g., Cardiology, Pediatrics, etc."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Website</label>
          <input
            type="url"
            className="form-control"
            {...register('website', {
              onChange: (e) => handleChange('website', e.target.value || null),
            })}
            placeholder="https://example.com"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Office Hours</label>
          <textarea
            rows={4}
            className="form-control"
            {...register('office_hours', {
              onChange: (e) => handleChange('office_hours', e.target.value || null),
            })}
            placeholder="e.g., Monday-Friday: 9:00 AM - 5:00 PM"
          />
        </div>
      </form>
    </div>
  )
}
