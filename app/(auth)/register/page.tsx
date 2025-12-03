'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import { RegisterRequest } from '@/lib/types'

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser, isAuthenticated, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    setValue,
  } = useForm<RegisterRequest>({
    defaultValues: {
      account_type: 'patient',
    },
  })

  const password = watch('password')
  const accountType = watch('account_type')

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading || isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: RegisterRequest) => {
    setLoading(true)
    try {
      await registerUser(data)
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors
        Object.keys(apiErrors).forEach((key) => {
          if (key in data) {
            setError(key as keyof RegisterRequest, {
              message: apiErrors[key][0],
            })
          }
        })
      }
    } finally {
      setLoading(false)
      }
  }

  return (
    <div
      className="account-pages d-flex align-items-center"
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top right, #22c55e 0, #06b6d4 30%, #6366f1 65%, #0f172a 100%)',
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
                    background:
                      'linear-gradient(155deg, rgba(15,23,42,0.95), rgba(56,189,248,0.95))',
                  }}
                >
                  <div>
                    <h3 className="fw-semibold mb-2 text-white">Create your account</h3>
                    <p className="mb-4 text-white" style={{ opacity: 0.9 }}>
                      Join the{' '}
                      <span className="fw-bold">MENTAL HEALTH ASSESSMENT SYSTEM</span> as a doctor
                      or patient and start managing assessments in a few clicks.
                    </p>
                    <ul className="list-unstyled small mb-0">
                      <li className="mb-1">
                        <i className="mdi mdi-check-circle-outline text-success me-1"></i>
                        Secure authentication
                      </li>
                      <li className="mb-1">
                        <i className="mdi mdi-check-circle-outline text-success me-1"></i>
                        Role-based access for doctors & patients
                      </li>
                      <li>
                        <i className="mdi mdi-check-circle-outline text-success me-1"></i>
                        Streamlined mental health workflows
                      </li>
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <p className="mb-1 small text-uppercase" style={{ letterSpacing: '0.08em' }}>
                      Designed for Care
                    </p>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge bg-light text-dark">Doctors</span>
                      <span className="badge bg-light text-dark">Patients</span>
                      <span className="badge bg-light text-dark">Clinics</span>
          </div>
        </div>
                </div>

                {/* Right form panel */}
                <div className="col-md-7">
                  <div className="card-body p-4 p-lg-5">
                    <div className="text-center mb-4">
                      <h5 className="text-primary mb-1">Free Register</h5>
                      <p className="text-muted mb-0">
                        Get your free MENTAL HEALTH ASSESSMENT SYSTEM account now.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                      {/* Account type selector as pill buttons at the top */}
                      <input
                        type="hidden"
                        {...register('account_type', {
                          required: 'Please select an account type',
                          validate: (value) =>
                            value === 'doctor' || value === 'patient' || 'Invalid account type',
                        })}
                      />

                      <div className="mb-4">
                        <label className="form-label d-block">I am a</label>
                        <div className="btn-group w-100" role="group" aria-label="Account type selector">
                          <button
                            type="button"
                            className={`btn btn-outline-primary btn-lg ${
                              accountType === 'patient' ? 'active' : ''
                            }`}
                            onClick={() => setValue('account_type', 'patient', { shouldValidate: true })}
                          >
                            Patient
                          </button>
                          <button
                            type="button"
                            className={`btn btn-outline-primary btn-lg ${
                              accountType === 'doctor' ? 'active' : ''
                            }`}
                            onClick={() => setValue('account_type', 'doctor', { shouldValidate: true })}
                          >
                            Doctor
                          </button>
                        </div>
                        {errors.account_type && (
                          <div className="text-danger mt-2" style={{ fontSize: '0.875rem' }}>
                            {errors.account_type.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label" htmlFor="name">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                          id="name"
                          placeholder="Enter your full name"
                          {...register('name', {
                            required: 'Name is required',
                            minLength: {
                              value: 2,
                              message: 'Name must be at least 2 characters',
                            },
                          })}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name.message}</div>
                        )}
                      </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="email"
                          className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                          id="email"
                          placeholder="you@example.com"
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
                        <label className="form-label" htmlFor="password">
                          Password
                      </label>
                      <input
                          type="password"
                          className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                          id="password"
                          placeholder="Create a strong password"
                          {...register('password', {
                            required: 'Password is required',
                            minLength: {
                              value: 8,
                              message: 'Password must be at least 8 characters',
                            },
                          })}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password.message}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password_confirmation">
                          Confirm Password
                      </label>
                      <input
                        type="password"
                          className={`form-control form-control-lg ${errors.password_confirmation ? 'is-invalid' : ''}`}
                          id="password_confirmation"
                          placeholder="Re-enter your password"
                          {...register('password_confirmation', {
                            required: 'Please confirm your password',
                            validate: (value) => value === password || 'Passwords do not match',
                          })}
                        />
                        {errors.password_confirmation && (
                          <div className="invalid-feedback">
                            {errors.password_confirmation.message}
                          </div>
                        )}
                    </div>

                    <div className="mb-3">
                      <div className="d-grid mt-2">
                        <button
                          className="btn btn-primary btn-lg waves-effect waves-light"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Registering...
                            </>
                          ) : (
                            'Create Account'
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
