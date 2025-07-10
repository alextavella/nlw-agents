import { pgTable, text, timestamp, uuid, vector } from 'drizzle-orm/pg-core'
import { rooms } from './rooms.ts'

export const audioChunks = pgTable('audio_chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  transcription: text('transcription').notNull(),
  embeddings: vector('embeddings', { dimensions: 768 }).notNull(), // 768 dimensions for Gemini embeddings
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  // Relations
  roomId: uuid('room_id')
    .references(() => rooms.id)
    .notNull()
})
