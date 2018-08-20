['VIMEO_CLIENT_ID', 'VIMEO_CLIENT_SECRET', 'VIMEO_ACCESS_TOKEN'].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Please provide the required API key '${key}'`)
  }
})

module.exports = {
  clientId: process.env.VIMEO_CLIENT_ID,
  clientSecret: process.env.VIMEO_CLIENT_SECRET,
  accessToken: process.env.VIMEO_ACCESS_TOKEN,
  perPage: process.env.VIMEO_VIDEOS_PER_PAGE || 100,
  fields: process.env.VIMEO_VIDEOS_FIELDS || 'resource_key,name,description,tags,files,download,privacy,categories'
}
