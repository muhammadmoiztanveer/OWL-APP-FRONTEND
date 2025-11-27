'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Frontend-only: Just simulate registration
    setTimeout(() => {
      setLoading(false)
      if (email && username && password && terms) {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userEmail', email)
        router.push('/dashboard')
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
                  alt=""
                  height={22}
                  width={120}
                  className="logo logo-dark"
                />
                <Image
                  src="/assets/images/logo-light.png"
                  alt=""
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
                  <h5 className="text-primary">Register Account</h5>
                  <p className="text-muted">Get your free Minible account now.</p>
                </div>
                <div className="p-2 mt-4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="useremail">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="useremail"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="username">
                        Username
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="userpassword">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="userpassword"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="auth-terms-condition-check"
                        checked={terms}
                        onChange={(e) => setTerms(e.target.checked)}
                        required
                      />
                      <label className="form-check-label" htmlFor="auth-terms-condition-check">
                        I accept{' '}
                        <a href="javascript: void(0);" className="text-dark">
                          Terms and Conditions
                        </a>
                      </label>
                    </div>

                    <div className="mt-3 text-end">
                      <button
                        className="btn btn-primary w-sm waves-effect waves-light"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? 'Registering...' : 'Register'}
                      </button>
                    </div>

                    <div className="mt-4 text-center">
                      <div className="signin-other-title">
                        <h5 className="font-size-14 mb-3 title">Sign up using</h5>
                      </div>

                      <ul className="list-inline">
                        <li className="list-inline-item">
                          <a
                            href="javascript:void()"
                            className="social-list-item bg-primary text-white border-primary"
                          >
                            <i className="mdi mdi-facebook"></i>
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <a
                            href="javascript:void()"
                            className="social-list-item bg-info text-white border-info"
                          >
                            <i className="mdi mdi-twitter"></i>
                          </a>
                        </li>
                        <li className="list-inline-item">
                          <a
                            href="javascript:void()"
                            className="social-list-item bg-danger text-white border-danger"
                          >
                            <i className="mdi mdi-google"></i>
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-muted mb-0">
                        Already have an account ?{' '}
                        <Link href="/auth/login" className="fw-medium text-primary">
                          {' '}
                          Login
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

