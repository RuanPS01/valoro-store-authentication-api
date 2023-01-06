import { JwtConfigPort } from '@main/port/jwt.interface';
import { ErrorsService } from '@usecases/errors/errors.service';
import { right } from '@usecases/helpers/right';
import { JwtServicePort } from '@usecases/port/jwt.interface';
import { LoggerPort } from '@usecases/port/logger.interface';
import { UserRepositoryPort } from '@usecases/port/user-repository';
import { AuthenticateRequest } from './interfaces/authenticate-request';
import { AuthenticateResponseEither } from './interfaces/authenticate-response-either';
import { DecodedToken } from './interfaces/decoded-token';

export class AuthenticateUseCase {
  constructor(
    private readonly logger: LoggerPort,
    private readonly jwtTokenService: JwtServicePort,
    private readonly jwtConfig: JwtConfigPort,
    private readonly userRepository: UserRepositoryPort,
    private readonly errorsService: ErrorsService,
  ) {}

  async execute(
    payload: AuthenticateRequest,
  ): Promise<AuthenticateResponseEither> {
    const validate: DecodedToken =
      await this.jwtTokenService.verifyTokenAndDecode(
        payload.token,
        this.jwtConfig.getJwtSecret(),
      );

    if (!validate) {
      this.errorsService.Unauthorized({
        message: 'Token verify error. The token is probably not valid.',
      });
    }

    const user = await this.userRepository.findOne({ email: validate.email });

    if (!user) {
      this.errorsService.Unauthorized({
        message: 'User not found.',
      });
    }

    this.logger.info(
      'AuthenticateUseCase execute',
      `The user have been authenticated.`,
    );
    return right({ authenticated: true });
  }
}
