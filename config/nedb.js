const path = require('path')

module.exports = {
  filename: typeof process.env.DB_FILENAME === 'string' && process.env.DB_FILENAME
    ? path.resolve(process.env.DB_FILENAME)
    : path.join(__dirname, '../db/videos.db'),
  autoload: true
}
