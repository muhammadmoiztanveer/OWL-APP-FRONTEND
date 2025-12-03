'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Frontend-only: Simulate password reset
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 500)
  }

  return (
    <div className="account-pages my-5 pt-sm-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div>
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
              <div className="card">
                <div className="card-body p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Reset Password</h5>
                    <p className="text-muted">Reset Password with MENTAL HEALTH ASSESSMENT SYSTEM.</p>
                  </div>
                  <div className="p-2 mt-4">
                    {submitted ? (
                      <div className="alert alert-success text-center mb-4" role="alert">
                        Password reset instructions have been sent to your email!
                      </div>
                    ) : (
                      <>
                        <div className="alert alert-success text-center mb-4" role="alert">
                          Enter your Email and instructions will be sent to you!
                        </div>
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

                          <div className="mt-3 text-end">
                            <button
                              className="btn btn-primary w-sm waves-effect waves-light"
                              type="submit"
                              disabled={loading}
                            >
                              {loading ? 'Sending...' : 'Reset'}
                            </button>
                          </div>
                        </form>
                      </>
                    )}

                    <div className="mt-4 text-center">
                      <p className="mb-0">
                        Remember It ?{' '}
                        <Link href="/auth/login" className="fw-medium text-primary">
                          {' '}
                          Signin{' '}
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 text-center">
                <p>
                  © {new Date().getFullYear()} MENTAL HEALTH ASSESSMENT SYSTEM. Crafted with{' '}
                  <i className="mdi mdi-heart text-danger"></i> by Themesbrand
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

