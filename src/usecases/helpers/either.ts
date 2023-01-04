export type Either<L, R> = {
  data: R | null;
  isSuccess: boolean;
  isFailure: boolean;
  error: L | null;
};
