const logger = require('../logger')
const { findVideosToDownload } = require('../database')
const { spinner, downloadVideo } = require('./downloadVideo')

const { downloadConfig } = require('../../config')

let numVideosToDownload

const updateSpinner = () => {
  spinner.text = `Downloading ${numVideosToDownload} video(s)...`
  spinner.start()
}

const downloadVideos = ({ videos, dest }) => videos.map(video => downloadVideo({ video, dest }).then(() => {
  numVideosToDownload--
  numVideosToDownload === 0 ? spinner.clear() : updateSpinner()
}))

const worker = ({ limit, dest }) => () => findVideosToDownload(limit)
  .then(videos => {
    numVideosToDownload = videos.length

    if (numVideosToDownload === 0) return

    updateSpinner()
    logger.debug(`Starting ${numVideosToDownload} downloads`)

    return Promise.all(downloadVideos(({ videos, dest })))
  })
  .then(res => res.length === 0 ? null : worker({ limit, dest })())

module.exports = worker(downloadConfig)
