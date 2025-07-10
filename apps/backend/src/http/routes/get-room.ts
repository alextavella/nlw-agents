import { count, desc, eq } from 'drizzle-orm'
import type { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { z } from 'zod'
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

export const getRoomRoute = (app: FastifyInstance) => {
  app.get('/rooms/:roomId', opts, async (request, reply) => {
    const { roomId } = request.params as ParamsSchema

    const result = await db
      .select({
        id: schema.rooms.id,
        name: schema.rooms.name,
        questionsCount: count(schema.questions.id),
        createdAt: schema.rooms.createdAt
      })
      .from(schema.rooms)
      .leftJoin(schema.questions, eq(schema.rooms.id, schema.questions.roomId))
      .where(eq(schema.rooms.id, roomId))
      .groupBy(schema.rooms.id)
      .orderBy(desc(schema.rooms.createdAt))

    return reply.status(200).send(result)
  })
}
