const Datastore = require('nedb')
const Promise = require('bluebird')
const logger = require('./logger')
const { nedbConfig } = require('../config')

Promise.promisifyAll(Datastore.prototype)

const db = new Datastore(nedbConfig)

db.ensureIndex({ fieldName: 'resource_key', unique: true })

logger.debug('Database loaded with config', nedbConfig)

/**
 * @public
 * @async
 * @return {Promise.<Boolean>} Whether the database is empty
 */
const isEmptyAsync = () => db.countAsync({}).then(numEntries => numEntries === 0)

/**
 * Insert a video in database only if it doesn't already exist.
 *
 * @public
 * @async
 * @param {Object} video - The video to insert
 * @return {Promise.<Object>} The video from the database, either the already existing one or the newly inserted
 */
const insertVideoIfNotExistsAsync = video => {
  logger.debug(`Trying to insert video ${video.name}`)

  if (!video.resource_key) {
    throw new Error(`Video ${video.name} has no key 'resource_key'`)
  }

  return db.findAsync({ 'resource_key': video.resource_key })
    // It is safe to keep only the first element of the array returned by
    // db.findAsync() since all videos' `resource_key` are unique
    .then(res => res.shift())
    .then(res => {
      if (res) {
        logger.debug(`A video with resource_key '${video.resource_key}' already exists, skipping`)
        return res
      }

      logger.debug(`No video with resource_key '${video.resource_key}' found, inserting`)
      return db.insertAsync(Object.assign(video, { status: 'not_downloaded' }))
    })
}

module.exports = Object.assign(db, { isEmptyAsync, insertVideoIfNotExistsAsync })
