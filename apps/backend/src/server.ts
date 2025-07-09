import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { env } from './env.ts'
import { getRoomsRoute } from './http/routes/get-rooms.ts'

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: 'http://localhost:3333'
})
app.get('/', () => {
  return 'Hello World!'
})

app.register(getRoomsRoute)

app.listen({ port: env.PORT }).then(() => {
  app.log.info(`🚀 Server is running at http://localhost:${env.PORT}`)
})
