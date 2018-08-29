const { db } = require('../database')
const { logger } = require('../logger')
const { constants } = require('../constants')


// Test

exports.databaseIsEmpty = () => db.countAsync({}).then(numEntries => numEntries === 0)

// Find

exports.findAll = () => db.findAsync({})

exports.findVideosToDownload = limit => db.findAsync({ status: STATUS_NOT_DOWNLOADED })
exports.findVideosToDownload = limit => db.findAsync({ status: constants.STATUS_NOT_DOWNLOADED })
  .then(videos => videos.filter(video => video.download.length))
  .then(videos => videos.sort((a, b) => a.download[0].size - b.download[0].size))
  .then(videos => videos.slice(0, limit))

exports.findVideosToUpload = limit => db.findAsync({ status: constants.STATUS_DOWNLOADED })
  .then(videos => videos.filter(video => video.path))
  .then(videos => videos.sort((a, b) => a.download[0].size - b.download[0].size))
  .then(videos => videos.slice(0, limit))

// Write

exports.insertIfNotExists = video => db.findAsync({ 'resource_key': video.resource_key })
  .then(results => results[0])
  .then(result => {
    if (result) {
      logger.debug(`A video with resource_key '${video.resource_key}' already exists, not inserting`)

      return result
    }

    logger.debug(`No video with resource_key '${video.resource_key}' found, inserting`)

    video.status = STATUS_NOT_DOWNLOADED

    return db.insertAsync(video)
  })

// Reset

exports.resetDownloadingVideos = () => db.updateAsync({ status: constants.STATUS_DOWNLOADING }, { $set: { status: constants.STATUS_NOT_DOWNLOADED } }, { multi: true })

// Mark

exports.markVideoAsDowloading = video => db.updateAsync({ _id: video._id }, { $set: { status: constants.STATUS_DOWNLOADING } })
  .then(() => logger.debug(`Marked '${video.name}' as downloading`))

exports.markVideoAsDowloadFailed = video => db.updateAsync({ _id: video._id }, { $set: { status: constants.STATUS_DOWNLOAD_FAILED } })
  .then(() => logger.debug(`Marked '${video.name}' as downloaded_failed`))

exports.markVideoAsDowloaded = (video, path) => db.updateAsync({ _id: video._id }, { $set: { status: constants.STATUS_DOWNLOADED, path } })
  .then(() => logger.debug(`Marked '${video.name}' as downloaded at ${path}`))

exports.markVideoAsUploading = video => db.updateAsync({ _id: video._id }, { $set: { status: constants.STATUS_UPLOADING } })
  .then(() => logger.debug(`Marked '${video.name}' as uploading`))

exports.markVideoAsUploadFailed = video => db.updateAsync({ _id: video._id }, { $set: { status: constants.STATUS_UPLOAD_FAILED } })
  .then(() => logger.debug(`Marked '${video.name}' as upload failed`))

exports.markVideoAsUploaded = (video, upload) => db.updateAsync({ _id: video._id }, { $set: { status: constants.STATUS_UPLOADED, upload } })
  .then(() => logger.debug(`Marked '${video.name}' as uploaded`, upload))
