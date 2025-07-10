import { count, desc, eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const getRoomsRoute = (app: FastifyInstance) => {
  app.get('/rooms', async (_, reply) => {
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

    return reply.status(200).send({ rooms: result })
  })
}
