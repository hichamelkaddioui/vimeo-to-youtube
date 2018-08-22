const download = require('download')
const path = require('path')
const spinner = (require('ora'))()

const db = require('../database')
const logger = require('../logger')
const { getBestDownloadOption } = require('../util')

const markVideoAsDowloading = ({ video }) => db.updateAsync({ _id: video._id }, { $set: { status: 'downloading' } })
  .then(() => logger.debug(`Marked '${video.name}' as downloading`))

const markVideoAsDowloadFailed = ({ video }) => db.updateAsync({ _id: video._id }, { $set: { status: 'download_failed' } })
  .then(() => logger.debug(`Marked '${video.name}' as downloaded_failed`))

const markVideoAsDowloaded = ({ video, path }) => db.updateAsync({ _id: video._id }, { $set: { status: 'downloaded', path } })
  .then(() => logger.debug(`Marked '${video.name}' as downloaded at ${path}`))

const handleDownloadError = ({ video, err }) => markVideoAsDowloadFailed({ video })
  .then(() => {
    spinner.fail(`An error occured while downloading the video '${video.name}'`)
    spinner.fail(`Error: ${err.message}`)
    logger.debug(`Error while downloading ${video.name}`, err)
  })

const downloadVideo = ({ video, dest }) => {
  const filename = `${video.name}.mp4`
  const absolutePath = path.join(dest, filename)
  const downloadOption = getBestDownloadOption(video)

  logger.debug(`Download object for '${video.name}'`, downloadOption)

  return markVideoAsDowloading({ video })
    .then(() => download(downloadOption.link, dest, { filename }))
    .then(() => markVideoAsDowloaded({ video, path: absolutePath }))
    .then(() => spinner.succeed(`'${video.name}' downloaded!`))
    .catch(err => handleDownloadError({ err, video }))
}

module.exports = { spinner, downloadVideo }
