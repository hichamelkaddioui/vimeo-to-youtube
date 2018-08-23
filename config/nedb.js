const path = require('path')
const { getDataHome } = require('platform-folders')

module.exports = {
  filename: typeof process.env.DB_FILENAME === 'string' && process.env.DB_FILENAME
    ? path.resolve(__dirname, process.env.DB_FILENAME)
    : path.resolve(getDataHome(), 'vimeo-to-youtube', 'db', 'videos.db'),
  autoload: true
}
