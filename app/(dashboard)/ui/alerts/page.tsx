'use client'

import Breadcrumb from '@/components/common/Breadcrumb'

export default function AlertsPage() {
  return (
    <>
      <Breadcrumb pagetitle="MENTAL HEALTH ASSESSMENT SYSTEM" title="Alerts" />

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Default Alert</h4>
              <p className="card-title-desc">
                Alerts are available for any length of text, as well as an optional dismiss button.
              </p>

              <div className="alert alert-primary" role="alert">
                A simple primary alert—check it out!
              </div>
              <div className="alert alert-secondary" role="alert">
                A simple secondary alert—check it out!
              </div>
              <div className="alert alert-success" role="alert">
                A simple success alert—check it out!
              </div>
              <div className="alert alert-danger" role="alert">
                A simple danger alert—check it out!
              </div>
              <div className="alert alert-warning" role="alert">
                A simple warning alert—check it out!
              </div>
              <div className="alert alert-info" role="alert">
                A simple info alert—check it out!
              </div>
              <div className="alert alert-light" role="alert">
                A simple light alert—check it out!
              </div>
              <div className="alert alert-dark mb-0" role="alert">
                A simple dark alert—check it out!
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Dismissing Alerts</h4>
              <p className="card-title-desc">
                Add a dismiss button and the <code>.alert-dismissible</code> class.
              </p>

              <div className="alert alert-primary alert-dismissible fade show" role="alert">
                A simple primary alert—check it out!
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
              <div className="alert alert-secondary alert-dismissible fade show" role="alert">
                A simple secondary alert—check it out!
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                A simple success alert—check it out!
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                A simple danger alert—check it out!
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
              <div className="alert alert-warning alert-dismissible fade show" role="alert">
                A simple warning alert—check it out!
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
              <div className="alert alert-info alert-dismissible fade show mb-0" role="alert">
                A simple info alert—check it out!
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Link Color</h4>
              <p className="card-title-desc">
                Use the <code>.alert-link</code> utility class to quickly provide matching colored
                links within any alert.
              </p>

              <div className="alert alert-primary" role="alert">
                A simple primary alert with{' '}
                <a href="#" className="alert-link">
                  an example link
                </a>
                . Give it a click if you like.
              </div>
              <div className="alert alert-secondary" role="alert">
                A simple secondary alert with{' '}
                <a href="#" className="alert-link">
                  an example link
                </a>
                . Give it a click if you like.
              </div>
              <div className="alert alert-success" role="alert">
                A simple success alert with{' '}
                <a href="#" className="alert-link">
                  an example link
                </a>
                . Give it a click if you like.
              </div>
              <div className="alert alert-danger" role="alert">
                A simple danger alert with{' '}
                <a href="#" className="alert-link">
                  an example link
                </a>
                . Give it a click if you like.
              </div>
              <div className="alert alert-warning" role="alert">
                A simple warning alert with{' '}
                <a href="#" className="alert-link">
                  an example link
                </a>
                . Give it a click if you like.
              </div>
              <div className="alert alert-info mb-0" role="alert">
                A simple info alert with{' '}
                <a href="#" className="alert-link">
                  an example link
                </a>
                . Give it a click if you like.
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Additional Content</h4>
              <p className="card-title-desc">
                Alerts can also contain additional HTML elements like headings and paragraphs.
              </p>

              <div className="alert alert-success mb-0" role="alert">
                <h4 className="alert-heading">Well done!</h4>
                <p>
                  Aww yeah, you successfully read this important alert message. This example text is
                  going to run a bit longer so that you can see how spacing within an alert works
                  with this kind of content.
                </p>
                <hr />
                <p className="mb-0">
                  Whenever you need to, be sure to use margin utilities to keep things nice and tidy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

