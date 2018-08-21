require('dotenv').config({ silent: true })

const downloadConfig = require('./download')
const loggerConfig = require('./logger')
const nedbConfig = require('./nedb')
const uploadConfig = require('./upload')
const vimeoConfig = require('./vimeo')
const youtubeConfig = require('./youtube')

module.exports = {
  downloadConfig,
  loggerConfig,
  nedbConfig,
  uploadConfig,
  vimeoConfig,
  youtubeConfig
}
