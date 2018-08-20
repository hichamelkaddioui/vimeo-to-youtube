require('dotenv').config({ silent: true })

const downloadConfig = require('./download')
const loggerConfig = require('./logger')
const nedbConfig = require('./nedb')
const vimeoConfig = require('./vimeo')

module.exports = {
  downloadConfig,
  loggerConfig,
  nedbConfig,
  vimeoConfig
}
