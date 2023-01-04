export interface FormatErrorMessage {
  message: string;
  codeError?: number;
}

export interface ExceptionPort {
  BadRequest(data: FormatErrorMessage): void;
  InternalServerError(data?: FormatErrorMessage): void;
  Forbidden(data?: FormatErrorMessage): void;
  Unauthorized(data?: FormatErrorMessage): void;
}
