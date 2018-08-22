'use strict'

const inquirer = require('inquirer')

const logger = require('./lib/logger')
const dl = require('./lib/download')
const ul = require('./lib/upload')
const { fetchAndInsert, fetchIfDatabaseIsEmpty } = require('./lib/vimeo')
const { resetDownloadingVideos } = require('./lib/database')
const { printUtil } = require('./lib/util')

logger.info('App started')

const CHOICE_DOWNLOAD = '⇓ Download videos from Vimeo'
const CHOICE_UPLOAD = '⇑ Upload videos to YouTube'
const CHOICE_PRINT_LIST = '⎙ Print the list of videos'
const CHOICE_REFRESH = '⇣ Refresh the list of videos from Vimeo'
const CHOICE_RESET_DOWNLOADING = '⟳ Reset videos marked as \'downloading\''
const CHOICE_QUIT = '☠ Quit'

const prompt = () => inquirer.prompt({
  type: 'list',
  name: 'action',
  message: 'What do you want to do?',
  choices: [
    CHOICE_DOWNLOAD,
    CHOICE_UPLOAD,
    new inquirer.Separator(),
    CHOICE_PRINT_LIST,
    CHOICE_REFRESH,
    CHOICE_RESET_DOWNLOADING,
    new inquirer.Separator(),
    CHOICE_QUIT,
    new inquirer.Separator()
  ]
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
      case CHOICE_REFRESH: return fetchAndInsert().then(() => prompt())
      default:
    }
  })

const start = () => fetchIfDatabaseIsEmpty().then(() => prompt())

module.exports = { start }
