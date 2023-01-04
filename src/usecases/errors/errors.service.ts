import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ExceptionPort,
  FormatErrorMessage,
} from '@usecases/port/errors.interface';

@Injectable()
export class ErrorsService implements ExceptionPort {
  BadRequest(data: FormatErrorMessage): void {
    throw new BadRequestException(data);
  }
  InternalServerError(data?: FormatErrorMessage): void {
    throw new InternalServerErrorException(data);
  }
  Forbidden(data?: FormatErrorMessage): void {
    throw new ForbiddenException(data);
  }
  Unauthorized(data?: FormatErrorMessage): void {
    throw new UnauthorizedException(data);
  }
}
