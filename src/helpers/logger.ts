import { createLogger, format } from "winston";
const { combine, timestamp, label, printf } = format;
import DailyRotateFile from "winston-daily-rotate-file";

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const transport: DailyRotateFile = new DailyRotateFile({
  filename: "logs/%DATE%-base-app-logger.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "1g",
  maxFiles: "3d",
});

export const logger = createLogger({
  format: combine(
    label({ label: "base-app" }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    customFormat,
  ),
  transports: [transport],
});
