"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston = require("winston");
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};
const format = winston.format.combine(winston.format.timestamp({ format: 'YY-MM-DD HH:mm:ss:ms' }), winston.format.printf((info) => `${info.timestamp} ${info.level} : ${info.message}`));
const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/all.log' }),
];
exports.logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});
//# sourceMappingURL=Logging.js.map