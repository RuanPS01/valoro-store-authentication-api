import { Either } from './either';

export const left = <L>(error: L): Either<L, null> => ({
  data: null,
  isSuccess: false,
  isFailure: true,
  error,
});
