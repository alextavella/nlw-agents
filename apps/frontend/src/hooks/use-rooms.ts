import { useQuery } from '@tanstack/react-query'
import type { GetRoomsResponse, Room } from '@/domain/room.types'
import { api } from '@/lib/api'

export const ROOMS_QUERY_KEY = 'get-rooms'

export function useRooms() {
  const { data: rooms, isLoading } = useQuery<Room[]>({
    queryKey: [ROOMS_QUERY_KEY],
    queryFn: async () => {
      return await api
        .get<GetRoomsResponse>('/rooms', {
          params: {
            page: 1,
            limit: 5
          }
        })
        .then((res) => res.data.rooms)
        .catch(() => [])
    }
  })

  return {
    rooms,
    isLoading
  }
}
