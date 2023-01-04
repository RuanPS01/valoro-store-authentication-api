import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { LoggerImpl } from '@external/logger/logger.service';
import { ErrorsService } from '@usecases/errors/errors.service';
import { UseCaseProxy } from '@external/dependency-injection-proxy/usecases-proxy';
import { LoginUseCase } from '@usecases/v1/auth/login/login.usecases';
import { UsecasesProxyModule } from '@external/dependency-injection-proxy/usecases-proxy.module';
import { LoginRequest } from '@usecases/v1/auth/login/interfaces/login-request';

@Injectable()
export class LoginValidator extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCase>,
    private readonly logger: LoggerImpl,
    private readonly errorsService: ErrorsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: process.env.AUTH_SECRET,
    });
  }

  async validate(payload: LoginRequest) {
    let user = this.loginUsecaseProxy
      .getInstance()
      .validateIfUserExists(payload.email);
    if (!user) {
      this.logger.warn('LoginValidator', `User not found`);
      this.errorsService.Unauthorized({
        message: 'User not found',
      });
    }
    user = undefined;
    user = this.loginUsecaseProxy
      .getInstance()
      .validatePassword(payload.email, payload.password);
    if (!user) {
      this.logger.warn('LoginValidator', `Invalid username or password`);
      this.errorsService.Unauthorized({
        message: 'Invalid username or password.',
      });
    }
    return user;
  }
}
