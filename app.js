'use strict'

const inquirer = require('inquirer')

const logger = require('./lib/logger')
const dl = require('./lib/download')
const ul = require('./lib/upload')
const vimeo = require('./lib/vimeo')
const { databaseIsEmpty, findAll, insertIfNotExists, resetDownloadingVideos } = require('./lib/database')
const { printUtil } = require('./lib/util')

logger.info('App started')

const CHOICE_PRINT_LIST = '🖨 Print the list of videos'
const CHOICE_RESET_DOWNLOADING = '🔄 Reset videos marked as \'downloading\''
const CHOICE_DOWNLOAD = '⏬ Download videos from Vimeo'
const CHOICE_UPLOAD = '⏫ Upload videos to YouTube'
const CHOICE_QUIT = '💣 Quit'

const fetchVideosIfDatabaseIsEmpty = () => databaseIsEmpty()
  .then(databaseIsEmpty => {
    if (!databaseIsEmpty) {
      logger.info('Using database values')

      return findAll()
    }

    logger.info('Database is empty, fetching all videos from Vimeo')

    return vimeo.fetchAllVideos().then(videos => Promise.all(videos.map(video => insertIfNotExists(video))))
  })

const prompt = () => inquirer.prompt({
  type: 'list',
  name: 'action',
  message: 'What do you want to do?',
  choices: [CHOICE_PRINT_LIST, CHOICE_RESET_DOWNLOADING, CHOICE_DOWNLOAD, CHOICE_UPLOAD, CHOICE_QUIT]
})
  .then(answer => {
    logger.debug('Question answered', answer)

    switch (answer.action) {
      case CHOICE_DOWNLOAD: return dl()
      case CHOICE_UPLOAD: return ul()
      case CHOICE_RESET_DOWNLOADING: return resetDownloadingVideos()
        .then(n => logger.info(`${n} video(s) reset`))
        .then(() => prompt())
      case CHOICE_PRINT_LIST: return printUtil.all().then(() => prompt())
      default:
    }
  })

const start = () => fetchVideosIfDatabaseIsEmpty().then(() => prompt())

module.exports = { start }
