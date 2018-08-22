const Datastore = require('nedb')
const Promise = require('bluebird')

const logger = require('../logger')

const { nedbConfig } = require('../../config')

Promise.promisifyAll(Datastore.prototype)

const db = new Datastore(nedbConfig)

db.ensureIndex({ fieldName: 'resource_key', unique: true })

logger.debug(`Database config`, nedbConfig)

module.exports = db
