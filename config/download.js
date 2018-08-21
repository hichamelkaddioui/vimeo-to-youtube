const path = require('path')
const { getDataHome } = require('platform-folders')

module.exports = {
  dataPath: typeof process.env.DATA_PATH === 'string' && process.env.DATA_PATH
    ? path.resolve(__dirname, process.env.DATA_PATH)
    : path.resolve(getDataHome(), 'vimeo-to-youtube'),
  concurrency: process.env.WORKER_PARALLEL_DOWNLOADS || 3
}
