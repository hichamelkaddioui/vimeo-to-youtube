const path = require('path')
const { Observable } = require('rxjs')
const download = require('download')
const Listr = require('listr')
const pretty = require('prettysize')
const sugar = require('sugar/string').String

const logger = require('../logger')
const { findVideosToDownload } = require('../database')
const { markVideoAsDowloadFailed, markVideoAsDowloading, markVideoAsDowloaded } = require('../database')
const { videoUtil } = require('../util')

const { downloadConfig } = require('../../config')

const downloadVideo = ({ video, dest }) => {
  const filename = `${video.name}.mp4`
  const absolutePath = path.join(dest, filename)
  const downloadOption = videoUtil.getBestDownloadOption(video)

  logger.debug(`Download object for '${video.name}'`, downloadOption)

  return {
    title: sugar.truncate(video.name, process.stdout.columns - 6),
    task: () => new Observable(observer =>
      markVideoAsDowloading(video)
        .then(() => observer.next(`Downloading ${video.name}...`))
        .then(() => download(downloadOption.link, dest, { filename })
          .on('downloadProgress', progress => observer.next(`Downloading... ${Math.round(progress.percent * 100)}% complete (${pretty(progress.transferred)}/${pretty(progress.total)})`)))
        .then(() => markVideoAsDowloaded(video, absolutePath))
        .catch(err => markVideoAsDowloadFailed(video).then(() => {
          observer.error(new Error(`An error occured while downloading the video '${video.name}': ${err.message}`))
        }))
        .then(() => observer.complete())
    )
  }
}

const worker = ({ limit, dest }) => () => findVideosToDownload(limit)
  .then(videos => {
    if (videos.length === 0) return []

    logger.debug(`Starting ${videos.length} downloads`)

    return new Listr(videos.map(video => downloadVideo({ video, dest })), { concurrent: true, exitOnError: false }).run()
      .catch(err => logger.warn(`${err.message}`))
      .then(() => videos)
  })
  .then(res => res.length === 0 ? null : worker({ limit, dest })())

module.exports = worker(downloadConfig)
