import { Either } from '@usecases/helpers/either';
import { ErrorResponse } from '@usecases/port/error-response';
import { LoginResponse } from './login-response';

export type LoginResponseEither = Either<ErrorResponse, LoginResponse>;
