const colors = require('colors')
const pretty = require('prettysize')
const { table } = require('table')

const logger = require('../logger')
const { findAll } = require('../database')

const { getBestDownloadOption } = require('./video')

const printVideos = videos => {
  const data = [ ['Name', 'Status'] ]

  videos.forEach(video => {
    const name = video.name.replace(/[\u0001-\u001A]/g, '')

    let status = video.status

    switch (true) {
      case status.includes('failed'): status = colors.red(status)
        break
      case status.includes('not'):
        break
      case status.includes('ing'): status = colors.yellow(status)
        break
      case status.includes('ed'): status = colors.green(status)
        break
    }

    data.push([name, status])
  })

  console.log(table(data))

  const size = videos
    .filter(video => video.download.length)
    .reduce((acc, curr) => acc + getBestDownloadOption(curr).size, 0)

  logger.info(`Total size: ${pretty(size)}`)
}

module.exports.all = () => findAll().then(videos => printVideos(videos))
