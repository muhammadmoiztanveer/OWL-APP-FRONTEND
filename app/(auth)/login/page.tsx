'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@themesbrand.com')
  const [password, setPassword] = useState('12345678')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Frontend-only: Just simulate login
    setTimeout(() => {
      setLoading(false)
      // Store in localStorage for frontend-only auth
      if (email && password) {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userEmail', email)
        router.push('/dashboard')
      } else {
        setError('Please enter email and password')
      }
    }, 500)
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
                  <h5 className="text-primary">Welcome Back !</h5>
                  <p className="text-muted">Sign in to continue to Minible.</p>
                </div>
                <div className="p-2 mt-4">
                  <form onSubmit={handleSubmit}>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    <div className="mb-3">
                      <label className="form-label" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        placeholder="Enter Email address"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <div className="float-end">
                        <Link href="/auth/recover-password" className="text-muted">
                          Forgot password?
                        </Link>
                      </div>
                      <label className="form-label" htmlFor="userpassword">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        id="userpassword"
                        placeholder="Enter password"
                        required
                      />
                    </div>

                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="auth-remember-check"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="auth-remember-check"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="mt-3 text-end">
                      <button
                        className="btn btn-primary w-sm waves-effect waves-light"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? 'Logging in...' : 'Log In'}
                      </button>
                    </div>

                    <div className="mt-4 text-center">
                      <div className="signin-other-title">
                        <h5 className="font-size-14 mb-3 title">Sign in with</h5>
                      </div>
                      <ul className="list-inline">
                        <li className="list-inline-item">
                          <a
                            href="#"
                            className="social-list-item bg-primary text-white border-primary"
                          >
                            <i className="mdi mdi-facebook"></i>
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <a
                            href="#"
                            className="social-list-item bg-info text-white border-info"
                          >
                            <i className="mdi mdi-twitter"></i>
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <a
                            href="#"
                            className="social-list-item bg-danger text-white border-danger"
                          >
                            <i className="mdi mdi-google"></i>
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="mb-0">
                        Don&apos;t have an account ?{' '}
                        <Link href="/auth/register" className="fw-medium text-primary">
                          Signup now
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
