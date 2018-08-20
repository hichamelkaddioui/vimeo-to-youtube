'use strict'

const spinner = (require('ora'))()

const logger = require('./lib/logger')
const vimeo = require('./lib/vimeo')
const db = require('./lib/database')

logger.info('Starting app')

db.isEmptyAsync()
  .then(isEmpty => {
    if (!isEmpty) {
      logger.info('Database is not empty, using local values')

      return db.findAsync({})
    }

    logger.info('Database is empty, fetching all videos from Vimeo')

    return vimeo.fetchAllVideos()
      .then(videos => {
        spinner.start()
        spinner.text = `Inserting ${videos.length} videos in database`

        return Promise.all(videos.map(video => db.insertVideoIfNotExistsAsync(video)))
      })
      .then(videos => {
        spinner.succeed('All videos stored in database!')

        return videos
      })
  })
  .then(videos => logger.info(`First video's '_id': ${videos.shift()._id} for a total of ${videos.length + 1} videos`))
  .catch(err => logger.error(err.message))
