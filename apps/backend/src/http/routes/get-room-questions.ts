import { desc, eq } from 'drizzle-orm'
import type { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

const paramsSchema = z.object({
  roomId: z.string()
})

type ParamsSchema = z.infer<typeof paramsSchema>

const opts: RouteShorthandOptions = {
  schema: {
    params: paramsSchema
  }
}

export const getRoomQuestionsRoute = (app: FastifyInstance) => {
  app.get('/rooms/:roomId/questions', opts, async (request, reply) => {
    const { roomId } = request.params as ParamsSchema

    const result = await db
      .select({
        id: schema.questions.id,
        question: schema.questions.question,
        answer: schema.questions.answer,
        createdAt: schema.questions.createdAt
      })
      .from(schema.questions)
      .where(eq(schema.questions.roomId, roomId))
      .orderBy(desc(schema.questions.createdAt))

    return reply.status(200).send({ questions: result })
  })
}
