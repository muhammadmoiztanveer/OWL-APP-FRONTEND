import { useQuery } from '@tanstack/react-query'
import { usersApi } from '@/lib/api/users'
import { doctorsApi } from '@/lib/api/doctors'
import { billingApi } from '@/lib/api/billing'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import toast from 'react-hot-toast'

export interface AdminDashboardStats {
  totalUsers: number
  totalDoctors: number
  totalPatients: number
  activeDoctors: number
  frozenDoctors: number
  totalRevenue: number
  pendingInvoices: number
  paidInvoices: number
  overdueInvoices: number
  recentUsers: Array<{
    id: number
    name: string
    email: string
    account_type: string
    created_at: string
  }>
  recentDoctors: Array<{
    id: number
    first_name: string
    last_name: string
    email: string
    is_frozen: boolean
    created_at: string
  }>
  recentInvoices: Array<{
    id: number
    invoice_number: string
    doctor_name: string
    total: string
    status: string
    due_date: string
    created_at: string
  }>
  recentPayments: Array<{
    id: number
    invoice_number: string
    doctor_name: string
    amount: string
    payment_method: string
    status: string
    paid_at: string
  }>
}

export function useAdminDashboard() {
  const isAdmin = useIsAdmin()

  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async (): Promise<AdminDashboardStats> => {
      if (!isAdmin) {
        throw new Error('You do not have permission to view admin dashboard')
      }

      try {
        // Fetch all data in parallel
        const [billingStatsResponse, recentInvoicesResponse, recentPaymentsResponse] = await Promise.all([
          billingApi.getInvoiceStats().catch(() => ({ success: false, data: { total_revenue: 0, pending_count: 0, overdue_count: 0 } })),
          billingApi.getInvoices({ per_page: 5, page: 1 }).catch(() => ({ success: false, data: [] })),
          billingApi.getPayments({ per_page: 5, page: 1 }).catch(() => ({ success: false, data: [] })),
        ])

        // Get full user list for counting and recent users
        const allUsersResponse = await usersApi.list({ per_page: 100 }).catch(() => ({ success: false, data: [], meta: { total: 0 } }))
        const allDoctorsResponse = await doctorsApi.list({ per_page: 100 }).catch(() => ({ success: false, data: [], meta: { total: 0 } }))

        const users = (allUsersResponse.success && allUsersResponse.data ? allUsersResponse.data : []) || []
        const doctors = (allDoctorsResponse.success && allDoctorsResponse.data ? allDoctorsResponse.data : []) || []

        // Count users by type
        const totalUsers = users.length
        const totalDoctors = users.filter((u) => u.account_type === 'doctor').length
        const totalPatients = users.filter((u) => u.account_type === 'patient').length

        // Count doctors by status
        const activeDoctors = doctors.filter((d) => !d.is_frozen).length
        const frozenDoctors = doctors.filter((d) => d.is_frozen).length

        // Get billing stats
        const billingStats = billingStatsResponse.success && billingStatsResponse.data
          ? billingStatsResponse.data
          : {
              total_revenue: 0,
              pending_count: 0,
              overdue_count: 0,
            }

        // Get recent users (last 5)
        const recentUsers = users
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            account_type: u.account_type || 'user',
            created_at: u.created_at,
          }))

        // Get recent doctors (last 5)
        const recentDoctors = doctors
          .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
          .slice(0, 5)
          .map((d) => ({
            id: d.id,
            first_name: d.first_name,
            last_name: d.last_name,
            email: d.email,
            is_frozen: d.is_frozen,
            created_at: d.created_at || '',
          }))

        // Get recent invoices
        const recentInvoices =
          (recentInvoicesResponse.success && recentInvoicesResponse.data
            ? recentInvoicesResponse.data
            : []
          ).map((inv) => ({
            id: inv.id,
            invoice_number: inv.invoice_number,
            doctor_name: inv.doctor?.name || 'N/A',
            total: typeof inv.total === 'string' ? inv.total : inv.total.toString(),
            status: inv.status,
            due_date: inv.due_date,
            created_at: inv.created_at || '',
          }))

        // Get recent payments
        const recentPayments =
          (recentPaymentsResponse.success && recentPaymentsResponse.data
            ? recentPaymentsResponse.data
            : []
          ).map((pay) => ({
            id: pay.id,
            invoice_number: pay.invoice?.invoice_number || 'N/A',
            doctor_name: pay.invoice?.doctor?.name || 'N/A',
            amount: typeof pay.amount === 'string' ? pay.amount : pay.amount.toString(),
            payment_method: pay.payment_method,
            status: pay.status,
            paid_at: pay.paid_at,
          }))

        // Get all invoices to count paid invoices properly
        const allInvoicesResponse = await billingApi.getInvoices({ per_page: 1000 }).catch(() => ({ success: false, data: [] }))
        const allInvoices = allInvoicesResponse.success && allInvoicesResponse.data ? allInvoicesResponse.data : []
        const paidInvoices = allInvoices.filter((inv) => inv.status === 'paid').length

        return {
          totalUsers,
          totalDoctors,
          totalPatients,
          activeDoctors,
          frozenDoctors,
          totalRevenue: typeof billingStats.total_revenue === 'string' 
            ? parseFloat(billingStats.total_revenue) 
            : (billingStats.total_revenue || 0),
          pendingInvoices: billingStats.pending_count || 0,
          paidInvoices: paidInvoices, // Approximate
          overdueInvoices: billingStats.overdue_count || 0,
          recentUsers,
          recentDoctors,
          recentInvoices,
          recentPayments,
        }
      } catch (error: any) {
        console.error('Error fetching admin dashboard data:', error)
        throw error
      }
    },
    enabled: isAdmin,
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view admin dashboard')
      } else {
        console.error('Failed to load admin dashboard:', error)
      }
    },
  })
}


