import { useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  CreateRoomQuestionRequest,
  CreateRoomQuestionResponse,
  RoomQuestion
} from '@/domain/question.types'
import { api } from '@/lib/api'
import { ROOMS_QUESTIONS_QUERY_KEY } from './use-room-questions'

export function useCreateQuestion(roomId: string) {
  const queryClient = useQueryClient()

  const createQuestion = useMutation({
    mutationFn: async (data: CreateRoomQuestionRequest) => {
      return await api
        .post<CreateRoomQuestionResponse>(`/rooms/${roomId}/questions`, data)
        .then((res) => res.data)
        .catch(() => null)
    },
    onMutate: ({ question }) => {
      const questions =
        queryClient.getQueryData<RoomQuestion[]>([ROOMS_QUESTIONS_QUERY_KEY, roomId]) || []

      const newQuestion: RoomQuestion = {
        id: crypto.randomUUID(),
        question,
        answer: null,
        createdAt: new Date().toISOString(),
        isGeneratingAnswer: true
      }

      queryClient.setQueryData<RoomQuestion[]>(
        [ROOMS_QUESTIONS_QUERY_KEY, roomId],
        [newQuestion, ...questions]
      )

      return { newQuestion, questions }
    },
    onSuccess: (data, _variables, context) => {
      queryClient.setQueryData<RoomQuestion[]>(
        [ROOMS_QUESTIONS_QUERY_KEY, roomId],
        (questions: RoomQuestion[] = []) => {
          if (!(context?.newQuestion && data)) {
            return context?.questions ?? questions
          }

          const question: RoomQuestion = Object.assign(context.newQuestion, data, {
            isGeneratingAnswer: false
          })

          return [question, ...context.questions]
        }
      )
    },
    onError: (_error, _variables, context) => {
      if (context?.questions) {
        queryClient.setQueryData<RoomQuestion[]>(
          [ROOMS_QUESTIONS_QUERY_KEY, roomId],
          context.questions
        )
      }
    }
  })

  return {
    createQuestion: createQuestion.mutateAsync,
    isLoading: createQuestion.isPending
  }
}
