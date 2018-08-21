'use strict'

const inquirer = require('inquirer')

const logger = require('./lib/logger')
const dl = require('./lib/download')
const ul = require('./lib/upload')
const util = require('./lib/util')

logger.info('Starting app')

const CHOICE_PRINT_LIST = '🖨 Print the list of videos'
const CHOICE_DOWNLOAD = '⏬ Download videos from Vimeo'
const CHOICE_UPLOAD = '⏫ Upload videos to YouTube'

const start = () =>
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What do you want to do?',
    choices: [CHOICE_PRINT_LIST, CHOICE_DOWNLOAD, CHOICE_UPLOAD]
  })
    .then(answer => {
      logger.debug('Question answered', answer)

      switch (answer.action) {
        case CHOICE_DOWNLOAD:
          return util.fetchVideosIfDatabaseIsEmpty().then(() => dl())
        case CHOICE_PRINT_LIST:
          break
        case CHOICE_UPLOAD:
        default:
          return ul()
      }
    })

module.exports = { start }
