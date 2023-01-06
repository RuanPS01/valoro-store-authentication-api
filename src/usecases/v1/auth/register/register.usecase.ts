import { ErrorsService } from '@usecases/errors/errors.service';
import { codeGenerator } from '@usecases/helpers/code-generator';
import { right } from '@usecases/helpers/right';
import { BcryptServicePort } from '@usecases/port/bcrypt.interface';
import { LoggerPort } from '@usecases/port/logger.interface';
import { UserRepositoryPort } from '@usecases/port/user-repository';
import { RegisterRequest } from './interfaces/register-request';
import { RegisterResponse } from './interfaces/register-response';
import { RegisterResponseEither } from './interfaces/register-response-either';

export class RegisterUseCase {
  constructor(
    private readonly logger: LoggerPort,
    private readonly userRepository: UserRepositoryPort,
    private readonly bcryptService: BcryptServicePort,
    private readonly errorsService: ErrorsService,
  ) {}

  async execute(payload: RegisterRequest): Promise<RegisterResponseEither> {
    const user = await this.userRepository.findOne({ email: payload.email });

    if (user) {
      this.errorsService.Unauthorized({
        message: 'User already exists',
      });
    }

    const hashedPassword = await this.bcryptService.hash(payload.password);
    const verificationCode = codeGenerator();

    const newUser = await this.userRepository.save({
      username: payload.email,
      email: payload.email,
      password: hashedPassword,
      confirmationCode: verificationCode,
    });

    if (!newUser) {
      this.errorsService.InternalServerError({
        message: 'User not created. Error in database.',
      });
    }

    const response: RegisterResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      verified: newUser.verified,
    };

    this.logger.info(
      'RegisterUseCase execute',
      `The user ${payload.email} have been registred.`,
    );
    return right(response);
  }
}
