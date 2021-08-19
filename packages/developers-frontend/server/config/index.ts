export default {
  secret:
    process.env.SECRET ||
    'ceac77ba4ceba7d0fc8011fa82383b3f64cc7a1580f000182b7aba77adc31607',
  oauth: {
    clientId: process.env.CLIENT_ID || 'ckraxj4gu00033u9kvjny5bv7',
    clientSecret:
      process.env.CLIENT_SECRET ||
      'ceac77ba4ceba7d0fc8011fa82383b3f64cc7a1580f000182b7aba77adc31607',
    redirectUri:
      process.env.CLIENT_REDIRECT_URI || 'http://localhost:5002/callback',
    oauthServerHost: process.env.OAUTH_SERVER_HOST || 'http://localhost:5000',
    scopes: ['clients:read', 'clients:write'],
    codeChallengeMethod: 'S256',
    resource: 'http://localhost:5000'
  }
}
