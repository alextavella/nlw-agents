import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import type { GetRoomsResponse, Room } from '@/domain/room.types'
import { api } from '@/lib/api'

export function CreateRoom() {
  const { data: rooms, isLoading } = useQuery<Room[]>({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      return await api
        .get<GetRoomsResponse>('/rooms')
        .then((res) => res.data.rooms)
        .catch(() => [])
    }
  })

  return (
    <div>
      <h1>CreateRoom</h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-1">
          {rooms?.map((room) => (
            <Link className="underline" key={room.id} to={`/room/${room.id}`}>
              {room.name}
            </Link>
          ))}
        </div>
      )}

      <Link className="underline" to="/room">
        Acessar sala
      </Link>
    </div>
  )
}
