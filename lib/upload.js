const fs = require('fs-extra')
const spinner = (require('ora'))()

const youtube = require('./youtube')
const logger = require('./logger')
const db = require('./database')

const { uploadConfig } = require('../config')

logger.debug('Upload worker loaded with config', uploadConfig)

let numVideosToUpload

/**
 * @private
 * @param {Object} video
 * @return {Object} The YouTube upload options
 */
const getYoutubeInsertOptions = video => (
  {
    part: 'id,snippet,status',
    notifySubscribers: false,
    requestBody: {
      snippet: {
        title: video.name,
        description: video.description,
        tags: video.tags.map(tag => tag.tag)
      },
      status: {
        privacyStatus: 'private'
      }
    },
    media: {
      body: fs.createReadStream(video.filename)
    }
  }
)

/**
 * @private
 * @async
 * @param {Object.video} video - The video which failed
 * @param {Object.err} err - The exception
 * @throws err
 */
const uploadErrorHandler = ({ video, err }) => db.updateAsync({ _id: video._id }, { $set: { status: 'upload_failed' } })
  .then(() => {
    spinner.fail(`An error occured while uploading the video '${video.name}'`)
    spinner.fail(`Error: ${err.message}`)

    logger.debug(`Error while uploading ${video.name}`, err)

    throw err
  })

/**
 * Upload videos.
 *
 * @private
 * @async
 * @param {Object[]} videos - The videos to download
 * @param {Object} youtube - A YouTube API library
 * @return {Promise.<Object[]>} The happy uploaded videos
 */
const uploadVideosAsync = ({ videos, youtube }) => videos
  .map(video => uploadVideoAsync({ video, youtube })
    .then(() => spinner.succeed(`'${video.name}' uploaded!`))
    .catch(err => uploadErrorHandler({ video, err }))
    .then(() => {
      spinner.text = `Uploading ${--numVideosToUpload} video(s)...`
      spinner.start()
    })
    .then(() => video)
  )

/**
 * Upload a video.
 *
 * @private
 * @async
 * @param {Object} video - The video to download
 * @param {String} dest - The destination folder
 * @return {Promise.<Object>} The happy downloaded video
 */
const uploadVideoAsync = ({ video, youtube }) => {
  logger.debug(`Marking '${video.name}' as uploading`)

  return db.updateAsync({ _id: video._id }, { $set: { status: 'uploading' } })
    .then(() => youtube.videos.insert(getYoutubeInsertOptions(video)))
    .then(({ data }) => {
      logger.debug(`Marking '${video.name}' as uploaded`)
      return db.updateAsync({ _id: video._id }, { $set: { status: 'uploaded', upload: data } })
    })
}

/**
 * Upload all the videos that have the status `downloaded`.
 *
 * @public
 * @async
 * @param {Object} video - The video to download
 * @param {String} dest - The destination folder
 * @return {Promise}
 */
const worker = ({ concurrency }) => () => db.findAsync({ status: 'downloaded' })
  .then(videos => videos.filter(video => video.filename))
  .then(videos => {
    if (!videos.length) {
      logger.info('No video to upload')

      return
    }

    logger.info(`${videos.length} videos to upload`)

    let videosToUpload = videos.slice(0, concurrency)
    numVideosToUpload = videosToUpload.length

    return youtube()
      .then(youtube => {
        spinner.start()
        spinner.text = `Uploading ${numVideosToUpload} videos...`

        return Promise.all(uploadVideosAsync({ videos: videosToUpload, youtube }))
      })
      .then(videos => spinner.succeed(`${videos.length} videos uploaded!`))
      .catch(err => err)
      .then(() => worker({ concurrency, youtube })())
  })

module.exports = worker(uploadConfig)
