'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import api from '@/lib/api/client'
import { apiClient } from '@/lib/api/client'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

interface LoginLinkData {
  email: string
  patient_name: string
  doctor: {
    name: string
    practice_name: string
  }
  expires_at: string
}

function PatientPasswordSetupContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const { refreshProfile } = useAuth()

  const [loginLinkData, setLoginLinkData] = useState<LoginLinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      token: token || '',
      password: '',
      password_confirmation: '',
    },
  })

  const password = watch('password')

  useEffect(() => {
    if (!token) {
      setError('Invalid login link. Please contact your doctor office.')
      setLoading(false)
      return
    }

    validateLoginLink(token)
  }, [token])

  const validateLoginLink = async (linkToken: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<{ success: boolean; data?: LoginLinkData; message?: string }>(
        `/patient/setup-password/validate?token=${linkToken}`
      )

      if (response.data.success && response.data.data) {
        setLoginLinkData(response.data.data)
        setValue('token', linkToken)
      } else {
        setError(response.data.message || 'Invalid or expired login link')
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to validate login link. Please contact your doctor office.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: { token: string; password: string; password_confirmation: string }) => {
    setError(null)
    setSubmitting(true)

    try {
      const response = await api.post<{
        success: boolean
        data?: {
          user: any
          token: string
          patient?: any
        }
        message?: string
      }>('/patient/setup-password', {
        token: data.token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      })

      if (response.data.success && response.data.data) {
        const { user: registeredUser, token: authToken } = response.data.data

        // ✅ CRITICAL: Verify account_type is 'patient'
        if (registeredUser.account_type !== 'patient') {
          console.error('CRITICAL: User account_type is not patient!', registeredUser)
          setError('Password setup failed: Invalid account type. Please contact support.')
          setSubmitting(false)
          return
        }

        // Update AuthContext state
        apiClient.setToken(authToken)
        localStorage.setItem('auth_token', authToken)
        localStorage.setItem('user', JSON.stringify(registeredUser))

        // Refresh profile to update AuthContext
        await refreshProfile()

        toast.success('Password set successfully!')

        // Redirect to patient dashboard
        window.location.href = '/patient/dashboard'
      } else {
        setError(response.data.message || 'Password setup failed')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : 'Password setup failed. Please try again.'
      setError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div
        className="account-pages d-flex align-items-center"
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(circle at top right, #22c55e 0, #06b6d4 30%, #6366f1 65%, #0f172a 100%)',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-9">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Validating login link...</span>
                </div>
                <p className="mt-3 text-white">Validating login link...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !loginLinkData) {
    return (
      <div
        className="account-pages d-flex align-items-center"
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(circle at top right, #22c55e 0, #06b6d4 30%, #6366f1 65%, #0f172a 100%)',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-9">
              <div className="card overflow-hidden border-0 shadow-lg">
                <div className="card-body p-4 p-lg-5">
                  <div className="text-center">
                    <div className="mb-4">
                      <i className="mdi mdi-alert-circle-outline text-danger" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h3 className="text-danger mb-3">Invalid Login Link</h3>
                    <p className="text-muted mb-4">{error}</p>
                    <p className="text-muted">
                      Please contact your doctor office for a new login link or check if the link has expired.
                    </p>
                    <Link href="/login" className="btn btn-primary">
                      Go to Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="account-pages d-flex align-items-center"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top right, #22c55e 0, #06b6d4 30%, #6366f1 65%, #0f172a 100%)',
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <div className="text-center mb-4">
              <Link href="/dashboard" className="d-inline-flex align-items-center gap-2 auth-logo">
                <Image
                  src="/assets/images/logo-dark.png"
                  alt="Logo"
                  height={28}
                  width={140}
                  className="logo logo-dark"
                />
              </Link>
            </div>

            <div className="card overflow-hidden border-0 shadow-lg">
              <div className="row g-0">
                {/* Left colorful panel */}
                <div
                  className="col-md-5 d-none d-md-flex flex-column justify-content-between text-white p-4"
                  style={{
                    background: 'linear-gradient(155deg, rgba(15,23,42,0.95), rgba(56,189,248,0.95))',
                  }}
                >
                  <div>
                    <h3 className="fw-semibold mb-2 text-white">Set Up Your Password</h3>
                    {loginLinkData && (
                      <div className="mb-4">
                        <p className="mb-2 text-white" style={{ opacity: 0.9 }}>
                          Hello <strong>{loginLinkData.patient_name}</strong>,
                        </p>
                        <p className="mb-2 text-white" style={{ opacity: 0.9 }}>
                          Your account has been created by{' '}
                          <span className="fw-bold">{loginLinkData.doctor.practice_name}</span>
                        </p>
                        <p className="mb-0 text-white small" style={{ opacity: 0.8 }}>
                          Email: {loginLinkData.email}
                        </p>
                      </div>
                    )}
                    <ul className="list-unstyled small mb-0">
                      <li className="mb-1">
                        <i className="mdi mdi-check-circle-outline text-success me-1"></i>
                        Secure patient portal access
                      </li>
                      <li className="mb-1">
                        <i className="mdi mdi-check-circle-outline text-success me-1"></i>
                        View your health records
                      </li>
                      <li>
                        <i className="mdi mdi-check-circle-outline text-success me-1"></i>
                        Complete assessments online
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right form panel */}
                <div className="col-md-7">
                  <div className="card-body p-4 p-lg-5">
                    <div className="text-center mb-4">
                      <h5 className="text-primary mb-1">Password Setup</h5>
                      <p className="text-muted mb-0">Create a password to access your patient portal</p>
                    </div>

                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                      <input type="hidden" {...register('token', { required: true })} />
{/* comment it down to avoid password validation */}
                      

                      <div className="mb-3">
                        <label className="form-label" htmlFor="password_confirmation">
                          Confirm Password <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className={`form-control form-control-lg ${
                            errors.password_confirmation ? 'is-invalid' : ''
                          }`}
                          id="password_confirmation"
                          placeholder="Re-enter your password"
                          {...register('password_confirmation', {
                            required: 'Please confirm your password',
                            validate: (value) => value === password || 'Passwords do not match',
                          })}
                        />
                        {errors.password_confirmation && (
                          <div className="invalid-feedback">{errors.password_confirmation.message}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <div className="d-grid mt-2">
                          <button
                            className="btn btn-primary btn-lg waves-effect waves-light"
                            type="submit"
                            disabled={submitting}
                          >
                            {submitting ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Setting Password...
                              </>
                            ) : (
                              'Set Password & Login'
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="mb-0 text-muted">
                          Already have an account?{' '}
                          <Link href="/login" className="fw-semibold text-primary">
                            Sign in
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-white-50">
              <p className="mb-0">
                © {new Date().getFullYear()} MENTAL HEALTH ASSESSMENT SYSTEM. Crafted with{' '}
                <i className="mdi mdi-heart text-danger"></i> by Themesbrand
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PatientPasswordSetupPage() {
  return (
    <Suspense fallback={
      <div
        className="account-pages d-flex align-items-center"
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(circle at top right, #22c55e 0, #06b6d4 30%, #6366f1 65%, #0f172a 100%)',
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-9">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-white">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <PatientPasswordSetupContent />
    </Suspense>
  )
}
