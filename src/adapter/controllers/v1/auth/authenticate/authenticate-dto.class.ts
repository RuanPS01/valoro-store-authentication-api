import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
