import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorApi } from '@/lib/api/doctor'
import { Patient, PatientsListParams, CreatePatientRequest, UpdatePatientRequest } from '@/lib/types'
import { usePermissions } from '@/hooks/usePermissions'
import toast from 'react-hot-toast'

export function usePatients(params?: PatientsListParams) {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['patients', params],
    queryFn: async () => {
      if (!hasPermission('patient.view')) {
        throw new Error('You do not have permission to view patients')
      }
      const response = await doctorApi.getPatients(params)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch patients')
      }
      return response
    },
    enabled: hasPermission('patient.view'),
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view patients')
      } else {
        toast.error(error.message || 'Failed to load patients')
      }
    },
  })
}

export function usePatient(id: number) {
  const { hasPermission } = usePermissions()

  return useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      if (!hasPermission('patient.view')) {
        throw new Error('You do not have permission to view patient details')
      }
      const response = await doctorApi.getPatient(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch patient')
      }
      return response.data
    },
    enabled: !!id && hasPermission('patient.view'),
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view patient details')
      } else {
        toast.error(error.message || 'Failed to load patient')
      }
    },
  })
}

export function useCreatePatient() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async (data: CreatePatientRequest) => {
      if (!hasPermission('patient.create')) {
        throw new Error('You do not have permission to create patients')
      }
      const response = await doctorApi.createPatient(data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create patient')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      toast.success('Patient created successfully')
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to create patients')
      } else {
        const message =
          error.response?.data?.message ||
          Object.values(error.response?.data?.errors || {}).flat()[0] ||
          error.message ||
          'Failed to create patient'
        toast.error(message)
      }
    },
  })
}

export function useUpdatePatient() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdatePatientRequest }) => {
      if (!hasPermission('patient.update')) {
        throw new Error('You do not have permission to update patients')
      }
      const response = await doctorApi.updatePatient(id, data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update patient')
      }
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['patient', variables.id] })
      toast.success('Patient updated successfully')
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to update patients')
      } else {
        const message =
          error.response?.data?.message ||
          Object.values(error.response?.data?.errors || {}).flat()[0] ||
          error.message ||
          'Failed to update patient'
        toast.error(message)
      }
    },
  })
}

export function useDeletePatient() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermissions()

  return useMutation({
    mutationFn: async (id: number) => {
      if (!hasPermission('patient.delete')) {
        throw new Error('You do not have permission to delete patients')
      }
      const response = await doctorApi.deletePatient(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete patient')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      toast.success('Patient deleted successfully')
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        toast.error('You do not have permission to delete patients')
      } else {
        toast.error(error.message || 'Failed to delete patient')
      }
    },
  })
}

