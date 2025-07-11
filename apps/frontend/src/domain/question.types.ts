export type RoomQuestion = {
  id: string
  question: string
  answer?: string | null
  createdAt: string
  isGeneratingAnswer?: boolean
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
