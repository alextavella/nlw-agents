import { desc } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

export const getRoomsRoute = (app: FastifyInstance) => {
  app.get('/rooms', async (_, reply) => {
    const rooms = await db
      .select({
        id: schema.rooms.id,
        name: schema.rooms.name
      })
      .from(schema.rooms)
      .orderBy(desc(schema.rooms.createdAt))
    return reply.status(200).send({ rooms })
  })
}
