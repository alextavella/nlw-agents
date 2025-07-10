import { count, desc, eq } from 'drizzle-orm'
import type { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { z } from 'zod'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

const querySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10)
})

type QuerySchema = z.infer<typeof querySchema>

const opts: RouteShorthandOptions = {
  schema: {
    querystring: querySchema
  }
}

export const getRoomsRoute = (app: FastifyInstance) => {
  app.get('/rooms', opts, async (request, reply) => {
    const { page, limit } = request.query as QuerySchema

    const result = await db
      .select({
        id: schema.rooms.id,
        name: schema.rooms.name,
        questionsCount: count(schema.questions.id),
        createdAt: schema.rooms.createdAt
      })
      .from(schema.rooms)
      .leftJoin(schema.questions, eq(schema.rooms.id, schema.questions.roomId))
      .groupBy(schema.rooms.id)
      .orderBy(desc(schema.rooms.createdAt))
      .limit(limit)
      .offset((page - 1) * limit)

    return reply.status(200).send({ rooms: result })
  })
}
