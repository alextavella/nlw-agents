import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateRoomRequest, CreateRoomResponse } from '@/domain/room.types'
import { api } from '@/lib/api'
import { ROOMS_QUERY_KEY } from './use-rooms'

export function useCreateRoom() {
  const queryClient = useQueryClient()

  const createRoom = useMutation({
    mutationFn: async (data: CreateRoomRequest) => {
      return await api
        .post<CreateRoomResponse>('/rooms', {
          name: data.name,
          description: data.description
        })
        .then((res) => res.data)
        .catch(() => null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ROOMS_QUERY_KEY] })
    }
  })

  return {
    createRoom: createRoom.mutateAsync,
    isLoading: createRoom.isPending
  }
}
