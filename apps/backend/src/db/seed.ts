import { reset, seed } from 'drizzle-seed'
import { db, sql } from './connection.ts'
import { schema } from './schema/index.ts'

// Reset the database
await reset(db, schema)

// Seed the database
await seed(db, schema).refine((f) => {
  return {
    rooms: {
      count: 20,
      columns: {
        name: f.companyName(),
        description: f.loremIpsum(),
        createdAt: f.date({ minDate: '2024-01-01', maxDate: '2025-01-01' })
      },
      with: {
        questions: 1
      }
    },
    questions: {
      columns: {
        question: f.loremIpsum({ sentencesCount: 1 }),
        answer: f.loremIpsum({ sentencesCount: 2 })
      }
    }
  }
})

// Close the database connection
await sql.end()

// biome-ignore lint/suspicious/noConsole: only used in dev
console.log('Seed completed')
