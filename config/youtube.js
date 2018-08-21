const path = require('path')
const { getConfigHome } = require('platform-folders')

const requiredKeys = ['YOUTUBE_CLIENT_ID', 'YOUTUBE_CLIENT_SECRET', 'YOUTUBE_PROJECT_ID']

requiredKeys.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Please provide the required API key '${key}'`)
  }
})

module.exports = {
  installed: {
    clientId: process.env.YOUTUBE_CLIENT_ID,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
    projectId: process.env.YOUTUBE_PROJECT_ID,
    redirectUris: process.env.YOUTUBE_REDIRECT_URIS && typeof process.env.YOUTUBE_REDIRECT_URIS.split(',') === 'object'
      ? process.env.YOUTUBE_REDIRECT_URIS.split(',')
      : ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost'],
    authUri: process.env.YOUTUBE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    tokenUri: process.env.YOUTUBE_TOKEN_URI || 'https://www.googleapis.com/oauth2/v3/token',
    authProviderX509CertUrl: process.env.YOUTUBE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs'
  },
  tokenPath: typeof process.env.YOUTUBE_TOKEN_PATH === 'string' && process.env.YOUTUBE_TOKEN_PATH
    ? path.resolve(__dirname, process.env.YOUTUBE_TOKEN_PATH)
    : path.resolve(getConfigHome(), 'vimeo-to-youtube', 'youtube-oauth2-credentials.json')
}
