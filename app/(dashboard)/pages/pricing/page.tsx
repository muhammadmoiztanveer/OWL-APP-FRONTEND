'use client'

import Breadcrumb from '@/components/common/Breadcrumb'

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      description: 'Starter plans',
      icon: 'uil-edit',
      price: 19,
      features: [
        { label: 'Users', value: '1' },
        { label: 'Storage', value: '01 GB' },
        { label: 'Domain', value: 'No' },
        { label: 'Support', value: 'No' },
        { label: 'Setup', value: 'No' },
      ],
    },
    {
      name: 'Professional',
      description: 'Professional plans',
      icon: 'uil-medal',
      price: 29,
      features: [
        { label: 'Users', value: '3' },
        { label: 'Storage', value: '10 GB' },
        { label: 'Domain', value: '1' },
        { label: 'Support', value: 'Yes' },
        { label: 'Setup', value: 'No' },
      ],
    },
    {
      name: 'Unlimited',
      description: 'Unlimited plans',
      icon: 'uil-layer-group',
      price: 49,
      features: [
        { label: 'Users', value: '5' },
        { label: 'Storage', value: '40 GB' },
        { label: 'Domain', value: '4' },
        { label: 'Support', value: 'Yes' },
        { label: 'Setup', value: 'Yes' },
      ],
    },
  ]

  return (
    <>
      <Breadcrumb pagetitle="Utility" title="Pricing" />

      <div className="row justify-content-center">
        <div className="col-lg-5">
          <div className="text-center mb-5">
            <h4>Choose your Pricing plan</h4>
            <p className="text-muted mb-4">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
              aperiam, eaque ipsa quae ab illo veritatis
            </p>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="row">
            {plans.map((plan, index) => (
              <div key={index} className="col-xl-4">
                <div className="card pricing-box text-center">
                  <div className="card-body p-4">
                    <div>
                      <div className="mt-3">
                        <h5 className="mb-1">{plan.name}</h5>
                        <p className="text-muted">{plan.description}</p>
                      </div>

                      <div className="py-3">
                        <i className={`uil ${plan.icon} h1 text-primary`}></i>
                      </div>
                    </div>

                    <ul className="list-unstyled plan-features mt-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx}>
                          {feature.label}: <span className="text-primary fw-semibold">{feature.value}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="py-4">
                      <h3>
                        <sup>
                          <small>$</small>
                        </sup>{' '}
                        {plan.price}/ <span className="font-size-13 text-muted">Per month</span>
                      </h3>
                    </div>

                    <div className="text-center plan-btn my-2">
                      <a href="#" className="btn btn-primary waves-effect waves-light">
                        Sign up Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

