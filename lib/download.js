const path = require('path')
const download = require('download')
const spinner = (require('ora'))()

const logger = require('./logger')
const db = require('./database')
const { getBestDownloadOption } = require('./util')

const { downloadConfig } = require('../config')

logger.debug('Download worker loaded with config', downloadConfig)

let numVideosToDownload

/**
 * Download videos.
 *
 * @private
 * @async
 * @param {Object[]} videos - The videos to download
 * @param {String} dest - The destination folder
 * @return {Promise.<Object[]>} The happy downloaded videos
 */
const downloadVideosAsync = (videos, dest) => videos
  .map(video => downloadVideoAsync(video, dest)
    .then(() => spinner.succeed(`'${video.name}' downloaded!`))
    .catch(err => db.updateAsync({ _id: video._id }, { $set: { status: 'download_failed' } })
      .then(() => {
        spinner.fail(`An error occured while downloading the video '${video.name}'`)
        spinner.fail(`Error: ${err.message}`)

        logger.debug(`Error while downloading ${video.name}`, err)

        throw err
      })
    )
    .then(() => {
      spinner.text = `Downloading ${--numVideosToDownload} video(s)...`
      spinner.start()
    })
    .then(() => video)
  )

/**
 * Download a video.
 *
 * @private
 * @async
 * @param {Object} video - The video to download
 * @param {String} dest - The destination folder
 * @return {Promise.<Object>} The happy downloaded video
 */
const downloadVideoAsync = (video, dest) => {
  const downloadOption = getBestDownloadOption(video)
  const filename = `${video.name}.mp4`

  logger.debug(`Using download option for '${video.name}'`, downloadOption)
  logger.debug(`Marking '${video.name}' as downloading`)

  return db.updateAsync({ _id: video._id }, { $set: { status: 'downloading' } })
    .then(() => download(downloadOption.link, dest, { filename }))
    .then(() => {
      logger.debug(`Marking '${video.name}' as downloaded`)
      return db.updateAsync({ _id: video._id }, { $set: { status: 'downloaded', filename: path.join(dest, filename) } })
    })
}

/**
 * Download all the videos that have the status `not_downloaded`.
 *
 * @public
 * @async
 * @param {Object} video - The video to download
 * @param {String} dest - The destination folder
 * @return {Promise}
 */
const worker = ({ dataPath, concurrency }) => () => db.findAsync({ status: 'not_downloaded' })
  .then(videos => videos.filter(video => video.download.length))
  .then(videos => {
    if (!videos.length) {
      return
    }

    logger.info(`${videos.length} videos remain to be downloaded`)

    let videosToDownload = videos.slice(0, concurrency)
    numVideosToDownload = videosToDownload.length

    spinner.start()
    spinner.text = `Downloading ${numVideosToDownload} videos...`

    return Promise.all(downloadVideosAsync(videosToDownload, dataPath))
      .then(videos => spinner.succeed(`${videos.length} videos downloaded!`))
      .catch(err => err)
      .then(() => worker({ dataPath, concurrency })())
  })

module.exports = worker(downloadConfig)
