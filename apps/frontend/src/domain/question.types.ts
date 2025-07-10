export type RoomQuestion = {
  id: string
  question: string
  createdAt: string
}

export type GetRoomQuestionsResponse = {
  questions: RoomQuestion[]
}

export type CreateRoomQuestionRequest = {
  question: string
}

export type CreateRoomQuestionResponse = {
  id: string
  question: string
  answer?: string
}
