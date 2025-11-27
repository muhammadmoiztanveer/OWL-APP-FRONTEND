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
  } = useForm<RegisterRequest>()

  const password = watch('password')

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
    <div className="account-pages my-5 pt-sm-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <Link href="/dashboard" className="mb-5 d-block auth-logo">
                <Image
                  src="/assets/images/logo-dark.png"
                  alt="Logo"
                  height={22}
                  width={120}
                  className="logo logo-dark"
                />
                <Image
                  src="/assets/images/logo-light.png"
                  alt="Logo"
                  height={22}
                  width={120}
                  className="logo logo-light"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="row align-items-center justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card">
              <div className="card-body p-4">
                <div className="text-center mt-2">
                  <h5 className="text-primary">Free Register</h5>
                  <p className="text-muted">Get your free Minible account now.</p>
                </div>
                <div className="p-2 mt-4">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="name">
                        Name
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        placeholder="Enter your name"
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
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        placeholder="Enter Email address"
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
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        placeholder="Enter password"
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
                        className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                        id="password_confirmation"
                        placeholder="Confirm password"
                        {...register('password_confirmation', {
                          required: 'Please confirm your password',
                          validate: (value) =>
                            value === password || 'Passwords do not match',
                        })}
                      />
                      {errors.password_confirmation && (
                        <div className="invalid-feedback">
                          {errors.password_confirmation.message}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-end">
                      <button
                        className="btn btn-primary w-sm waves-effect waves-light"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Registering...
                          </>
                        ) : (
                          'Register'
                        )}
                      </button>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="mb-0">
                        Already have an account ?{' '}
                        <Link href="/login" className="fw-medium text-primary">
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="mt-5 text-center">
              <p>
                © {new Date().getFullYear()} Minible. Crafted with{' '}
                <i className="mdi mdi-heart text-danger"></i> by Themesbrand
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
