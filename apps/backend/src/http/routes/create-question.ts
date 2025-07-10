import { and, eq, sql } from 'drizzle-orm'
import type { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { generateAnswer, generateEmbeddings } from '../../services/gemini.ts'

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
    const { roomId } = request.params as ParamsSchema
    const { question } = request.body as BodySchema

    const embeddings = await generateEmbeddings(question)
    const embeddingsAsString = `[${embeddings.join(',')}]`
    const similarity = sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`

    const audioChunks = await db
      .select({
        id: schema.audioChunks.id,
        transcription: schema.audioChunks.transcription,
        similarity
      })
      .from(schema.audioChunks)
      .where(
        and(
          eq(schema.audioChunks.roomId, roomId),
          sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`
        )
      )
      .orderBy(sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) desc`)
      .limit(3)

    let answer = ''
    if (audioChunks.length > 0) {
      const transcriptions = audioChunks.map((chunk) => chunk.transcription)
      answer = await generateAnswer(question, transcriptions)
    }

    const result = await db
      .insert(schema.questions)
      .values({
        roomId,
        question,
        answer
      })
      .returning()

    const insertedQuestion = result[0]

    if (!insertedQuestion) {
      return reply.status(400).send({ error: 'Failed to create new question' })
    }

    return reply.status(201).send({ id: insertedQuestion.id })
  })
}
