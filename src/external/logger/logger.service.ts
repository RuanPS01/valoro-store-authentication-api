import { Injectable, Logger } from '@nestjs/common';
import { LoggerPort } from '@usecases/port/logger.interface';

@Injectable()
export class LoggerImpl extends Logger implements LoggerPort {
  info(context: string, message: string) {
    super.log(`[ INFO ] -> ${message}`, context);
  }
  error(context: string, message: string, trace?: string) {
    super.error(`[ ERROR ] -> ${message}`, trace, context);
  }
  warn(context: string, message: string) {
    super.warn(`[ WARN ] -> ${message}`, context);
  }
}
