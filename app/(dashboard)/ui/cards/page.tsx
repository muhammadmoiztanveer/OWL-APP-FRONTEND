'use client'

import Breadcrumb from '@/components/common/Breadcrumb'
import Image from 'next/image'

export default function CardsPage() {
  return (
    <>
      <Breadcrumb pagetitle="UI Elements" title="Cards" />

      <div className="row">
        <div className="col-md-6 col-xl-3">
          <div className="card">
            <Image
              className="card-img-top img-fluid"
              src="/assets/images/small/img-1.jpg"
              alt="Card image cap"
              width={300}
              height={200}
            />
            <div className="card-body">
              <h4 className="card-title">Card title</h4>
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
              </p>
              <a href="#" className="btn btn-primary waves-effect waves-light">
                Button
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card">
            <Image
              className="card-img-top img-fluid"
              src="/assets/images/small/img-2.jpg"
              alt="Card image cap"
              width={300}
              height={200}
            />
            <div className="card-body">
              <h4 className="card-title">Card title</h4>
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
              </p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Cras justo odio</li>
              <li className="list-group-item">Dapibus ac facilisis in</li>
            </ul>
            <div className="card-body">
              <a href="#" className="card-link">
                Card link
              </a>
              <a href="#" className="card-link">
                Another link
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card">
            <Image
              className="card-img-top img-fluid"
              src="/assets/images/small/img-3.jpg"
              alt="Card image cap"
              width={300}
              height={200}
            />
            <div className="card-body">
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Card title</h4>
              <h6 className="card-subtitle font-14 text-muted">Support card subtitle</h6>
            </div>
            <Image className="img-fluid" src="/assets/images/small/img-4.jpg" alt="Card image cap" width={300} height={200} />
            <div className="card-body">
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
              </p>
              <a href="#" className="card-link">
                Card link
              </a>
              <a href="#" className="card-link">
                Another link
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card card-body">
            <h3 className="card-title">Special title treatment</h3>
            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" className="btn btn-primary waves-effect waves-light">
              Go somewhere
            </a>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card card-body">
            <h3 className="card-title">Special title treatment</h3>
            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" className="btn btn-primary waves-effect waves-light">
              Go somewhere
            </a>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4">
          <div className="card card-body">
            <h4 className="card-title">Special title treatment</h4>
            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" className="btn btn-primary waves-effect waves-light">
              Go somewhere
            </a>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card card-body text-center">
            <h4 className="card-title">Special title treatment</h4>
            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" className="btn btn-primary waves-effect waves-light">
              Go somewhere
            </a>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card card-body text-end">
            <h4 className="card-title">Special title treatment</h4>
            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" className="btn btn-primary waves-effect waves-light">
              Go somewhere
            </a>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4">
          <div className="card">
            <h4 className="card-header">Featured</h4>
            <div className="card-body">
              <h4 className="card-title">Special title treatment</h4>
              <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
              <a href="#" className="btn btn-primary">
                Go somewhere
              </a>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">Quote</div>
            <div className="card-body">
              <blockquote className="card-blockquote mb-0">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                <footer className="blockquote-footer mt-3 font-size-12">
                  Someone famous in <cite title="Source Title">Source Title</cite>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">Featured</div>
            <div className="card-body">
              <h4 className="card-title">Special title treatment</h4>
              <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
              <a href="#" className="btn btn-primary waves-effect waves-light">
                Go somewhere
              </a>
            </div>
            <div className="card-footer text-muted">2 days ago</div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4">
          <div className="card">
            <Image
              className="card-img-top img-fluid"
              src="/assets/images/small/img-5.jpg"
              alt="Card image cap"
              width={300}
              height={200}
            />
            <div className="card-body">
              <h4 className="card-title">Card title</h4>
              <p className="card-text">
                This is a wider card with supporting text below as a natural lead-in to additional content. This content is a
                little bit longer.
              </p>
              <p className="card-text">
                <small className="text-muted">Last updated 3 mins ago</small>
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Card title</h4>
              <p className="card-text">
                This is a wider card with supporting text below as a natural lead-in to additional content. This content is a
                little bit longer.
              </p>
              <p className="card-text">
                <small className="text-muted">Last updated 3 mins ago</small>
              </p>
            </div>
            <Image
              className="card-img-bottom img-fluid"
              src="/assets/images/small/img-7.jpg"
              alt="Card image cap"
              width={300}
              height={200}
            />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <Image className="card-img img-fluid" src="/assets/images/small/img-6.jpg" alt="Card image" width={300} height={200} />
            <div className="card-img-overlay">
              <h4 className="card-title text-white">Card title</h4>
              <p className="card-text text-light">
                This is a wider card with supporting text below as a natural lead-in to additional content. This content is a
                little bit longer.
              </p>
              <p className="card-text">
                <small className="text-white">Last updated 3 mins ago</small>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="row g-0 align-items-center">
              <div className="col-md-4">
                <Image className="card-img img-fluid" src="/assets/images/small/img-2.jpg" alt="Card image" width={200} height={200} />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    This is a wider card with supporting text below as a natural lead-in to additional content.
                  </p>
                  <p className="card-text">
                    <small className="text-muted">Last updated 3 mins ago</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="row g-0 align-items-center">
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    This is a wider card with supporting text below as a natural lead-in to additional content.
                  </p>
                  <p className="card-text">
                    <small className="text-muted">Last updated 3 mins ago</small>
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <Image className="card-img img-fluid" src="/assets/images/small/img-3.jpg" alt="Card image" width={200} height={200} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4">
          <div className="card bg-primary border-primary text-white-50">
            <div className="card-body">
              <h5 className="mb-4 text-white">
                <i className="uil uil-user me-3"></i> Primary Card
              </h5>
              <p className="card-text text-white-50">
                Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-success border-success text-white-50">
            <div className="card-body">
              <h5 className="mb-4 text-white">
                <i className="uil uil-check-circle me-3"></i> Success Card
              </h5>
              <p className="card-text text-white-50">
                Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-info border-info text-white-50">
            <div className="card-body">
              <h5 className="mb-4 text-white">
                <i className="uil uil-question-circle me-3"></i>Info Card
              </h5>
              <p className="card-text text-white-50">
                Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4">
          <div className="card bg-warning border-warning text-white-50">
            <div className="card-body">
              <h5 className="mb-4 text-white">
                <i className="uil uil-exclamation-triangle me-3"></i>Warning Card
              </h5>
              <p className="card-text text-white-50">
                Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-danger border-danger text-white-50">
            <div className="card-body">
              <h5 className="mb-4 text-white">
                <i className="uil uil-exclamation-octagon me-3"></i>Danger Card
              </h5>
              <p className="card-text text-white-50">
                Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-dark border-dark text-white">
            <div className="card-body">
              <h5 className="mb-4 text-white">
                <i className="uil uil-arrow-circle-right me-3"></i>Dark Card
              </h5>
              <p className="card-text text-white-50">
                Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4">
          <div className="card border border-primary">
            <div className="card-header bg-transparent border-primary">
              <h5 className="my-0 text-primary">
                <i className="uil uil-user me-3"></i>Primary outline Card
              </h5>
            </div>
            <div className="card-body">
              <h5 className="card-title">card title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border border-danger">
            <div className="card-header bg-transparent border-danger">
              <h5 className="my-0 text-danger">
                <i className="uil uil-exclamation-octagon me-3"></i>Danger outline Card
              </h5>
            </div>
            <div className="card-body">
              <h5 className="card-title">card title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border border-success">
            <div className="card-header bg-transparent border-success">
              <h5 className="my-0 text-success">
                <i className="uil uil-check-circle me-3"></i>Success Card
              </h5>
            </div>
            <div className="card-body">
              <h5 className="card-title">card title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <h4 className="my-3">Card groups</h4>
          <div className="card-group">
            <div className="card">
              <Image
                className="card-img-top img-fluid"
                src="/assets/images/small/img-4.jpg"
                alt="Card image cap"
                width={300}
                height={200}
              />
              <div className="card-body">
                <h4 className="card-title">Card title</h4>
                <p className="card-text">
                  This is a longer card with supporting text below as a natural lead-in to additional content. This content is a
                  little bit longer.
                </p>
                <p className="card-text">
                  <small className="text-muted">Last updated 3 mins ago</small>
                </p>
              </div>
            </div>

            <div className="card">
              <Image
                className="card-img-top img-fluid"
                src="/assets/images/small/img-5.jpg"
                alt="Card image cap"
                width={300}
                height={200}
              />
              <div className="card-body">
                <h4 className="card-title">Card title</h4>
                <p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                <p className="card-text">
                  <small className="text-muted">Last updated 3 mins ago</small>
                </p>
              </div>
            </div>

            <div className="card">
              <Image
                className="card-img-top img-fluid"
                src="/assets/images/small/img-6.jpg"
                alt="Card image cap"
                width={300}
                height={200}
              />
              <div className="card-body">
                <h4 className="card-title">Card title</h4>
                <p className="card-text">
                  This is a wider card with supporting text below as a natural lead-in to additional content. This card has even
                  longer content than the first to show that equal height action.
                </p>
                <p className="card-text">
                  <small className="text-muted">Last updated 3 mins ago</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <h4 className="my-3">Cards Masonry</h4>

          <div className="row" data-masonry='{"percentPosition": true }'>
            <div className="col-sm-6 col-lg-4">
              <div className="card">
                <Image src="/assets/images/small/img-3.jpg" className="card-img-top" alt="..." width={300} height={200} />
                <div className="card-body">
                  <h5 className="card-title">Card title that wraps to a new line</h5>
                  <p className="card-text">
                    This is a longer card with supporting text below as a natural lead-in to additional content. This content is a
                    little bit longer.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-4">
              <div className="card">
                <Image src="/assets/images/small/img-5.jpg" className="card-img-top" alt="..." width={300} height={200} />
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    This card has supporting text below as a natural lead-in to additional content.
                  </p>
                  <p className="card-text">
                    <small className="text-muted">Last updated 3 mins ago</small>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-4">
              <div className="card">
                <Image src="/assets/images/small/img-7.jpg" className="card-img-top" alt="..." width={300} height={200} />
              </div>
            </div>

            <div className="col-sm-6 col-lg-4">
              <div className="card p-3 text-end">
                <blockquote className="blockquote blockquote-reverse mb-0">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                  <footer className="blockquote-footer mt-0">
                    <small className="text-muted">
                      Someone famous in <cite title="Source Title">Source Title</cite>
                    </small>
                  </footer>
                </blockquote>
              </div>
            </div>

            <div className="col-sm-6 col-lg-4">
              <div className="card">
                <div className="card-body">
                  <blockquote className="blockquote font-size-14 mb-0">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                    <footer className="blockquote-footer font-size-12 mt-0">
                      Someone famous in <cite title="Source Title">Source Title</cite>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-4">
              <div className="card bg-primary text-white text-center p-3">
                <blockquote className="card-blockquote font-size-14 mb-0">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat.</p>
                  <footer className="blockquote-footer text-white font-size-12 mt-0 mb-0">
                    Someone famous in <cite title="Source Title">Source Title</cite>
                  </footer>
                </blockquote>
              </div>
            </div>

            <div className="col-sm-6 col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">
                    This is another card with title and supporting text below. This card has some additional content to make it
                    slightly taller overall.
                  </p>
                  <p className="card-text">
                    <small className="text-muted">Last updated 3 mins ago</small>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-4">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Card title</h5>
                  <p className="card-text">This card has a regular title and short paragraphy of text below it.</p>
                  <p className="card-text">
                    <small className="text-muted">Last updated 3 mins ago</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

