import { useMutation } from '@tanstack/react-query'
import type { CreateRoomQuestionRequest, CreateRoomQuestionResponse } from '@/domain/question.types'
import { api } from '@/lib/api'
import { queryClient } from '@/lib/query-client'
import { ROOMS_QUESTIONS_QUERY_KEY } from './use-room-questions'

export function useCreateQuestion(roomId: string) {
  const createQuestion = useMutation({
    mutationFn: async (data: CreateRoomQuestionRequest) => {
      return await api
        .post<CreateRoomQuestionResponse>(`/rooms/${roomId}/questions`, data)
        .then((res) => res.data)
        .catch(() => null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOMS_QUESTIONS_QUERY_KEY, roomId] })
    }
  })

  return {
    createQuestion: createQuestion.mutateAsync,
    isLoading: createQuestion.isPending
  }
}
