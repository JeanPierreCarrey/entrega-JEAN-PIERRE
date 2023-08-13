const winston = require('winston');
require('dotenv').config();

const developmentLogger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

developmentLogger.fatal = developmentLogger.error;

const productionLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'errors.log', level: 'error' })
    ]
});

productionLogger.fatal = productionLogger.error;

module.exports = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;