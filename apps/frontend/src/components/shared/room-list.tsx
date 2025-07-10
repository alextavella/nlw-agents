import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRooms } from '@/hooks/use-rooms'
import { formatDate } from '@/utils/date.utils'

export function RoomList() {
  const { rooms } = useRooms()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salas Recentes</CardTitle>
        <CardDescription>Acesso rápido para as salas criadas recentemente</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {rooms?.map((room) => (
          <Link
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent"
            key={room.id}
            to={`/room/${room.id}`}
          >
            <div className="flex flex-col gap-1">
              <h3 className="font-medium ">{room.name}</h3>
              <div className="flex items-center gap-2">
                <Badge className="text-xs" variant="secondary">
                  {formatDate(room.createdAt)}
                </Badge>
                <Badge className="text-xs" variant="secondary">
                  {room.questionsCount} pergunta(s)
                </Badge>
              </div>
            </div>
            <span className="flex items-center gap-2 text-sm">
              Entrar
              <ArrowRight className="size-3" />
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
