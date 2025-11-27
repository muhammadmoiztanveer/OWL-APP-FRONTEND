'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function NotFoundPage() {
  return (
    <div className="account-pages my-5 pt-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center mb-5">
              <h1 className="display-1 fw-bold">4<span className="text-primary">0</span>4</h1>
              <h4 className="text-uppercase">Sorry, page not found</h4>
              <div className="mt-5 text-center">
                <Image
                  className="img-fluid"
                  src="/assets/images/404-error.png"
                  alt="Error 404"
                  width={500}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8 col-xl-6">
            <div className="text-center">
              <h3 className="mb-4">We couldn&apos;t find this page</h3>
              <p className="text-muted mb-4">
                It will be as simple as Occidental in fact, it will be Occidental to an English
                person
              </p>
              <Link href="/dashboard" className="btn btn-primary waves-effect waves-light">
                <i className="mdi mdi-home me-1"></i> Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

