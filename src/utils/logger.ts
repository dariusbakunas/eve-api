import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.NODE_ENV === 'development' ? winston.format.simple() : winston.format.json(),
  defaultMeta: { service: 'eve-api' },
  transports: [new winston.transports.Console()],
});

export default logger;
