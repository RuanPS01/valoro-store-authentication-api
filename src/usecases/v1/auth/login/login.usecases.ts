import { JwtConfigPort } from '@main/port/jwt.interface';
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
  ) {}

  async execute(payload: LoginRequest): Promise<LoginResponseEither> {
    this.logger.info(
      'LoginUseCase execute',
      `The user ${payload.email} have been logged.`,
    );
    const token = this.jwtTokenService.createToken(
      payload,
      this.jwtConfig.getJwtSecret(),
      this.jwtConfig.getJwtExpirationTime(),
    );

    const refreshToken = this.jwtTokenService.createToken(
      payload,
      this.jwtConfig.getJwtSecret(),
      this.jwtConfig.getJwtExpirationTime(),
    );
    const currentHashedRefreshToken = await this.bcryptService.hash(
      refreshToken,
    );

    await this.userRepository.updateRefreshToken(
      payload.email,
      currentHashedRefreshToken,
    );

    const user = await this.userRepository.findOne({ email: payload.email });
    const response: LoginResponse = {
      user,
      accessToken: token,
      refreshToken: refreshToken,
    };
    return right(response);
  }

  async validateIfUserExists(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      return null;
    }
    return user;
  }

  async validatePassword(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      return null;
    }
    const match = await this.bcryptService.compare(password, user.password);
    if (user && match) {
      await this.userRepository.updateLastLogin(email);
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
