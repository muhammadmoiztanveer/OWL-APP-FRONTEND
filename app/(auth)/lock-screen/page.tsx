'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LockScreenPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Frontend-only: Simulate unlock
    setTimeout(() => {
      setLoading(false)
      if (password) {
        localStorage.setItem('isLoggedIn', 'true')
        router.push('/dashboard')
      }
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
                    <h5 className="text-primary">Lock screen</h5>
                    <p className="text-muted">Enter your password to unlock the screen!</p>
                  </div>
                  <div className="p-2 mt-4">
                    <div className="user-thumb text-center mb-4">
                      <Image
                        src="/assets/images/users/avatar-4.jpg"
                        className="rounded-circle img-thumbnail avatar-lg"
                        alt="thumbnail"
                        width={80}
                        height={80}
                      />
                      <h5 className="font-size-15 mt-3">Marcus</h5>
                    </div>
                    <form onSubmit={handleSubmit}>
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

                      <div className="mt-3 text-end">
                        <button
                          className="btn btn-primary w-sm waves-effect waves-light"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Unlocking...' : 'Unlock'}
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="mb-0">
                          Not you ? return{' '}
                          <Link href="/auth/login" className="fw-medium text-primary">
                            {' '}
                            Sign In{' '}
                          </Link>
                        </p>
                      </div>
                    </form>
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

