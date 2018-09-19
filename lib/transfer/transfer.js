const download = require('download')
const sugar = require('sugar/string').String
const { Observable } = require('rxjs')
const Listr = require('listr')
const pretty = require('prettysize')

const { logger } = require('../logger')
const { client } = require('../youtube')
const { databaseUtil, videoUtil } = require('../util')

const { uploadConfig } = require('../../config')

const transferWorker = ({ video, youtube }) => {
  const fileMetadata = videoUtil.getBestDownloadOption(video)
  const filesize = fileMetadata.size
  const link = fileMetadata.link
  const stream = download(link)
  const options = videoUtil.getYoutubeInsertOptions({ video, body: stream })

  logger.debug(`Transfer options for '${video.name}'`, options)

  return {
    title: sugar.truncate(video.name, process.stdout.columns - 6),
    task: () => new Observable(observer =>
      databaseUtil.markVideoAsUploading(video)
        .then(() => observer.next(`Transferring ${video.name}...`))
        .then(() => youtube.videos.insert(options, {
          onUploadProgress: evt => {
            const percent = Math.round(evt.bytesRead / filesize * 100)
            const message = evt.bytesRead === filesize
              ? `Waiting for YouTube...`
              : `Transferring... ${percent}% complete (${pretty(evt.bytesRead)}/${pretty(filesize)})`

            observer.next(message)
          }
        }))
        .then(({ data }) => databaseUtil.markVideoAsUploaded(video, data))
        .catch(err => databaseUtil.markVideoAsUploadFailed(video).then(() => {
          const message = `An error occured while transferring the video '${video.name}': ${err.message}`
          logger.debug(message)
          observer.error(new Error(message))
        }))
        .then(() => observer.complete())
    )
  }
}

const transfer = ({ limit, client }) => databaseUtil.findVideosToDownload(limit)
  .then(videos => {
    if (videos.length === 0) return []

    logger.debug(`Starting ${videos.length} uploads`)

    return client().then(youtube => new Listr(videos.map(video => transferWorker({ video, youtube })), { concurrent: true, exitOnError: false }).run())
      .catch(err => logger.warn(`${err.message}`))
      .then(() => videos)
  })
  .then(res => res.length === 0 ? null : transfer({ limit, client }))

module.exports = transfer({ limit: uploadConfig.limit, client })
