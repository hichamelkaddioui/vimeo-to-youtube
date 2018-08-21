const colors = require('colors')
const { table } = require('table')

const logger = require('./logger')
const vimeo = require('./vimeo')
const db = require('./database')

/**
 * Gets the list of videos from the database, or fetches it from Vimeo first if
 * the database is empty.
 *
 * @async
 * @return {Promise.<Object[]>} The list of videos
 */
const fetchVideosIfDatabaseIsEmpty = () => db.isEmptyAsync()
  .then(isEmpty => {
    if (!isEmpty) {
      logger.info('Database is not empty, using local values')

      return db.findAsync({})
    }

    logger.info('Database is empty, fetching all videos from Vimeo')

    return vimeo.fetchAllVideos()
      .then(videos => Promise.all(videos.map(video => db.insertVideoIfNotExistsAsync(video))))
  })

const printVideosList = videos => {
  const data = [ ['Name', 'Status'] ]

  videos.forEach(video => {
    const name = video.name.replace(/[\u0001-\u001A]/g, '')

    let status = video.status

    switch (status) {
      case 'uploaded': status = colors.green(status)
        break
      case 'downloaded': status = colors.blue(status)
        break
      case 'uploading':
      case 'downloading':
        status = colors.yellow(status)
        break
    }

    data.push([name, status])
  })

  console.log(table(data))
}

module.exports = { fetchVideosIfDatabaseIsEmpty, printVideosList }
