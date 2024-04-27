import morgan from "morgan";
import { addColors, createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "@Config";
import { AsyncContext, getAsyncContext } from "@Async";
import { formatUnknown } from "@Utils";

const { combine, timestamp, colorize, printf, prettyPrint } = format;
const customColorize = colorize();

const envName = config.get("env");
const localLogging = config.get("logLocally");
const logLevel = config.get("logLevel");
const localEnv = ["local"];
const isLocalEnv = localEnv.includes(envName);

const customFormat = {
  timestamp: timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  prettyPrint: prettyPrint(),
  // todo
  // eslint-disable-next-line @typescript-eslint/no-shadow
  print: printf(({ level, message, timestamp, details }) => {
    if (isLocalEnv || localLogging) {
      let formattedMessage = `${timestamp} [${envName}] [${level}] ${message}`;
      // todo
      // eslint-disable-next-line no-param-reassign
      details = formatUnknown(details);
      if (details?.stack) {
        const { stack, ...rest } = details;
        formattedMessage += `
          \rErrorMessage: ${JSON.stringify(rest, null, 2)}
          \rStackTrace: ${details.stack}}
        `;
      } else if (details !== undefined) {
        formattedMessage += ` ${JSON.stringify(details)}`;
      }

      return customColorize.colorize(level, formattedMessage);
    }

    return JSON.stringify({
      timestamp,
      envName,
      level,
      message,
      details: formatUnknown(details),
    });
  }),
};

const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  silly: 4,
};

const customColors = {
  error: "bold red",
  warn: "bold yellow",
  info: "bold cyan",
  debug: "bold green",
  silly: "italic bold magenta",
};
addColors(customColors);

// Log into files ($root/logs)
// noinspection SpellCheckingInspection
const logFileTransport =
  isLocalEnv || localLogging
    ? new DailyRotateFile({
        filename: "./logs/%DATE%.log",
        datePattern: "YYYYMMDDHH",
        maxSize: "20m",
        maxFiles: "14d",
        format: format.uncolorize(),
        level: logLevel,
      })
    : ({} as DailyRotateFile);

const consoleTransport = new transports.Console({
  level: logLevel,
});

const logger = createLogger({
  levels: customLevels,
  format: combine(
    customFormat.timestamp,
    customFormat.prettyPrint,
    customFormat.print,
  ),
  exitOnError: false,
  transports: [
    consoleTransport,
    ...(isLocalEnv || localLogging ? [logFileTransport] : []),
  ],
});

export const morganMiddleware = morgan(
  "Morgan; [:method] [:url] [:status] :: :res[content-length] characters :: :response-time ms",
  {
    stream: {
      write: (message: any) => logger.silly(message.trim()),
    },
  },
);

const formatContext = (context: AsyncContext) => {
  const input: string[] = [context.correlationId];
  if (context.spanId) {
    input.push(context.spanId);
  }
  if (context.azureTraceParent) {
    input.push(`[${context.azureTraceParent}]`);
  }
  return input.reduce((sum, val) => `${sum}${val} :: `, "");
};

const addContextIntoMessage = (message: string, details?: any) => ({
  message: `${formatContext(getAsyncContext())}${message}`,
  details: formatUnknown(details),
});

export const log = {
  error: (message: string, details?: any) =>
    logger.error(addContextIntoMessage(message, details)),
  warn: (message: string, details?: any) =>
    logger.warn(addContextIntoMessage(message, details)),
  info: (message: string, details?: any) =>
    logger.info(addContextIntoMessage(message, details)),
  debug: (message: string, details?: any) =>
    logger.debug(addContextIntoMessage(message, details)),
};
