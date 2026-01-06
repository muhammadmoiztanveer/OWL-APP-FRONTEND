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
        throw new Error((response as any).message || 'Failed to fetch patients')
      }
      return response
    },
    enabled: hasPermission('patient.view'),
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
        throw new Error((response as any).message || 'Failed to fetch patient')
      }
      return response.data
    },
    enabled: !!id && hasPermission('patient.view'),
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
        throw new Error((response as any).message || 'Failed to create patient')
      }
      // ✅ NEW: Response now includes { patient, invitation } - return full data
      return response.data || response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      toast.success('Patient created successfully')
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
        throw new Error((response as any).message || 'Failed to update patient')
      }
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.invalidateQueries({ queryKey: ['patient', variables.id] })
      toast.success('Patient updated successfully')
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
        throw new Error((response as any).message || 'Failed to delete patient')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      toast.success('Patient deleted successfully')
    },
  })
}

