import { User } from '@entities/user';
import { JwtConfigPort } from '@main/port/jwt.interface';
import { ErrorsService } from '@usecases/errors/errors.service';
import { right } from '@usecases/helpers/right';
import { BcryptServicePort } from '@usecases/port/bcrypt.interface';
import { JwtServicePort } from '@usecases/port/jwt.interface';
import { LoggerPort } from '@usecases/port/logger.interface';
import { UserRepositoryPort } from '@usecases/port/user-repository';
import { LoginRequest } from './interfaces/login-request';
import { LoginResponse } from './interfaces/login-response';
import { LoginResponseEither } from './interfaces/login-response-either';

export class LoginUseCase {
  constructor(
    private readonly logger: LoggerPort,
    private readonly jwtTokenService: JwtServicePort,
    private readonly jwtConfig: JwtConfigPort,
    private readonly userRepository: UserRepositoryPort,
    private readonly bcryptService: BcryptServicePort,
    private readonly errorsService: ErrorsService,
  ) {}

  async execute(payload: LoginRequest): Promise<LoginResponseEither> {
    const user = await this.userRepository.findOne({ email: payload.email });

    if (!user) {
      this.errorsService.Unauthorized({
        message: 'User not found.',
      });
    }

    console.log('PASSWORD -> ', this.validatePassword(user, payload.password));
    const verificationPassword = await this.validatePassword(
      user,
      payload.password,
    );
    if (!verificationPassword) {
      this.errorsService.Unauthorized({
        message: 'Incorrect password.',
      });
    }

    const token = this.jwtTokenService.createToken(
      {
        email: payload.email,
      },
      this.jwtConfig.getJwtSecret(),
      this.jwtConfig.getJwtExpirationTime(),
    );

    const refreshToken = this.jwtTokenService.createToken(
      {
        email: payload.email,
      },
      this.jwtConfig.getJwtRefreshSecret(),
      this.jwtConfig.getJwtRefreshExpirationTime(),
    );
    const currentHashedRefreshToken = await this.bcryptService.hash(
      refreshToken,
    );

    await this.userRepository.updateRefreshToken(
      payload.email,
      currentHashedRefreshToken,
    );

    await this.userRepository.updateLastLogin(user.email);

    const response: LoginResponse = {
      user: {
        id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt,
        verified: user.verified,
      },
      accessToken: token,
      refreshToken: refreshToken,
    };

    this.logger.info(
      'LoginUseCase execute',
      `The user ${payload.email} have been logged.`,
    );
    return right(response);
  }

  async validateIfUserExists(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      return null;
    }
    return user;
  }

  async validatePassword(user: User, password: string) {
    const match = await this.bcryptService.compare(password, user.password);
    if (user && match) {
      await this.userRepository.updateLastLogin(user.email);
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, email: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      return null;
    }

    const isRefreshTokenMatching = await this.bcryptService.compare(
      refreshToken,
      user.refreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }
}
