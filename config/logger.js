const path = require('path')
const winston = require('winston')

module.exports = {
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.resolve(__dirname, '../error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.resolve(__dirname, '../combined.log') }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
}
