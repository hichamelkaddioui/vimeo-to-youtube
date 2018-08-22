const logger = require('../logger')
const { databaseIsEmpty, findAll, insertIfNotExists } = require('../database')

const { fetchAllVideos } = require('./vimeo')

const fetchAndInsert = () => fetchAllVideos().then(videos => Promise.all(videos.map(video => insertIfNotExists(video))))

const fetchIfDatabaseIsEmpty = () => databaseIsEmpty()
  .then(databaseIsEmpty => {
    if (!databaseIsEmpty) {
      logger.info('Using database values')

      return findAll()
    }

    logger.info('Database is empty, fetching all videos from Vimeo')

    return fetchAndInsert()
  })

module.exports = { fetchAndInsert, fetchIfDatabaseIsEmpty }
