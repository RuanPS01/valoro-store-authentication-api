import { Either } from '@usecases/helpers/either';
import { ErrorResponse } from '@usecases/port/error-response';
import { AuthenticateResponse } from './authenticate-response';

export type AuthenticateResponseEither = Either<
  ErrorResponse,
  AuthenticateResponse
>;
