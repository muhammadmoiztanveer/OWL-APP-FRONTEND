'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import { LoginRequest } from '@/lib/types'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginRequest>()

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

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true)
    try {
      await login(data)
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        if (errors.email) setError('email', { message: errors.email[0] })
        if (errors.password) setError('password', { message: errors.password[0] })
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
          'radial-gradient(circle at top left, #6366f1 0, #22d3ee 35%, #f97316 70%, #0f172a 100%)',
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
                <div className="col-md-5 d-none d-md-flex flex-column justify-content-between text-white p-4"
                  style={{
                    background:
                      'linear-gradient(160deg, rgba(15,23,42,0.95), rgba(79,70,229,0.95))',
                  }}
                >
                  <div>
                    <h3 className="fw-semibold mb-2 text-white">Welcome Back</h3>
                    <p className="mb-4 text-white" style={{ opacity: 0.9 }}>
                      Sign in to access the{' '}
                      <span className="fw-bold">MENTAL HEALTH ASSESSMENT SYSTEM</span> dashboard,
                      manage assessments, and view insights.
                    </p>
                  </div>
                  <div className="mt-auto">
                    <p className="mb-1 small text-uppercase" style={{ letterSpacing: '0.08em' }}>
                      Secure & Confidential
                    </p>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge bg-success-subtle text-success">HIPAA-friendly</span>
                      <span className="badge bg-info-subtle text-info">Role-based Access</span>
                      <span className="badge bg-warning-subtle text-warning">Real-time Status</span>
                    </div>
                  </div>
                </div>

                {/* Right form panel */}
                <div className="col-md-7">
                  <div className="card-body p-4 p-lg-5">
                    <div className="text-center mb-4">
                      <h5 className="text-primary mb-1">Login to your account</h5>
                      <p className="text-muted mb-0">
                        Use your email and password to continue.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
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
                        <div className="d-flex justify-content-between align-items-center">
                          <label className="form-label mb-0" htmlFor="password">
                            Password
                          </label>
                          <Link href="/auth/recover-password" className="text-muted small">
                            Forgot password?
                          </Link>
                        </div>
                        <input
                          type="password"
                          className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                          id="password"
                          placeholder="Enter your password"
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

                      <div className="d-grid mt-4">
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
                              Logging in...
                            </>
                          ) : (
                            'Log In'
                          )}
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="mb-0 text-muted">
                          Don&apos;t have an account?{' '}
                          <Link href="/register" className="fw-semibold text-primary">
                            Create one
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
