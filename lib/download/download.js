const path = require('path')
const { Observable } = require('rxjs')
const dl = require('download')
const Listr = require('listr')
const pretty = require('prettysize')
const sugar = require('sugar/string').String

const { logger } = require('../logger')
const { databaseUtil, videoUtil } = require('../util')

const { downloadConfig } = require('../../config')

const downloadWorker = ({ video, dest }) => {
  const filename = `${video.name}.mp4`
  const absolutePath = path.join(dest, filename)
  const downloadOption = videoUtil.getBestDownloadOption(video)

  logger.debug(`Download object for '${video.name}'`, downloadOption)

  return {
    title: sugar.truncate(video.name, process.stdout.columns - 6),
    task: () => new Observable(observer =>
      databaseUtil.markVideoAsDowloading(video)
        .then(() => observer.next(`Downloading ${video.name}...`))
        .then(() => dl(downloadOption.link, dest, { filename })
          .on('downloadProgress', progress => observer.next(`Downloading... ${Math.round(progress.percent * 100)}% complete (${pretty(progress.transferred)}/${pretty(progress.total)})`)))
        .then(() => databaseUtil.markVideoAsDowloaded(video, absolutePath))
        .catch(err => databaseUtil.markVideoAsDowloadFailed(video).then(() => {
          const message = `An error occured while downloading the video '${video.name}': ${err.message}`
          logger.debug(message)
          observer.error(new Error(message))
        }))
        .then(() => observer.complete())
    )
  }
}

const download = ({ limit, dest }) => databaseUtil.findVideosToDownload(limit)
  .then(videos => {
    if (videos.length === 0) return []

    logger.debug(`Starting ${videos.length} downloads`)

    return new Listr(videos.map(video => downloadWorker({ video, dest })), { concurrent: true, exitOnError: false }).run()
      .catch(err => logger.warn(`${err.message}`))
      .then(() => videos)
  })
  .then(res => res.length === 0 ? null : download({ limit, dest }))

module.exports = download(downloadConfig)
