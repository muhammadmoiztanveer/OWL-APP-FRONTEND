'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Set target date (end of 2024)
    const targetDate = new Date('2024-12-31').getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Frontend-only: Just show alert
    alert('Thank you for subscribing!')
    setEmail('')
  }

  return (
    <div className="my-5 pt-sm-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <Link href="/dashboard" className="d-block auth-logo">
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

              <div className="row justify-content-center mt-5">
                <div className="col-lg-4 col-sm-5">
                  <div className="maintenance-img">
                    <Image
                      src="/assets/images/coming-soon-img.png"
                      alt=""
                      className="img-fluid mx-auto d-block"
                      width={400}
                      height={300}
                    />
                  </div>
                </div>
              </div>

              <h4 className="mt-5">Let&apos;s get started with Minible</h4>
              <p className="text-muted">It will be as simple as Occidental in fact it will be Occidental.</p>

              <div className="row justify-content-center mt-5">
                <div className="col-lg-10">
                  <div className="counter-number d-flex justify-content-center gap-3">
                    <div className="text-center">
                      <div className="h2 mb-0">{timeLeft.days}</div>
                      <div className="text-muted">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="h2 mb-0">{timeLeft.hours}</div>
                      <div className="text-muted">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="h2 mb-0">{timeLeft.minutes}</div>
                      <div className="text-muted">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="h2 mb-0">{timeLeft.seconds}</div>
                      <div className="text-muted">Seconds</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center mt-5">
                <div className="col-lg-6">
                  <div className="input-section pt-4">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col">
                          <div className="position-relative">
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter email address..."
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-auto">
                          <button type="submit" className="btn btn-primary w-md waves-effect waves-light">
                            Subscribe
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

