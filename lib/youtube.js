const fs = require('fs-extra')
const inquirer = require('inquirer')
const colors = require('colors')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

const logger = require('./logger')
const { youtubeConfig } = require('../config')

/**
 * @private
 * @async
 * @param {String} path - The path of the file in which to store the access token
 * @param {Object} token - The access token
 * @return {Promise.<Object>} The access token
 */
const writeToken = (path, token) => fs.ensureFile(path)
  .then(() => fs.writeJSON(path, token))
  .then(() => token)

/**
 * @private
 * @async
 * @param {Object.tokenPath} - The path of the file in which to store the access token
 * @param {Object.oauth2Client} - Google's OAuth2 client
 * @return {Promise.<Object>} An access token
 */
const askForToken = ({ tokenPath, oauth2Client }) =>
  Promise.resolve(oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.upload']
  }))
    .then(url => {
      logger.warn(`No access token found at ${tokenPath}`)
      logger.info(`It's normal if it's the first time you use the upload feature. Please visit ${colors.blue(url)} and paste the displayed code below.`)
    })
    .then(() => inquirer.prompt({
      type: 'input',
      name: 'code',
      message: `Code:`
    }))
    .then(({ code }) => oauth2Client.getToken(code))
    .then(({ tokens }) => {
      logger.debug('YouTube access token retrieved', tokens)

      return writeToken(tokenPath, tokens)
    })

/**
 * Reads the access token at `tokenPath` or asks the user for it.
 *
 * @async
 * @param {Object.tokenPath} - The path of the file in which to store the access token
 * @param {Object.oauth2Client} - Google's OAuth2 client
 * @return {Promise.<Object>} An access token
 */
const getLocalTokenOrAsk = ({ tokenPath, oauth2Client }) => fs.pathExists(tokenPath)
  .then(exists => {
    if (exists) {
      logger.debug('YouTube access token file already exists')

      return fs.readJson(tokenPath)
    }

    logger.debug('YouTube access token file doesn\'t exist')

    return askForToken({ tokenPath, oauth2Client })
  })

/**
 * Creates an oauth2Client from a configuration.
 *
 * @public
 * @async
 * @param {Object} config - The configuration object
 * @return {Promise.<Object>} A YouTube API library
 */
const youtube = config => () => {
  const clientSecret = config.installed.clientSecret
  const clientId = config.installed.clientId
  const redirectUrl = config.installed.redirectUris[0]
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)
  const tokenPath = config.tokenPath

  return getLocalTokenOrAsk({ tokenPath, oauth2Client })
    .then(token => {
      oauth2Client.credentials = token

      return oauth2Client
    })
    .then(client => google.youtube({
      version: 'v3',
      auth: client
    }))
}

module.exports = youtube(youtubeConfig)
