import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/lib/api/users'
import { UsersListParams, UpdateUserData } from '@/lib/types'
import { useIsAdmin } from '@/hooks/useIsAdmin'
import toast from 'react-hot-toast'

export function useUsers(params?: UsersListParams) {
  const isAdmin = useIsAdmin()

  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error('You do not have permission to view users')
      }
      const response = await usersApi.list(params)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch users')
      }
      return response
    },
    enabled: isAdmin,
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view users')
      } else {
        toast.error(error.message || 'Failed to load users')
      }
    },
  })
}

export function useUser(id: number) {
  const isAdmin = useIsAdmin()

  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error('You do not have permission to view user details')
      }
      const response = await usersApi.get(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch user')
      }
      return response.data
    },
    enabled: !!id && isAdmin,
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view user details')
      } else if (error.response?.status === 404) {
        toast.error('User not found')
      } else {
        toast.error(error.message || 'Failed to load user')
      }
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  const isAdmin = useIsAdmin()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserData }) => {
      if (!isAdmin) {
        throw new Error('You do not have permission to update users')
      }
      const response = await usersApi.update(id, data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update user')
      }
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
      toast.success('User updated successfully')
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to update users')
      } else {
        const message =
          error.response?.data?.message ||
          Object.values(error.response?.data?.errors || {}).flat()[0] ||
          error.message ||
          'Failed to update user'
        toast.error(message)
      }
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  const isAdmin = useIsAdmin()

  return useMutation({
    mutationFn: async (id: number) => {
      if (!isAdmin) {
        throw new Error('You do not have permission to delete users')
      }
      const response = await usersApi.delete(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete user')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted successfully')
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        const message = error.response?.data?.message || 'You do not have permission to delete users'
        toast.error(message)
      } else {
        toast.error(error.message || 'Failed to delete user')
      }
    },
  })
}

