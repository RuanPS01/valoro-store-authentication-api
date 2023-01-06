import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { JwtModule } from '../services/jwt/jwt.module';
import { UseCaseProxy } from './usecases-proxy';
import { UserRepositoryModule } from '@external/orm/repositories/user.repository.module';
import { UserRepositoryImpl } from '@external/orm/repositories/user.repository';
import { EnvironmentConfigModule } from '@main/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@main/config/environment-config/environment-config.service';
import { JwtTokenServiceImpl } from '@external/services/jwt/jwt.service';
import { BcryptServiceImpl } from '@external/services/bcrypt/bcrypt.service';
import { LoggerImpl } from '@external/logger/logger.service';
import { ErrorsModule } from '@usecases/errors/errors.module';
import { LoginUseCase } from '@usecases/v1/auth/login/login.usecase';
import { ErrorsService } from '@usecases/errors/errors.service';
import { RegisterUseCase } from '@usecases/v1/auth/register/register.usecase';
import { AuthenticateUseCase } from '@usecases/v1/auth/anthenticate/authenticate.usecase';

@Module({
  imports: [
    LoggerModule,
    JwtModule,
    EnvironmentConfigModule,
    UserRepositoryModule,
    BcryptModule,
    ErrorsModule,
  ],
})
export class UsecasesProxyModule {
  // Auth
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static REGISTER_USECASES_PROXY = 'RegisterUseCasesProxy';
  static AUTHENTICATE_USECASES_PROXY = 'AuthenticateUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [
            LoggerImpl,
            JwtTokenServiceImpl,
            EnvironmentConfigService,
            UserRepositoryImpl,
            BcryptServiceImpl,
            ErrorsService,
          ],
          provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerImpl,
            jwtTokenService: JwtTokenServiceImpl,
            config: EnvironmentConfigService,
            userRepo: UserRepositoryImpl,
            bcryptService: BcryptServiceImpl,
            errorsService: ErrorsService,
          ) =>
            new UseCaseProxy(
              new LoginUseCase(
                logger,
                jwtTokenService,
                config,
                userRepo,
                bcryptService,
                errorsService,
              ),
            ),
        },
        {
          inject: [
            LoggerImpl,
            UserRepositoryImpl,
            BcryptServiceImpl,
            ErrorsService,
          ],
          provide: UsecasesProxyModule.REGISTER_USECASES_PROXY,
          useFactory: (
            logger: LoggerImpl,
            userRepo: UserRepositoryImpl,
            bcryptService: BcryptServiceImpl,
            errorsService: ErrorsService,
          ) =>
            new UseCaseProxy(
              new RegisterUseCase(
                logger,
                userRepo,
                bcryptService,
                errorsService,
              ),
            ),
        },
        {
          inject: [
            LoggerImpl,
            JwtTokenServiceImpl,
            EnvironmentConfigService,
            UserRepositoryImpl,
            ErrorsService,
          ],
          provide: UsecasesProxyModule.AUTHENTICATE_USECASES_PROXY,
          useFactory: (
            logger: LoggerImpl,
            jwtTokenService: JwtTokenServiceImpl,
            config: EnvironmentConfigService,
            userRepo: UserRepositoryImpl,
            errorsService: ErrorsService,
          ) =>
            new UseCaseProxy(
              new AuthenticateUseCase(
                logger,
                jwtTokenService,
                config,
                userRepo,
                errorsService,
              ),
            ),
        },
      ],
      exports: [
        UsecasesProxyModule.LOGIN_USECASES_PROXY,
        UsecasesProxyModule.REGISTER_USECASES_PROXY,
        UsecasesProxyModule.AUTHENTICATE_USECASES_PROXY,
      ],
    };
  }
}
