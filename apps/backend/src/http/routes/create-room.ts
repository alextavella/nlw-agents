import type { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'

const bodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
})

type BodySchema = z.infer<typeof bodySchema>

const opts: RouteShorthandOptions = {
  schema: {
    body: bodySchema
  }
}

export const createRoomRoute = (app: FastifyInstance) => {
  app.post('/rooms', opts, async (request, reply) => {
    const { name, description } = request.body as BodySchema

    const result = await db
      .insert(schema.rooms)
      .values({
        name,
        description
      })
      .returning()

    const insertedRoom = result[0]

    if (!insertedRoom) {
      return reply.status(400).send({ error: 'Failed to create new room' })
    }

    return reply.status(201).send({ id: insertedRoom.id })
  })
}
