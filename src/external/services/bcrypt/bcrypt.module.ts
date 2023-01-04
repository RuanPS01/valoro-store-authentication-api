import { Module } from '@nestjs/common';
import { BcryptServiceImpl } from './bcrypt.service';

@Module({
  providers: [BcryptServiceImpl],
  exports: [BcryptServiceImpl],
})
export class BcryptModule {}
