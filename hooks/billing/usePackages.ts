import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { billingApi } from '@/lib/api/billing'
import { Package, PackagesListParams, CreatePackageRequest, UpdatePackageRequest } from '@/lib/types'
import { usePermissions } from '@/hooks/usePermissions'
import toast from 'react-hot-toast'

export function usePackages(params?: PackagesListParams) {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['packages', params],
    queryFn: async () => {
      if (!hasPermission('billing.manage')) {
        throw new Error('You do not have permission to view packages')
      }
      const response = await billingApi.getPackages(params)
      if (!response.success) {
        throw new Error('Failed to fetch packages')
      }
      return response
    },
    enabled: hasPermission('billing.manage'),
  })
}

export function usePackage(id: number) {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['package', id],
    queryFn: async () => {
      if (!hasPermission('billing.manage')) {
        throw new Error('You do not have permission to view package details')
      }
      const response = await billingApi.getPackage(id)
      if (!response.success) {
        throw new Error('Failed to fetch package')
      }
      return response.data
    },
    enabled: !!id && hasPermission('billing.manage'),
  })
}

export function useCreatePackage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async (data: CreatePackageRequest) => {
      if (!hasPermission('billing.manage')) {
        throw new Error('You do not have permission to create packages')
      }
      const response = await billingApi.createPackage(data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create package')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] })
      toast.success('Package created successfully')
    },
  })
}

export function useUpdatePackage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdatePackageRequest }) => {
      if (!hasPermission('billing.manage')) {
        throw new Error('You do not have permission to update packages')
      }
      const response = await billingApi.updatePackage(id, data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update package')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] })
      toast.success('Package updated successfully')
    },
  })
}

export function useDeletePackage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async (id: number) => {
      if (!hasPermission('billing.manage')) {
        throw new Error('You do not have permission to delete packages')
      }
      const response = await billingApi.deletePackage(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete package')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] })
      toast.success('Package deleted successfully')
    },
  })
}







