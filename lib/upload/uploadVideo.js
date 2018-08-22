const spinner = (require('ora'))()

const logger = require('../logger')
const { markVideoAsUploadFailed, markVideoAsUploading, markVideoAsUploaded } = require('../database')
const { videoUtil } = require('../util')

const handleUploadError = ({ video, err }) => markVideoAsUploadFailed(video)
  .then(() => {
    spinner.fail(`An error occured while uploading the video '${video.name}'. Error: ${err.message}`)
    logger.debug(`Error while uploading ${video.name}`, err.message)
  })

const uploadVideo = ({ video, youtube }) => {
  const options = videoUtil.getYoutubeInsertOptions(video)

  logger.debug(`Upload options for '${video.name}'`, options)

  return markVideoAsUploading(video)
    .then(() => youtube.videos.insert(options))
    .then(({ data }) => markVideoAsUploaded(video, data))
    .then(() => spinner.succeed(`'${video.name}' uploaded!`))
    .catch(err => handleUploadError({ video, err }))
}

module.exports = { spinner, uploadVideo }
