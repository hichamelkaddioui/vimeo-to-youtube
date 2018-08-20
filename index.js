'use strict'

const logger = require('./lib/logger')
const vimeo = require('./lib/vimeo')

logger.info('Starting app')

vimeo.fetchAllVideos()
  .then(videos => logger.info(`Yay! ${videos.length} videos retrieved from the Vimeo API.`))
  .catch(err => logger.error(err.message))
