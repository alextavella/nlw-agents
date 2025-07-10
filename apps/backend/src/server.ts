import { fastifyCors } from '@fastify/cors'
import { fastifyMultipart } from '@fastify/multipart'
import { fastify } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { env } from './env.ts'
import { registerRoutes } from './routes.ts'

const app = fastify({ logger: false }).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, { origin: '*' })
app.register(fastifyMultipart, { limits: { fileSize: 1024 * 1024 * 50 } })
app.register(registerRoutes)

app.get('/health', () => {
  return "I'm healthy!"
})

app.listen({ port: env.PORT }).then(() => {
  // biome-ignore lint/suspicious/noConsole: only log
  console.log(`🚀 Server is running at http://localhost:${env.PORT}`)
})
