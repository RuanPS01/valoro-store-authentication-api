import { Either } from '@usecases/helpers/either';
import { ErrorResponse } from '@usecases/port/error-response';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface EmailServicePort {
  sendEmail(
    email: string,
    code: string,
    type: string,
  ): Promise<Either<ErrorResponse, SMTPTransport.SentMessageInfo>>;
}
