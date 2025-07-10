import { useQuery } from '@tanstack/react-query'
import type { GetRoomQuestionsResponse, RoomQuestion } from '@/domain/room.types'
import { api } from '@/lib/api'

export const ROOMS_QUESTIONS_QUERY_KEY = 'get-room-questions'

export function useRoomQuestions(roomId: string) {
  const { data: questions, isLoading } = useQuery<RoomQuestion[]>({
    queryKey: [ROOMS_QUESTIONS_QUERY_KEY, roomId],
    queryFn: async () => {
      return await api
        .get<GetRoomQuestionsResponse>(`/rooms/${roomId}/questions`)
        .then((res) => res.data.questions)
        .catch(() => [])
    }
  })

  return {
    questions,
    isLoading
  }
}
