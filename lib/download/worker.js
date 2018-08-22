const db = require('../database')
const logger = require('../logger')
const { spinner, downloadVideo } = require('./video')

const { downloadConfig } = require('../../config')

let numVideosToDownload

const findVideosToDownload = limit => db.findAsync({ status: 'not_downloaded' })
  .then(videos => videos.filter(video => video.download.length))
  .then(videos => videos.sort((a, b) => a.download[0].size - b.download[0].size))
  .then(videos => videos.slice(0, limit))

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
  .then(() => worker({ limit, dest })())

module.exports = worker(downloadConfig)
