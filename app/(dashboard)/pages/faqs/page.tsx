'use client'

import Breadcrumb from '@/components/common/Breadcrumb'
import Image from 'next/image'

export default function FAQsPage() {
  return (
    <>
      <Breadcrumb pagetitle="Utility" title="FAQS" />

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <div className="row justify-content-center mt-4">
                <div className="col-lg-5">
                  <div className="text-center">
                    <h5>Can&apos;t find what you are looking for?</h5>
                    <p className="text-muted">
                      If several languages coalesce, the grammar of the resulting language is more simple and regular than that
                      of the individual
                    </p>

                    <div>
                      <button type="button" className="btn btn-primary mt-2 me-2 waves-effect waves-light">
                        Email Us
                      </button>
                      <button type="button" className="btn btn-success mt-2 waves-effect waves-light">
                        Send us a tweet
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-5">
                <div className="col-xl-3 col-sm-5 mx-auto">
                  <div>
                    <Image
                      src="/assets/images/faqs-img.png"
                      alt=""
                      className="img-fluid mx-auto d-block"
                      width={300}
                      height={300}
                    />
                  </div>
                </div>

                <div className="col-xl-8">
                  <div id="faqs-accordion" className="custom-accordion mt-5 mt-xl-0">
                    <div className="card border shadow-none">
                      <a
                        href="#faqs-gen-ques-collapse"
                        className="text-dark"
                        data-bs-toggle="collapse"
                        aria-haspopup="true"
                        aria-expanded="true"
                        aria-controls="faqs-gen-ques-collapse"
                      >
                        <div className="bg-light p-3">
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-xs">
                                <div className="avatar-title rounded-circle font-size-22">
                                  <i className="uil uil-question-circle"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <h5 className="font-size-16 mb-1">General Questions</h5>
                              <p className="text-muted text-truncate mb-0">General Questions</p>
                            </div>
                            <div className="flex-shrink-0">
                              <i className="mdi mdi-chevron-up accor-down-icon font-size-16"></i>
                            </div>
                          </div>
                        </div>
                      </a>

                      <div id="faqs-gen-ques-collapse" className="collapse show" data-bs-parent="#faqs-accordion">
                        <div className="p-4">
                          <div className="row">
                            <div className="col-md-6">
                              <div>
                                <div className="d-flex align-items-start mt-4">
                                  <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                      <div className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-22">
                                        <i className="uil uil-question-circle"></i>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-grow-1">
                                    <h5 className="font-size-16 mt-1">What is Lorem Ipsum ?</h5>
                                    <p className="text-muted">
                                      If several languages coalesce, the grammar of the resulting language is more simple
                                    </p>
                                  </div>
                                </div>

                                <div className="d-flex align-items-start mt-4">
                                  <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                      <div className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-22">
                                        <i className="uil uil-question-circle"></i>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-grow-1">
                                    <h5 className="font-size-16 mt-1">Where does it come from ?</h5>
                                    <p className="text-muted">
                                      Everyone realizes why a new common language would be desirable one could refuse to pay
                                      expensive translators.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div>
                                <div className="d-flex align-items-start mt-4">
                                  <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                      <div className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-22">
                                        <i className="uil uil-question-circle"></i>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-grow-1">
                                    <h5 className="font-size-16 mt-1">Why do we use it ?</h5>
                                    <p className="text-muted">
                                      Their separate existence is a myth. For science, music, sport, etc, Europe uses the same
                                      vocabulary.{' '}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card border shadow-none">
                      <a
                        href="#faqs-privacy-policy-collapse"
                        className="text-dark collapsed"
                        data-bs-toggle="collapse"
                        aria-haspopup="true"
                        aria-expanded="false"
                        aria-controls="faqs-privacy-policy-collapse"
                      >
                        <div className="bg-light p-3">
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-xs">
                                <div className="avatar-title rounded-circle font-size-22">
                                  <i className="uil uil-shield-check"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <h5 className="font-size-16 mb-1">Privacy Policy</h5>
                              <p className="text-muted text-truncate mb-0">Privacy Policy Questions</p>
                            </div>
                            <div className="flex-shrink-0">
                              <i className="mdi mdi-chevron-up accor-down-icon font-size-16"></i>
                            </div>
                          </div>
                        </div>
                      </a>

                      <div id="faqs-privacy-policy-collapse" className="collapse" data-bs-parent="#faqs-accordion">
                        <div className="p-4">
                          <div className="row">
                            <div className="col-md-6">
                              <div>
                                <div className="d-flex align-items-start mt-4">
                                  <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                      <div className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-22">
                                        <i className="uil uil-question-circle"></i>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-grow-1">
                                    <h5 className="font-size-16 mt-1">Where can I get some ?</h5>
                                    <p className="text-muted">
                                      If several languages coalesce, the grammar of the resulting language is more simple
                                    </p>
                                  </div>
                                </div>

                                <div className="d-flex align-items-start mt-4">
                                  <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                      <div className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-22">
                                        <i className="uil uil-question-circle"></i>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-grow-1">
                                    <h5 className="font-size-16 mt-1">Why do we use it ?</h5>
                                    <p className="text-muted">
                                      Their separate existence is a myth. For science, music, sport, etc, Europe uses the same
                                      vocabulary.{' '}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div>
                                <div className="d-flex align-items-start mt-4">
                                  <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                      <div className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-22">
                                        <i className="uil uil-question-circle"></i>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-grow-1">
                                    <h5 className="font-size-16 mt-1">Where does it come from ?</h5>
                                    <p className="text-muted">
                                      Everyone realizes why a new common language would be desirable one could refuse to pay
                                      expensive translators.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card border shadow-none">
                      <a
                        href="#faqs-pricing-plans-collapse"
                        className="text-dark collapsed"
                        data-bs-toggle="collapse"
                        aria-haspopup="true"
                        aria-expanded="false"
                        aria-controls="faqs-pricing-plans-collapse"
                      >
                        <div className="bg-light p-3">
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar-xs">
                                <div className="avatar-title rounded-circle font-size-22">
                                  <i className="uil uil-pricetag-alt"></i>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <h5 className="font-size-16 mb-1">Pricing & Plans</h5>
                              <p className="text-muted text-truncate mb-0">Pricing & Plans Questions</p>
                            </div>
                            <div className="flex-shrink-0">
                              <i className="mdi mdi-chevron-up accor-down-icon font-size-16"></i>
                            </div>
                          </div>
                        </div>
                      </a>

                      <div id="faqs-pricing-plans-collapse" className="collapse" data-bs-parent="#faqs-accordion">
                        <div className="p-4">
                          <div className="row">
                            <div className="col-md-6">
                              <div>
                                <div className="d-flex align-items-start mt-4">
                                  <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                      <div className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-22">
                                        <i className="uil uil-question-circle"></i>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-grow-1">
                                    <h5 className="font-size-16 mt-1">Where does it come from ?</h5>
                                    <p className="text-muted">
                                      Everyone realizes why a new common language would be desirable one could refuse to pay
                                      expensive translators.
                                    </p>
                                  </div>
                                </div>

                                <div className="d-flex align-items-start mt-4">
                                  <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                      <div className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-22">
                                        <i className="uil uil-question-circle"></i>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-grow-1">
                                    <h5 className="font-size-16 mt-1">What is Lorem Ipsum ?</h5>
                                    <p className="text-muted">
                                      If several languages coalesce, the grammar of the resulting language is more simple
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div>
                                <div className="d-flex align-items-start mt-4">
                                  <div className="flex-shrink-0 me-3">
                                    <div className="avatar-xs">
                                      <div className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-22">
                                        <i className="uil uil-question-circle"></i>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-grow-1">
                                    <h5 className="font-size-16 mt-1">Why do we use it ?</h5>
                                    <p className="text-muted">
                                      Their separate existence is a myth. For science, music, sport, etc, Europe uses the same
                                      vocabulary.{' '}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

