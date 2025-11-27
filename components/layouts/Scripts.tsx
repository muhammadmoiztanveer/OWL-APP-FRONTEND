'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function Scripts() {
  useEffect(() => {
    // Initialize scripts after component mounts
    if (typeof window !== 'undefined') {
      // Initialize simplebar
      const initSimplebar = async () => {
        try {
          const SimpleBar = (await import('simplebar')).default
          const elements = document.querySelectorAll('[data-simplebar]')
          elements.forEach((el) => {
            if (!el.hasAttribute('data-simplebar-initialized')) {
              new SimpleBar(el as HTMLElement)
              el.setAttribute('data-simplebar-initialized', 'true')
            }
          })
        } catch (e) {
          console.log('SimpleBar not available')
        }
      }

      // Initialize node-waves
      const initWaves = () => {
        if ((window as any).Waves) {
          ;(window as any).Waves.init()
        }
      }

      // Initialize counterup (vanilla JS version)
      const initCounterup = () => {
        const counters = document.querySelectorAll('[data-plugin="counterup"]')
        counters.forEach((counter) => {
          const target = parseInt(counter.textContent || '0')
          const duration = 1200
          const increment = target / (duration / 16) // 60fps
          let current = 0

          const updateCounter = () => {
            current += increment
            if (current < target) {
              counter.textContent = Math.floor(current).toString()
              requestAnimationFrame(updateCounter)
            } else {
              counter.textContent = target.toString()
            }
          }
          updateCounter()
        })
      }

      // Initialize right sidebar toggle
      const initRightSidebar = () => {
        const rightBarToggle = document.querySelector('.right-bar-toggle')
        const rightBarOverlay = document.querySelector('.rightbar-overlay')
        const rightBar = document.querySelector('.right-bar')

        if (rightBarToggle) {
          rightBarToggle.addEventListener('click', () => {
            rightBar?.classList.toggle('right-bar-enabled')
          })
        }

        if (rightBarOverlay) {
          rightBarOverlay.addEventListener('click', () => {
            rightBar?.classList.remove('right-bar-enabled')
          })
        }
      }

      // Initialize vertical menu toggle
      const initVerticalMenu = () => {
        const verticalMenuBtn = document.querySelector('.vertical-menu-btn')
        if (verticalMenuBtn) {
          verticalMenuBtn.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-enable')
          })
        }
      }

      // Run initializations
      setTimeout(() => {
        initSimplebar()
        initWaves()
        initCounterup()
        initRightSidebar()
        initVerticalMenu()
      }, 100)
    }
  }, [])

  return (
    <>
      <Script src="/assets/libs/bootstrap/bootstrap.min.js" strategy="lazyOnload" />
      <Script src="/assets/libs/simplebar/simplebar.min.js" strategy="lazyOnload" />
      <Script src="/assets/libs/node-waves/node-waves.min.js" strategy="lazyOnload" />
      <Script src="/assets/js/app.min.js" strategy="lazyOnload" />
    </>
  )
}
