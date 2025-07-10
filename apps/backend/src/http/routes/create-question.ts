import type { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

const bodySchema = z.object({
  question: z.string().min(1)
})
const paramsSchema = z.object({
  roomId: z.string()
})

type BodySchema = z.infer<typeof bodySchema>
type ParamsSchema = z.infer<typeof paramsSchema>

const opts: RouteShorthandOptions = {
  schema: {
    body: bodySchema,
    params: paramsSchema
  }
}

export const createQuestionRoute = (app: FastifyInstance) => {
  app.post('/rooms/:roomId/questions', opts, async (request, reply) => {
    const { question } = request.body as BodySchema
    const { roomId } = request.params as ParamsSchema

    const result = await db
      .insert(schema.questions)
      .values({
        question,
        roomId
      })
      .returning()

    const insertedQuestion = result[0]

    if (!insertedQuestion) {
      return reply.status(400).send({ error: 'Failed to create new question' })
    }

    return reply.status(201).send({ id: insertedQuestion.id })
  })
}
