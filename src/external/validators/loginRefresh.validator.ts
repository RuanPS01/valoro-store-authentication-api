import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ErrorsService } from '@usecases/errors/errors.service';
import { EnvironmentConfigService } from '@main/config/environment-config/environment-config.service';
import { UseCaseProxy } from '@external/dependency-injection-proxy/usecases-proxy';
import { LoggerImpl } from '@external/logger/logger.service';
import { UsecasesProxyModule } from '@external/dependency-injection-proxy/usecases-proxy.module';
import { LoginRequest } from '@usecases/v1/auth/login/interfaces/login-request';
import { LoginUseCase } from '@usecases/v1/auth/login/login.usecases';

@Injectable()
export class LoginRefreshTokenValidator extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: EnvironmentConfigService,
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCase>,
    private readonly logger: LoggerImpl,
    private readonly errorsService: ErrorsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.body?.refreshToken;
        },
      ]),
      secretOrKey: configService.getJwtRefreshSecret(),
      passReqToCallback: true,
    });
  }

  async validate(payload: LoginRequest) {
    const user = this.loginUsecaseProxy
      .getInstance()
      .getUserIfRefreshTokenMatches(payload?.refreshToken, payload.email);
    if (!user) {
      this.logger.warn(
        'LoginRefreshValidator',
        `User not found or hash not correct`,
      );
      this.errorsService.Unauthorized({
        message: 'User not found or hash not correct',
      });
    }
    return user;
  }
}
