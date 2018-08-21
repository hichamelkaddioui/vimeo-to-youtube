const logger = require('./logger')
const vimeo = require('./vimeo')
const db = require('./database')

/**
 * Gets the list of videos from the database, or fetches it from Vimeo first if
 * the database is empty.
 *
 * @async
 * @param {Boolean} isEmpty - Whether the database is empty
 * @return {Promise.<Object[]>} The list of videos
 */
const fetchVideosIfDatabaseIsEmpty = isEmpty => {
  if (!isEmpty) {
    logger.info('Database is not empty, using local values')

    return db.findAsync({})
  }

  logger.info('Database is empty, fetching all videos from Vimeo')

  return vimeo.fetchAllVideos()
    .then(videos => Promise.all(videos.map(video => db.insertVideoIfNotExistsAsync(video))))
}

module.exports = { fetchVideosIfDatabaseIsEmpty }
