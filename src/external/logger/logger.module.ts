import { Module } from '@nestjs/common';
import { LoggerImpl } from './logger.service';

@Module({
  providers: [LoggerImpl],
  exports: [LoggerImpl],
})
export class LoggerModule {}
