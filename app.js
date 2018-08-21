'use strict'

const inquirer = require('inquirer')

const logger = require('./lib/logger')
const dl = require('./lib/download')
const ul = require('./lib/upload')
const util = require('./lib/util')

logger.info('App started')

const CHOICE_PRINT_LIST = '🖨 Print the list of videos'
const CHOICE_DOWNLOAD = '⏬ Download videos from Vimeo'
const CHOICE_UPLOAD = '⏫ Upload videos to YouTube'
const CHOICE_RESET_DOWNLOADING = '🔄 Reset videos marked as \'downloading\''
const CHOICE_QUIT = '💣 Quit'

const start = () =>
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What do you want to do?',
    choices: [CHOICE_PRINT_LIST, CHOICE_RESET_DOWNLOADING, CHOICE_DOWNLOAD, CHOICE_UPLOAD, CHOICE_QUIT]
  })
    .then(answer => {
      logger.debug('Question answered', answer)

      switch (answer.action) {
        case CHOICE_DOWNLOAD: return util.fetchVideosIfDatabaseIsEmpty().then(() => dl())
        case CHOICE_UPLOAD: return ul()
        case CHOICE_RESET_DOWNLOADING: return util.resetDownloadingVideos()
          .then(n => logger.info(`${n} videos reset`))
          .then(() => start())
        case CHOICE_PRINT_LIST: return util.fetchVideosIfDatabaseIsEmpty().then(videos => util.printVideosList(videos)).then(() => start())
        default:
      }
    })

module.exports = { start }
