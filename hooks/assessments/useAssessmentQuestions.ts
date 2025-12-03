import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assessmentsApi } from '@/lib/api/assessments'
import { Question, CreateQuestionRequest, UpdateQuestionRequest, AssessmentQuestionsListParams } from '@/lib/types'
import toast from 'react-hot-toast'

export function useAssessmentQuestions(params?: AssessmentQuestionsListParams) {
  return useQuery({
    queryKey: ['assessment-questions', params],
    queryFn: async () => {
      const response = await assessmentsApi.listQuestions(params)
      if (!response.success) {
        throw new Error('Failed to fetch questions')
      }
      return response
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to load questions'
      toast.error(message)
    },
  })
}

export function useAssessmentQuestion(id: number) {
  return useQuery({
    queryKey: ['assessment-question', id],
    queryFn: async () => {
      const response = await assessmentsApi.getQuestion(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch question')
      }
      return response.data
    },
    enabled: !!id,
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to load question'
      toast.error(message)
    },
  })
}

export function useCreateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateQuestionRequest) => {
      const response = await assessmentsApi.createQuestion(data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create question')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment-questions'] })
      toast.success('Question created successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {}).flat()[0] ||
        error.message ||
        'Failed to create question'
      toast.error(message)
    },
  })
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateQuestionRequest }) => {
      const response = await assessmentsApi.updateQuestion(id, data)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update question')
      }
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assessment-questions'] })
      queryClient.invalidateQueries({ queryKey: ['assessment-question', variables.id] })
      toast.success('Question updated successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {}).flat()[0] ||
        error.message ||
        'Failed to update question'
      toast.error(message)
    },
  })
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await assessmentsApi.deleteQuestion(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete question')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment-questions'] })
      toast.success('Question deleted successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to delete question'
      toast.error(message)
    },
  })
}

