// from https://github.com/winstonjs/winston/issues/1427#issuecomment-535297716
import { format as dateFormat } from "date-fns";
import path from 'path';
import { createLogger, format, transports } from "winston";
import { inspect } from "util"
import { isProduction } from "../utils";
import 'winston-daily-rotate-file'
import { getNetworkName } from "../eos/networks";

function isPrimitive(val) {
  return val === null || (typeof val !== "object" && typeof val !== "function");
}
function formatWithInspect(val) {
  const prefix = isPrimitive(val) ? "" : "\n";
  const shouldFormat = typeof val !== "string";

  return (
    prefix + (shouldFormat ? inspect(val, { depth: null, colors: true }) : val)
  );
}

const logFileDir =
  isProduction()
    ? `/storage/${process.env.npm_package_name}`
    : `logs`;

const rotateFileTransport = new (transports.DailyRotateFile)({
  filename: '%DATE%.log',
  dirname: logFileDir,
  datePattern: 'yyyy-MM-DD',
  utc: true,
  maxFiles: 14,
  level: `silly`,
});

let logFilePath = ``;
rotateFileTransport.on('new', function(newFilename) {
  logFilePath = newFilename;
  logger.info(`Logfile path: ${path.resolve(logFilePath)}`)
});
const getLogFilePath = () => `${logFileDir}${logFilePath}`

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    // format.colorize(),
    format.printf(info => {
      const msg = formatWithInspect(info.message);
      const splatArgs = info[Symbol.for("splat") as any] || [];
      const rest = splatArgs.map(data => formatWithInspect(data)).join(" ");

      return `${info.timestamp} - ${info.level}: ${msg} ${rest}`;
    })
  ),
  transports: [
    new transports.Console({
      level: isProduction() ? `info` : `silly`
    }),
    // new transports.File({
    //   filename: logFilePath,
    //   level: "silly"
    // }),
    rotateFileTransport,
  ]
});

logger.info(`is_production = ${isProduction()}, network = ${getNetworkName()}`)

export { logger, getLogFilePath };
