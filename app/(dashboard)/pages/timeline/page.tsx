'use client'

import { useEffect } from 'react'
import Breadcrumb from '@/components/common/Breadcrumb'
import Script from 'next/script'

export default function TimelinePage() {
  useEffect(() => {
    // Initialize timeline carousel if owl carousel is available
    if (typeof window !== 'undefined' && (window as any).jQuery && (window as any).jQuery.fn.owlCarousel) {
      const $ = (window as any).jQuery
      $('#timeline-carousel').owlCarousel({
        loop: false,
        margin: 10,
        nav: true,
        responsive: {
          0: { items: 1 },
          600: { items: 2 },
          1000: { items: 3 },
        },
      })
    }
  }, [])

  const events = [
    { date: '03 May', title: 'First event', description: 'If several languages coalesce, the grammar of the resulting the individual' },
    { date: '08 May', title: 'Second event', description: 'Sed ut perspiciatis unde omnis iste natus error sit illo inventore veritatis' },
    { date: '11 May', title: 'Third event', description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit' },
    { date: '16 May', title: 'Fourth event', description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam' },
    { date: '23 May', title: 'Fifth event', description: 'Itaque earum rerum hic tenetur a sapiente delectus maiores alias consequatur aut' },
    { date: '27 May', title: 'Sixth event', description: 'Donec quam felis ultricies nec pellentesque eu pretium sem consequat quis' },
  ]

  const verticalEvents = [
    { date: '03 May', title: 'Timeline event One', description: 'If several languages coalesce, the grammar of the resulting the individual' },
    { date: '08 May', title: 'Timeline event Two', description: 'Sed ut perspiciatis unde omnis iste natus error sit illo inventore veritatis' },
    { date: '11 May', title: 'Timeline event Three', description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit' },
    { date: '16 May', title: 'Timeline event Four', description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam' },
    { date: '27 May', title: 'Timeline event Five', description: 'Itaque earum rerum hic tenetur a sapiente delectus maiores alias consequatur aut' },
  ]

  return (
    <>
      <Breadcrumb pagetitle="Utility" title="Timeline" />
      <Script src="/assets/libs/owl-carousel/owl-carousel.min.js" strategy="lazyOnload" />

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Horizontal Timeline</h4>

              <div className="hori-timeline" dir="ltr">
                <div className="owl-carousel owl-theme navs-carousel events" id="timeline-carousel">
                  {events.map((event, index) => (
                    <div key={index} className="item event-list">
                      <div className="event-date">
                        <div className="text-primary">{event.date}</div>
                      </div>

                      <div className="px-3">
                        <h5>{event.title}</h5>
                        <p className="text-muted">{event.description}</p>
                        <div>
                          <a href="#">
                            View more <i className="uil uil-arrow-right"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-5">Vertical Timeline</h4>
              <div className="">
                <ul className="verti-timeline list-unstyled">
                  {verticalEvents.map((event, index) => (
                    <li key={index} className="event-list">
                      <div className="event-date text-primar">{event.date}</div>
                      <h5>{event.title}</h5>
                      <p className="text-muted">{event.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

