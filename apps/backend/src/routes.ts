import type { FastifyInstance } from 'fastify'
import { createQuestionRoute } from './http/routes/create-question.ts'
import { createRoomRoute } from './http/routes/create-room.ts'
import { getRoomRoute } from './http/routes/get-room.ts'
import { getRoomQuestionsRoute } from './http/routes/get-room-questions.ts'
import { getRoomsRoute } from './http/routes/get-rooms.ts'
import { uploadAudioRoute } from './http/routes/upload-audio.ts'

export const registerRoutes = (app: FastifyInstance) => {
  app.register(getRoomsRoute)
  app.register(getRoomRoute)
  app.register(getRoomQuestionsRoute)
  app.register(createRoomRoute)
  app.register(createQuestionRoute)
  app.register(uploadAudioRoute)
}
