import { createLogger, transports, format, Logger } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} => [${level}] => ${message}`;
});

const consoleTransport = new transports.Console();
const dailyRotateTransport = new DailyRotateFile({
  dirname: process.env.LOG_DIR || "/tmp/",
  filename: "%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxFiles: "14d",
  maxSize: "10m",
  format: combine(timestamp(), logFormat),
});

const logger = createLogger({
  format: combine(timestamp(), logFormat),
  transports: [consoleTransport, dailyRotateTransport],
  exceptionHandlers: [consoleTransport, dailyRotateTransport],
});

export function writeLog(level: string, message: string): void {
  try {
    logger.log({ level, message });
  } catch (error: any) {
    console.error(`Failed to log message: ${error.message}`);
  }
}
