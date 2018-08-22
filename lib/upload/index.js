const logger = require('../logger')
const youtubeAPI = require('../youtube')
const { findVideosToUpload } = require('../database')
const { spinner, uploadVideo } = require('./uploadVideo')

const { uploadConfig } = require('../../config')

let numVideosToUpload

const updateSpinner = () => {
  spinner.text = `Uploading ${numVideosToUpload} video(s)...`
  spinner.start()
}

const uploadVideos = ({ videos, youtube }) => videos.map(video => uploadVideo({ video, youtube }).then(() => {
  numVideosToUpload--
  numVideosToUpload === 0 ? spinner.clear() : updateSpinner()
}))

const worker = ({ limit, youtubeAPI }) => () => findVideosToUpload(limit)
  .then(videos => {
    numVideosToUpload = videos.length

    if (numVideosToUpload === 0) return []

    updateSpinner()
    logger.debug(`Starting ${numVideosToUpload} uploads`)

    return youtubeAPI().then(youtube => Promise.all(uploadVideos(({ videos, youtube }))))
  })
  .then(res => res.length === 0 ? null : worker({ limit, youtubeAPI })())

module.exports = worker({ limit: uploadConfig.limit, youtubeAPI })
