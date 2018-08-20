require('dotenv').config({ silent: true })

const loggerConfig = require('./logger')
const vimeoConfig = require('./vimeo')

module.exports = {
  loggerConfig,
  vimeoConfig
}
