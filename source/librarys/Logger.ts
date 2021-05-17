import { basename, extname, resolve } from 'path';
import { Logger as winstonLogger, createLogger, format, transports } from 'winston';

export default class Logger {
  name: string;

  private logger: winstonLogger;

  constructor(name: string = 'Bot') {
    this.name = basename(name, extname(name));
    this.logger = createLogger({
      format: format.combine(
        format.simple(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.label({
          label: this.name,
        }),
        format.printf(
          ({ level, label, message, timestamp }) => `[${label}] ${timestamp} ${level}: ${message}`,
        ),
      ),
      transports: [
        new transports.Console({
          level: process.env.NODE_ENV === 'development' ? 'verbose' : 'info',
        }),
        new transports.File({
          filename: resolve('logs', `${this.name}.log`),
        }),
      ],
      exitOnError: false,
    });
  }

  public log(msg: any): void {
    this.logger.info(msg);
  }

  public info(msg: any): void {
    this.logger.info(msg);
  }

  public verbose(msg: any): void {
    this.logger.verbose(msg);
  }

  public debug(msg: any): void {
    this.logger.debug(msg);
  }

  public warn(msg: any): void {
    this.logger.warn(msg);
  }

  public error(msg: any): void {
    this.logger.error(msg);
  }
}
