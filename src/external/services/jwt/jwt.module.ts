import { Module } from '@nestjs/common';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { JwtTokenServiceImpl } from './jwt.service';

@Module({
  imports: [
    Jwt.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [JwtTokenServiceImpl],
  exports: [JwtTokenServiceImpl],
})
export class JwtModule {}
