const inquirer = require('inquirer')

const { constants } = require('./constants')
const { logger } = require('./logger')
const { databaseUtil, printUtil, vimeoUtil } = require('./util')

logger.info(`Hello ${require('os').userInfo().username}`)

const prompt = () => inquirer.prompt({
  type: 'list',
  name: 'action',
  message: 'What do you want to do?',
  choices: [
    constants.CHOICE_DOWNLOAD,
    constants.CHOICE_UPLOAD,
    constants.CHOICE_TRANSFER,
    new inquirer.Separator(),
    constants.CHOICE_PRINT_LIST,
    constants.CHOICE_REFRESH,
    constants.CHOICE_RESET_DOWNLOADING,
    new inquirer.Separator(),
    constants.CHOICE_QUIT,
    new inquirer.Separator()
  ]
})
  .then(answer => {
    logger.debug('Question answered', answer)

    switch (answer.action) {
      case constants.CHOICE_DOWNLOAD: require('./download')
        break
      case constants.CHOICE_UPLOAD: require('./upload')
        break
      case constants.CHOICE_TRANSFER: require('./transfer')
        break
      case constants.CHOICE_RESET_DOWNLOADING: return databaseUtil.resetDownloadingVideos()
        .then(n => logger.info(`${n} video(s) reset`))
        .then(() => prompt())
      case constants.CHOICE_PRINT_LIST: return printUtil.all().then(() => prompt())
      case constants.CHOICE_REFRESH: return vimeoUtil.fetchAndInsert().then(() => prompt())
      default:
    }
  })

const start = () => vimeoUtil.fetchIfDatabaseIsEmpty().then(() => prompt())

module.exports = { start }
