import fs from 'fs';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import safeJsonStringify from 'safe-json-stringify';

const logDir = 'debuglogs';

// Check log directory exists
if(!fs.existsSync(logDir)){
    fs.mkdirSync(logDir);
    fs.chmodSync(logDir, 0o777);
}

const logLevel = "debug";
const logLevels = {
    error : 0,
    warn : 1,
    info : 2,
    http : 3,
    verbose : 4,
    debug : 5,
    silly : 6,
};

const logger = winston.createLogger({
    level : logLevel,
    levels : logLevels,
    format : winston.format.combine(
        winston.format.timestamp({format : "DD-MM-YYYY hh:mm:ss A"}),
        winston.format.json(),
        winston.format.printf((info) => {
            const {timestamp, level, message, ...args} = info;
            return `${timestamp} ${level} ${message} ${Object.keys(args).length ? safeJsonStringify(args, null, 2) : ""}`;
        })
    ),
    transports : [
        new DailyRotateFile({
            filename : `${logDir}/api/%DATE%.log`,
            datePattern : "DDMMYYYY",
            handleExceptions : true,
            json : true,
        }),
    ],
    exceptionHandlers : [
        new DailyRotateFile({
            filename : `${logDir}/exceptions/%DATE%.log`,
            datePattern : "DDMMYYYY",
            handleExceptions:true,
            json : true,
        }),
    ],
    exitOnError : true,
});

if(process.env.NODE_ENV !== "prod") {
    logger.add(
        new winston.transports.Console({
            format : winston.format.combine(
                winston.format.timestamp({format : "DD-MM-YYYY hh:mm:ss A"}),
                winston.format.json(),
                winston.format.prettyPrint(),
                winston.format.printf((info) => {
                    const {timestamp, level, message, ...args} = info;
                    return `${timestamp} ${level} ${message} ${Object.keys(args).length ? safeJsonStringify(args, null, 2) : ""}`;
                })
            ),
        })
    );
}

export default logger;
