'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function MaintenancePage() {
  return (
    <div className="my-5 pt-sm-5">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <div className="home-wrapper">
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

              <div className="row justify-content-center">
                <div className="col-lg-4 col-sm-5">
                  <div className="maintenance-img">
                    <Image
                      src="/assets/images/maintenance.png"
                      alt=""
                      className="img-fluid mx-auto d-block"
                      width={400}
                      height={300}
                    />
                  </div>
                </div>
              </div>
              <h3 className="mt-5">Site is Under Maintenance</h3>
              <p>Please check back in sometime.</p>

              <div className="row">
                <div className="col-md-4">
                  <div className="card mt-4 maintenance-box">
                    <div className="card-body p-4">
                      <div className="avatar-sm mx-auto mb-4">
                        <div className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-20">
                          <i className="uil uil-cloud-wifi"></i>
                        </div>
                      </div>
                      <h5 className="font-size-15 text-uppercase">Why is the Site Down?</h5>
                      <p className="text-muted mb-0">
                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered
                        alteration.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card mt-4 maintenance-box">
                    <div className="card-body p-4">
                      <div className="avatar-sm mx-auto mb-4">
                        <div className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-20">
                          <i className="uil uil-clock"></i>
                        </div>
                      </div>
                      <h5 className="font-size-15 text-uppercase">What is the Downtime?</h5>
                      <p className="text-muted mb-0">
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of
                        classical.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card mt-4 maintenance-box">
                    <div className="card-body p-4">
                      <div className="avatar-sm mx-auto mb-4">
                        <div className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-20">
                          <i className="uil uil-envelope-alt"></i>
                        </div>
                      </div>
                      <h5 className="font-size-15 text-uppercase">Do you need Support?</h5>
                      <p className="text-muted mb-0">
                        If you are going to use a passage of Lorem Ipsum, you need to be sure there isn&apos;t anything
                        embar..{' '}
                        <a href="mailto:no-reply@domain.com" className="text-decoration-underline">
                          no-reply@domain.com
                        </a>
                      </p>
                    </div>
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

