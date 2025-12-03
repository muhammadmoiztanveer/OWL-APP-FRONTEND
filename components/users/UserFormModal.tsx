'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUser, useUpdateUser } from '@/hooks/users/useUsers'
import { useRoles } from '@/hooks/useRoles'
import { UpdateUserData } from '@/lib/types'
import toast from 'react-hot-toast'

interface UserFormModalProps {
  userId: number
  onClose: () => void
  onSuccess: () => void
}

export default function UserFormModal({ userId, onClose, onSuccess }: UserFormModalProps) {
  const { data: userData, isLoading: loadingUser } = useUser(userId)
  const { data: rolesData } = useRoles()
  const updateMutation = useUpdateUser()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      account_type: undefined,
      roles: [],
    },
  })

  const selectedRoles = watch('roles') || []

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || '',
        email: userData.email || '',
        password: '',
        account_type: (userData.account_type as any) || undefined,
        roles: userData.roles?.map((r) => r.name) || [],
      })
    }
  }, [userData, reset])

  const onSubmit = async (data: UpdateUserData) => {
    try {
      // Remove password if empty
      const submitData = { ...data }
      if (!submitData.password || submitData.password.trim() === '') {
        delete submitData.password
      }

      await updateMutation.mutateAsync({ id: userId, data: submitData })
      onSuccess()
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const isLoading = updateMutation.isPending || loadingUser

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {loadingUser ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name.message}</div>
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
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        {...register('password', {
                          minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                          },
                        })}
                        placeholder="Leave blank to keep current password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`mdi mdi-eye${showPassword ? '-off' : ''}`}></i>
                      </button>
                    </div>
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password.message}</div>
                    )}
                    <small className="form-text text-muted">
                      Leave blank to keep current password
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Account Type</label>
                    <select
                      className={`form-select ${errors.account_type ? 'is-invalid' : ''}`}
                      {...register('account_type')}
                    >
                      <option value="">Select Account Type</option>
                      <option value="admin">Admin</option>
                      <option value="doctor">Doctor</option>
                      <option value="patient">Patient</option>
                      <option value="user">User</option>
                    </select>
                    {errors.account_type && (
                      <div className="invalid-feedback">{errors.account_type.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Roles</label>
                    {rolesData && rolesData.data && rolesData.data.length > 0 ? (
                      <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {rolesData.data
                          .filter((role) => role.name.toLowerCase() !== 'admin')
                          .map((role) => {
                            const isChecked = selectedRoles.includes(role.name)
                            return (
                              <div key={role.id} className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`role-${role.id}`}
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const current = watch('roles') || []
                                    if (e.target.checked) {
                                      setValue('roles', [...current, role.name])
                                    } else {
                                      setValue('roles', current.filter((r: string) => r !== role.name))
                                    }
                                  }}
                                />
                                <label className="form-check-label" htmlFor={`role-${role.id}`}>
                                  {role.name}
                                </label>
                              </div>
                            )
                          })}
                      </div>
                    ) : (
                      <p className="text-muted">No roles available</p>
                    )}
                  </div>
                </>
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
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

