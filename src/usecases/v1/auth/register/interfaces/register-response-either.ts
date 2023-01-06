import { Either } from '@usecases/helpers/either';
import { ErrorResponse } from '@usecases/port/error-response';
import { RegisterResponse } from './register-response';

export type RegisterResponseEither = Either<ErrorResponse, RegisterResponse>;
