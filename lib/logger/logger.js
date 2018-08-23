const winston = require('winston')
const { loggerConfig } = require('../../config')

const logger = winston.createLogger(loggerConfig)

module.exports = { logger }
