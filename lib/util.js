const colors = require('colors')
const pretty = require('prettysize')
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

/**
 * Get the download object with the largest `size`.
 *
 * @private
 * @param {Object} video - The video to insert
 * @return {Object} An element of `video.download`
 */
const getBestDownloadOption = video => video
  .download
  .sort((downloadA, downloadB) => downloadA.size - downloadB.size)
  .pop()

/**
 * Prints a table of videos.
 *
 * @param {Object} videos - The videos to print.
 */
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

  const size = videos
    .filter(video => video.download.length)
    .reduce((acc, curr) => acc + getBestDownloadOption(curr).size, 0)

  logger.info(`Total size: ${pretty(size)}`)
}

/**
 * Reset videos marked as 'downloading'.
 *
 * @return {Promise.<Number>} The number of videos reset
 */
const resetDownloadingVideos = () => db.updateAsync({ status: 'downloading' }, { $set: { status: 'not_downloaded' } }, { multi: true })

module.exports = { fetchVideosIfDatabaseIsEmpty, getBestDownloadOption, printVideosList, resetDownloadingVideos }
