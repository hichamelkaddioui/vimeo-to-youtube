require('dotenv').config({ silent: true })

const loggerConfig = require('./logger')
const nedbConfig = require('./nedb')
const vimeoConfig = require('./vimeo')

module.exports = {
  loggerConfig,
  nedbConfig,
  vimeoConfig
}
