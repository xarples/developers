import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import axios from 'axios'
import {
  codeChallenge,
  codeVerifier,
  randomBytes
} from '@xarples/accounts-utils'
import config from '../config'

const plugin: FastifyPluginAsync = async fastify => {
  fastify.get('/me', async (request, reply) => {
    return request.session
  })

  fastify.get('/signin', async (request, reply) => {
    const state = randomBytes(16).toString('hex')
    const _codeVerifier = codeVerifier()
    const _codeChallenge = codeChallenge(_codeVerifier, {
      codeChallengeMethod: config.oauth.codeChallengeMethod as 'S256' | 'plain'
    })

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.oauth.clientId,
      redirect_uri: config.oauth.redirectUri,
      code_challenge: _codeChallenge,
      code_challenge_method: config.oauth.codeChallengeMethod,
      response_mode: 'web_message',
      resource: config.oauth.resource,
      scope: config.oauth.scopes.join(' '),
      state
    })

    const url = `${config.oauth.oauthServerHost}/authorize?${params.toString()}`

    request.session.codeVerifier = _codeVerifier
    request.session.state = state

    reply.redirect(url)
  })

  fastify.get('/logout', (request, reply) => {
    request.destroySession(err => {
      if (err) {
        reply.status(500)
        reply.code(500).send('Internal Server Error')
      } else {
        reply.redirect('/')
        // reply.redirect(
        //   `http://localhost:5000/api/users/logout`
        // )
      }
    })
  })

  fastify.get('/callback', async (request, reply) => {
    try {
      // @ts-ignore
      const { code, state } = request.query
      const _codeVerifier = request.session.codeVerifier
      const authState = request.session.state

      if (state === null || state !== authState) {
        reply.send({
          error: "The state doesn't match"
        })

        return
      }

      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.oauth.redirectUri,
        client_id: config.oauth.clientId,
        code_verifier: _codeVerifier
      })

      const result = await axios.post(
        `${config.oauth.oauthServerHost}/token`,
        params,
        {
          auth: {
            username: config.oauth.clientId,
            password: config.oauth.clientSecret
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      request.session.accessToken = result.data.access_token
      request.session.refreshToken = result.data.refresh_token
      request.session.expiresIn = result.data.expires_in
      request.session.tokenType = result.data.token_type

      reply.redirect('/applications')
    } catch (error) {
      reply.code(error.response.status).send(error.response.data)
    }
  })
}

export default fp(plugin, '3.x')
