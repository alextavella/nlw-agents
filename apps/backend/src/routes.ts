import type { FastifyInstance } from 'fastify'
import { createQuestionRoute } from './http/routes/create-question.ts'
import { createRoomRoute } from './http/routes/create-room.ts'
import { getRoomQuestionsRoute } from './http/routes/get-room-questions.ts'
import { getRoomsRoute } from './http/routes/get-rooms.ts'

export const registerRoutes = (app: FastifyInstance) => {
  app.register(getRoomsRoute)
  app.register(createRoomRoute)
  app.register(getRoomQuestionsRoute)
  app.register(createQuestionRoute)
}
