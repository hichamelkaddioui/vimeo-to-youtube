const colors = require('colors')
const pretty = require('prettysize')
const sugar = require('sugar/string').String
const { table } = require('table')

const logger = require('../logger')
const { findAll } = require('../database')

const { getBestDownloadOption } = require('./video')

const printVideos = videos => {
  const data = [ ['Name', 'Status', 'Size'] ]

  let totalSize = 0

  videos.forEach(video => {
    const name = sugar.truncate(video.name.replace(/[\u0001-\u001A]/g, ''), process.stdout.columns - 36)
    const size = getBestDownloadOption(video).size

    totalSize += size

    let status = sugar.titleize(video.status)

    switch (true) {
      case status.includes('failed'): status = colors.red(status)
        break
      case status.includes('Not'):
        break
      case status.includes('ing'): status = colors.yellow(status)
        break
      case status.includes('ed'): status = colors.green(status)
        break
    }

    data.push([name, status, pretty(size)])
  })

  console.log(table(data))

  logger.info(`Total size: ${pretty(totalSize)}`)
}

module.exports.all = () => findAll().then(videos => printVideos(videos))
