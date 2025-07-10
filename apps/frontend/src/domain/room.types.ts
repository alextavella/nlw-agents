export type Room = {
  id: string
  name: string
  questionsCount: number
  createdAt: string
}

export type GetRoomsResponse = {
  rooms: Room[]
}

export type CreateRoomRequest = {
  name: string
  description: string
}

export type CreateRoomResponse = {
  id: string
}

export type RoomQuestion = {
  id: string
  question: string
  createdAt: string
}

export type GetRoomQuestionsResponse = {
  questions: RoomQuestion[]
}
