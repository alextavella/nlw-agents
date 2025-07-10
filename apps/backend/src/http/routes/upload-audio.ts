import type { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { generateEmbeddings, transcribeAudio } from '../../services/gemini.ts'

const paramsSchema = z.object({
  roomId: z.string()
})

type ParamsSchema = z.infer<typeof paramsSchema>

const opts: RouteShorthandOptions = {
  schema: {
    params: paramsSchema
  }
}

export const uploadAudioRoute = (app: FastifyInstance) => {
  app.post('/rooms/:roomId/audio', opts, async (request, reply) => {
    const { roomId } = request.params as ParamsSchema

    const audio = await request.file()

    if (!audio) {
      return reply.status(400).send({ error: 'Audio file is required' })
    }

    const audioBuffer = await audio.toBuffer()
    const audioAsBase64 = audioBuffer.toString('base64')

    // 1. Transcrever o áudio
    const transcription = await transcribeAudio(audioAsBase64, audio.mimetype)
    // 2. Gerar embeddings do texto
    const embeddings = await generateEmbeddings(transcription)
    // 3. Salvar o texto e os embeddings no banco de dados
    const audioChunck = await db
      .insert(schema.audioChunks)
      .values({
        roomId,
        transcription,
        embeddings
      })
      .returning()

    const insertedAudioChunck = audioChunck[0]
    if (!insertedAudioChunck) {
      return reply.status(400).send({ error: 'Failed to create new audio chunck' })
    }

    return reply.status(201).send({ id: insertedAudioChunck.id, transcription, embeddings })
  })
}
