const { logger } = require('../logger')
const { fetchAll } = require('../vimeo')

const { databaseIsEmpty, findAll, insertIfNotExists } = require('./database')

const fetchAndInsert = () => fetchAll().then(videos => Promise.all(videos.map(video => insertIfNotExists(video))))

const fetchIfDatabaseIsEmpty = () => databaseIsEmpty()
  .then(databaseIsEmpty => {
    if (!databaseIsEmpty) {
      logger.debug('Using database values')

      return findAll()
    }

    logger.debug('Database is empty, fetching all videos from Vimeo')

    return fetchAndInsert()
  })

module.exports = { fetchAndInsert, fetchIfDatabaseIsEmpty }
