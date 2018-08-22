const download = require('download')
const path = require('path')
const spinner = (require('ora'))()

const logger = require('../logger')
const { markVideoAsDowloadFailed, markVideoAsDowloading, markVideoAsDowloaded } = require('../database')
const { videoUtil } = require('../util')

const handleDownloadError = ({ video, err }) => markVideoAsDowloadFailed(video)
  .then(() => {
    spinner.fail(`An error occured while downloading the video '${video.name}': ${err.message}`)
    logger.debug(`Error while downloading ${video.name}`, err)
  })

const downloadVideo = ({ video, dest }) => {
  const filename = `${video.name}.mp4`
  const absolutePath = path.join(dest, filename)
  const downloadOption = videoUtil.getBestDownloadOption(video)

  logger.debug(`Download object for '${video.name}'`, downloadOption)

  return markVideoAsDowloading(video)
    .then(() => download(downloadOption.link, dest, { filename }))
    .then(() => markVideoAsDowloaded(video, absolutePath))
    .then(() => spinner.succeed(`'${video.name}' downloaded!`))
    .catch(err => handleDownloadError({ video, err }))
}

module.exports = { spinner, downloadVideo }
