'use client'

import Sidebar from '@/components/layouts/Sidebar'
import Topbar from '@/components/layouts/Topbar'
import Footer from '@/components/layouts/Footer'
import RightSidebar from '@/components/layouts/RightSidebar'
import Scripts from '@/components/layouts/Scripts'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div id="layout-wrapper">
        <Topbar />
        <Sidebar />
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">{children}</div>
          </div>
          <Footer />
        </div>
        <RightSidebar />
      </div>
      <Scripts />
    </ProtectedRoute>
  )
}
