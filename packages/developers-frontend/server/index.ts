import fastify from 'fastify'
import fastifyFormbody from 'fastify-formbody'
import fastifyCookie from 'fastify-cookie'
import {
  fastifySession,
  fastifyNuxt,
  fastifyOauthServices
} from '@xarples/accounts-fastify-plugins'

import api from './routes/api'
import routes from './routes'
import config from './config'

// const isDev = process.env.NODE_ENV !== 'production'
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 5002
const server = fastify({
  logger: true
})

server.register(fastifyFormbody)
server.register(fastifySession, {
  secret: config.secret,
  cookie: { secure: false },
  cookieName: 'developersSessionId',
  saveUninitialized: false
})

server.register(fastifyOauthServices.clientService)
server.register(api)
server.register(routes)
server.register(fastifyNuxt)

async function main() {
  try {
    await server.listen(port, host)
  } catch (error) {
    server.log.error(error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export default server
