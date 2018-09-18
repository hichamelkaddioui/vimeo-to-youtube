const { db } = require('../database')
const { logger } = require('../logger')
const { constants } = require('../constants')

// Test

exports.databaseIsEmpty = () => db.countAsync({}).then(numEntries => numEntries === 0)

// Find

exports.findAll = () => db.findAsync({})

exports.findVideosToDownload = limit => db.findAsync({ status: constants.STATUS_NOT_DOWNLOADED })
  .then(videos => videos.filter(video => video.download.length))
  .then(videos => limit ? videos.slice(0, limit) : videos)

exports.findVideosToUpload = limit => db.findAsync({ status: constants.STATUS_DOWNLOADED })
  .then(videos => videos.filter(video => video.path))
  .then(videos => limit ? videos.slice(0, limit) : videos)

// Write

exports.upsert = video => db.countAsync({ 'resource_key': video.resource_key })
  .then(count => count === 0 ? Object.assign(video, { status: constants.STATUS_NOT_DOWNLOADED }) : video)
  .then(videoToUpsert => db.updateAsync({ 'resource_key': video.resource_key }, { $set: videoToUpsert }, { upsert: true }))

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
