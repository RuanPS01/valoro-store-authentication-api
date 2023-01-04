import { Either } from './either';

export const right = <R>(data: R): Either<null, R> => ({
  data,
  isSuccess: true,
  isFailure: false,
  error: null,
});
