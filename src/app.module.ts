import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { BcryptModule } from '@external/services/bcrypt/bcrypt.module';
import { JwtModule } from '@external/services/jwt/jwt.module';
import { UsecasesProxyModule } from '@external/dependency-injection-proxy/usecases-proxy.module';
import { ErrorsModule } from '@usecases/errors/errors.module';
import { LoggerModule } from '@external/logger/logger.module';
import { EnvironmentConfigModule } from '@main/config/environment-config/environment-config.module';
import { ControllersModule } from './adapter/controllers/v1/auth/controllers.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/Valoro`,
      }),
    }),
    PassportModule,
    Jwt.register({
      secret: process.env.AUTH_SECRET,
    }),
    UsecasesProxyModule.register(),
    LoggerModule,
    ErrorsModule,
    ControllersModule,
    BcryptModule,
    JwtModule,
    EnvironmentConfigModule,
  ],
  providers: [],
})
export class AppModule {}
