/**
 * Логер для печати в файл
*/

import winston from "winston"

const errorLogFilePath = "logs/error.log"
const appLogFilePath = "logs/app.log"

const Logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: errorLogFilePath, level: "warn" }),
    new winston.transports.File({ filename: appLogFilePath }),
  ],
});

export default Logger